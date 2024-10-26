import express from 'express';
import * as dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
import Post from '../models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//get all posts
router.route('/').get(async(req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// create a post
router.route('/').post(async(req, res) => {
    try {
        const { name, prompt, photo } = req.body;

        // Validate input
        if (!name || !prompt || !photo) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide name, prompt and photo" 
            });
        }

        // Ensure photo is a base64 data URL
        if (!photo.startsWith('data:image/')) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid image format. Must be a base64 data URL" 
            });
        }

        console.log("Attempting to upload image to Cloudinary...");
        const photoUrl = await cloudinary.uploader.upload(photo, {
            upload_preset: 'ml_default', // optional: specify an upload preset
        });

        console.log("Creating new post in database...");
        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url,
        });

        console.log("Post created successfully");
        res.status(201).json({ success: true, data: newPost });

    } catch (error) {
        console.error("Error in post creation:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "An error occurred while creating the post" 
        });
    }
});

export default router;