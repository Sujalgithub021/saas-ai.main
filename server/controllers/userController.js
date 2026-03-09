import sql from "../configs/db.js"


export const getUserCreations = async (req, res)=>{
    try{
        const {userId} = req.auth()

      const result = await sql`SELECT * FROM creations WHERE user_id= ${userId} ORDER BY created_at DESC`;
       const creations = result.rows

        res.json({ success: true, creations});

    } catch (error){
        res.json({ success: false, message: error.message});

    }
}

export const getPublishedCreations = async (req, res)=>{
    try{
      const result = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
      const creations = result.rows 
      res.json({ success: true, creations});
    } catch (error){
        res.json({ success: false, message: error.message});
    }
}

export const toggleLikeCreations = async (req, res)=>{
    try{

        const {userId} = req.auth()
        const {id} = req.body

        const result = await sql`SELECT * FROM creations WHERE id= ${id}`
        const creations = result.rows[0]        
        if(!creations){
            return res.json({success: false, message: "creations not found"})
        }

        const currentLikes = creations.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if(currentLikes.includes(userIdStr)){
            updatedLikes = currentLikes.filter((user)=>user !== userIdStr);
            message = 'Creations Unliked'
        } else{
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creations Liked'
        }

        const formattedArray = `{${updatedLikes.join(',')}}`

        await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

        res.json({ success: true, message});

    } catch (error){
        res.json({ success: false, message: error.message});

    }
}