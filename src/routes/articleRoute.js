import express from "express";
const router=express.Router()
import{ getarticles, getArticle, getarticle, getRandomArticles } from '../controllers/articleController.js'
import {addComment} from '../controllers/articleController.js'
import auth from "../middleware/auth.js";

router.get("/", getarticles)
router.get('/articles', auth,  getArticle);
router.get("/:id", getarticle)

router.get("/other", getRandomArticles)

router.post("/:id/comment", auth, addComment);

export default router