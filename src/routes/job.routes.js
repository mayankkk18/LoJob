import { Router } from "express";
import { 
    applyForJob,
    createJob
} from "../controllers/job.controller.js";
import { updateStatus } from "../controllers/company.controller.js";
import { verifyJWTCo } from "../middlewares/auth.company.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/apply/:jobId").post(verifyJWT,applyForJob)
router.route("/create").post(verifyJWTCo,createJob)
router.route("/:jobId/users/:userId/status").put(verifyJWTCo,updateStatus)

// router.route("/getJob").get
export default router