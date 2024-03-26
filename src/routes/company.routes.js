import { Router } from "express";
import { 
    registerCompany,
    loginCompany,
    logoutCompany
    // deleteCompany
} from "../controllers/company.controller.js";
import { verifyJWTCo } from "../middlewares/auth.company.middleware.js";


const router = Router()

router.route("/register").post(registerCompany)
router.route("/login").post(loginCompany)
router.route("/logout").post(verifyJWTCo,  logoutCompany)
// router.route("/delete").delete(verifyJWTCo,deleteCompany)

export default router