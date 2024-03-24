import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from "../models/user.model.js";
import { Job } from "../models/Job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const applyForJob = asyncHandler(async (req, res) => {
    // try {
        // Get the job ID from the request parameters
        const { jobId } = req.params;

        // Get the user ID from the request user object
        const userId = req.user._id;

        // Find the job by ID
        const job = await Job.findById(jobId);
        
        // Check if the job exists
        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        // Check if the user has already applied for this job
        const existingApplicant = job.applicants.find(applicant => applicant.user.toString() === userId);
        if (existingApplicant) {
            throw new ApiError(400, 'User has already applied for this job');
        }

        // Add the user to the job's applicants list
        job.applicants.push({ user: userId });

        // Save the updated job object
        await job.save();

        // Return success response
        return res.status(200).json(new ApiResponse(200, null, 'Application submitted successfully'));
    // } catch (error) {
    //     // If an error occurs, handle it and return an error response
    //     throw new ApiError(500, 'Internal server error');
    // }
});

const createJob = asyncHandler(async (req, res) => {
    const {title , description} = req.body
    const company = req.company._id;


    if (
        [title , description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const job = await Job.create({
        title,
        description,
        company
  
    })

    const createdJob = await Job.findById(job._id)

    if (!createdJob) {
        throw new ApiError(500, "Something went wrong while creating the job")
    }

    return res.status(201).json(
        new ApiResponse(200, createdJob, "Job posted Successfully")
    )
})

export {
    applyForJob,
    createJob
} 
