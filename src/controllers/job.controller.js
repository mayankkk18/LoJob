import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from "../models/user.model.js";
import { Job } from "../models/Job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const applyForJob = asyncHandler(async (req, res) => {
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

    // Update the applied_jobs array in the user model
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    } 
    user.applied_jobs.push(jobId);
    await user.save();

    // Return success response
    return res.status(200).json(new ApiResponse(200, null, 'Application submitted successfully'));
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

// Define the route handler for deleting a job
const deleteJob = asyncHandler(async (req, res) => {
    // Extract the job ID from the request parameters
    const jobId = req.params.jobId;

    // Assuming companyId is obtained from the authenticated company
    const companyId = req.company._id;

    // Find the job in the database
    const job = await Job.findById(jobId);

    // Check if the job exists and belongs to the logged-in company
    if (!job || job.company.toString() !== companyId.toString()) {
        throw new ApiError(404, "Job not found or does not belong to the company");
    }

    // Delete the job from the database
    await Job.findByIdAndDelete(jobId);

    // Return a success response
    res.status(200).json({ message: "Job deleted successfully" });
});

export {
    applyForJob,
    createJob,
    deleteJob
} 
