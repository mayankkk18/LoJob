import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from "../models/user.model.js";
import { Job } from "../models/Job.model.js";
import { Company } from "../models/company.model.js";
import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const companyId = req.company._id;

    if (!content) {
        throw new ApiError(400, "Content is required for the post");
    }

    const company = await Company.findById(companyId);
    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    const post = await Post.create({
        content,
        user: companyId
    });

    if (!post) {
        throw new ApiError(500, "Something went wrong while creating the post");
    }

    return res.status(201).json(new ApiResponse(200, post, "Post created successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const companyId = req.company._id;

    const company = await Company.findById(companyId);
    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.user.toString() !== companyId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

export {
    createPost,
    deletePost
};