import { Router } from "express";
import { 
    registerCompany,
    loginCompany,
    logoutCompany
} from "../controllers/company.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerCompany)
router.route("/login").post(loginCompany)
router.route("/logout").post(verifyJWT,  logoutCompany)

export default router