import { Router } from "express";
import { 
    registerCompany,
    loginCompany
} from "../controllers/company.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerCompany)
router.route("/login").post(loginCompany)
// router.route("/logout").post(verifyJWT,  logoutUser)

export default router