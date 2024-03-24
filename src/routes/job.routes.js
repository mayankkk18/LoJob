import { Router } from "express";
import { 
    applyForJob,
    createJob
} from "../controllers/job.controller.js";
import { verifyJWTCo } from "../middlewares/auth.company.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/apply/:jobId").post(verifyJWT,applyForJob)
router.route("/create").post(verifyJWTCo,createJob)

// router.route("/getJob").get
export default router