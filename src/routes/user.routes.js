import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser,
    subscribeCompany
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/subs/:companyId").post(verifyJWT,subscribeCompany)

export default router