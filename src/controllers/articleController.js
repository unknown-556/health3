import Article from "../models/postModel.js";
import User from "../models/userModel.js";

export const addComment = async (req, res, next) => {
    const { comment } = req.body;
    try {
        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { text: comment, postedBy: req.user.firstName } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            updatedArticle,
        });
    } catch (error) {
        next(error);
    }
};




export const getarticles = async (req,res) => {
    try{
        const allarticles = await Article.find()
        if(!allarticles){
            res.status(400).json ({message:'No articles found in database'})
        }else {
            console.log({message:'articles found successfully',allarticles})
            return res.json({allarticles})
        }
    
        }   catch (error) {
            console.error ('Error while getting all articles')
            res.status(500).json({message:error.message})
            console.error(error);
        }
}    


export const getArticle = async (req, res) => {
    


    try {
        const name = req.user.name
        const articles = await Article.find({ Author: name });

        if (articles.length === 0) {
            return res.status(404).json({ message: 'No articles found for this author' });
        } else {
            console.log('Articles found successfully', articles);
            return res.json({ articles });
        }
    } catch (error) {
        console.error('Error while getting articles');
        return res.status(500).json({ message: error.message });
    }
};




export const getarticle = async (req, res) => {
    try {
        const articleId = req.params.id; 
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: `No article with ID: ${articleId} found` });
        } else {
            console.log('Articles found successfully', article);
            // return res.status(200).json({ message: 'Article found successfully', singleArticle });
            return res.json({article});
            
        }
    } catch (error) {
        console.error('Error while getting article', error);
        return res.status(500).json({ message: error.message });
    }
};



export const getRandomArticles = async (req, res, next) => {
    try {
        const randomArticles = await Article.aggregate([{ $sample: { size: 3 } }]);
        res.status(200).json(randomArticles);
    } catch (error) {
        next(error);
    }
};

