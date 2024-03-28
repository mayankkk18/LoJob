import { Router } from "express";
import { 
    createPost,
    deletePost
    // deletePostbyCompany
} from "../controllers/post.controller.js";
import { verifyJWTCo } from "../middlewares/auth.company.middleware.js";


const router = Router()

router.route("/create").post(verifyJWTCo,createPost);

router.route("/:postId/delete").delete(verifyJWTCo, deletePost); 

export default router