import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';


const app = express()

await connectCloudinary()

app.use(cors({
  origin: [
    'https://saas-ai-main.vercel.app',
    'http://localhost:5173'
  ]
}))
app.use(express.json())
app.use(clerkMiddleware())


app.get('/', (req, res)=>res.send('server is live!'))

app.use(requireAuth());

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT , ()=>{
    console.log('server is running on port', PORT);
})