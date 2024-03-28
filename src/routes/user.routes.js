import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser,
    subscribeCompany,
    viewProfile,
    viewProfile2,
    viewHomePost,
    viewHomeJob
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/subs/:companyId").post(verifyJWT,subscribeCompany)
router.route("/view").get(verifyJWT,viewProfile)
router.route("/view/:userId").get(viewProfile2)
router.route("/home/post").get(viewHomePost)
router.route("/home/job").get(viewHomeJob)

// router.route("/delete").delete(verifyJWT,deleteUser)

export default router