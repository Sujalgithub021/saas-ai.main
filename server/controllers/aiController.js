import OpenAI from "openai";
import sql from '../configs/db.js'
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'


const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res)=>{ 
    try{
        const {userId} = req.auth();
        const {prompt, length} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({success: false, message: "limit reached. Upgrade to continue."})
        }

        const response = await AI.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [{
            role: "user",
            content: prompt,
        },
    ],
    temperature: 0.7,
    max_tokens: length * 2,
});

const content = response.choices[0].message.content

await sql` INSERT INTO creations (user_id, prompt, content, type)
VALUES (${userId}, ${prompt}, ${content}, 'article')`;

if(plan !== 'premium'){
    await clerkClient.users.updateUserMetadata(userId,{
        privateMetadata:{
            free_usage: free_usage + 1
        }
    })
}

res.json({success: true, content})

    } catch (error){
        console.log(error.message)
        res.json({success:false, message: error.message})

    }
}

export const generateBlogTitle = async (req, res)=>{
    try{
        const {userId} = req.auth();
        const {prompt} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({success: false, message: "limit reached. Upgrade to continue."})
        }

    const response = await AI.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
        {
            role: "system",
            content: "You are a blog title generator. Always generate exactly 10 creative blog title ideas as a numbered list. Nothing else."
        },
        {
            role: "user",
            content: prompt,
        }
    ],
    temperature: 0.7,
    max_tokens: 500,
});

const content = response.choices[0].message.content

await sql` INSERT INTO creations (user_id, prompt, content, type)
VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

if(plan !== 'premium'){
    await clerkClient.users.updateUserMetadata(userId,{
        privateMetadata:{
            free_usage: free_usage + 1
        }
    })
}

res.json({success: true, content})

    } catch (error){
        console.log(error.message)
        res.json({success:false, message: error.message})

    }
}


export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, style } = req.body;

    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' ' + style)}?width=1024&height=1024&nologo=true`;

    
    await sql`INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${imageUrl}, 'image')`;

    res.json({ success: true, content: imageUrl });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res)=>{
    try{
        const {userId} = req.auth();
        const image = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({success: false, message: "This features is only for premium users"})
        }

        const formData = new FormData()
        const imageBuffer = fs.readFileSync(image.path)
        const blob = new Blob([imageBuffer], { type: image.mimetype })
        formData.append('image_file', blob, image.originalname)
        formData.append('size', 'auto')

        const { data } = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY },
            responseType: 'arraybuffer'
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data).toString('base64')}`

        await sql`INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, 'Remove background from image', ${base64Image}, 'image')`

        res.json({success: true, content: base64Image})

    } catch (error){
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

export const removeImageObject = async (req, res)=>{
    res.json({success: false, message: "Object removal feature coming soon!"})
}

export const resumeReview = async (req, res)=>{
    try{
        const {userId} = req.auth();
        const resume = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({success: false, message: "This features is only for premium users"})
        }

        if(resume.size > 5 * 1024 * 1024){
            return res.json({success: false, message: "Resume file size exceeds allowed size (5MB)."})
        }

        const dataBuffer = fs.readFileSync(resume.path)
        const pdfData = await pdf(dataBuffer)

        const prompt = `Review the following resume and provide constructive feedback on its strength , weakness , and areas for improvment. 
        REsume Content:\n\n${pdfData.text}`

    const response = await AI.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [{role: "user",content: prompt,},],
    temperature: 0.7,
    max_tokens: 3000,
});

const content = response.choices[0].message.content

await sql`INSERT INTO creations (user_id, prompt, content, type)
VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;


res.json({success: true, content})

    } catch (error){
        console.log(error.message)
        res.json({success:false, message: error.message})

    }
}