import Article from '../models/postModel.js';
import User from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createArticle = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!req.file) {
            console.log('No file uploaded');
            return;

        }


        console.log('Uploading file buffer:', req.file.buffer);

     const result = await cloudinary.uploader.upload(req.file.path,
    { resource_type: 'auto' });
    (error, result) => {
        if (error) {
            console.error('Error uploading to Cloudinary:', error);
        } else {
            console.log('Upload successful. Cloudinary response:');
            console.log('Image URL:', result.secure_url); // Log the image URL
            resolve(result);
        }
    }
;



        const article = new Article({
            ...req.body,
            image: result.secure_url,
            Author: user.firstName,
        });

        await article.save();
        res.status(201).send(article);
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(400).send({ error: error.message });
    }
};



// Update an existing article
export const updateArticle = async (req, res) => {
    try {
        // Ensure required fields are present
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).send({ error: 'Title and content are required.' });
        }

        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send({ error: 'Article not found.' });
        }

        // Check if the user is the owner of the article
        if (article.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'User not authorized to update this article.' });
        }

        // Update the article
        article.title = title;
        article.content = content;
        await article.save();

        res.status(200).send(article);
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(400).send({ error: error.message });
    }
};




