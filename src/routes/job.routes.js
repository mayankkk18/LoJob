import { Router } from "express";
import { 
    applyForJob
} from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/apply:jobId").post(verifyJWT,applyForJob)
// router.route("/getJob").get
export default router