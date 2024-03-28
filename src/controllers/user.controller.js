import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { Post } from "../models/Post.model.js";
import { Job } from "../models/Job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password } = req.body

    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email})

    if (existedUser) {
        throw new ApiError(409, "User with email exists")
    }

    const user = await User.create({
        name,
        email, 
        password,
  
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{

    const {email, password} = req.body
    console.log(email);

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const subscribeCompany = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    const company = req.params.companyId
    if (user.subs.includes(company)) {
        throw new ApiError(409, "Comapany already subscribed")
    }
    
    user.subs.push(company);
    await user.save();
    

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Company added to subs"))
})

const deleteUser = asyncHandler(async (req, res) => {
    // Get the authenticated user's ID from the request object
    const userId = req.user._id;

    // Find the user in the database using the user's ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    // Return a success response
    res.status(200).json({ message: "User deleted successfully" });
});


const viewProfile = asyncHandler( async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res
    .status(200)
    .json(user);
} )

const viewProfile2 = asyncHandler( async (req, res) => {
    const {userId} = req.params;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res
    .status(200)
    .json(user);
} )

const viewHomePost = asyncHandler( async (req, res) =>{
    const pipeline = [
        {
            $lookup: {
                from: 'companies', // Assuming your Company model is named 'Company'
                localField: 'user',
                foreignField: '_id',
                as: 'companyDetails'
            }
        },
        {
            $unwind: {
                path: '$companyDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                companyDetails: 1
                // 'companyDetails.name': 1,
                // 'companyDetails.location': 1,
                // 'companyDetails.description': 1
                // Add other fields from Company model if needed
          }
     }
];

 const posts = await Post.aggregate(pipeline).sort({ createdAt: -1 });
    return res.json(posts)

})

const viewHomeJob = asyncHandler( async (req, res) =>{
    const pipeline = [
        {
            $lookup: {
                from: 'companies', // Assuming your Company model is named 'Company'
                localField: 'company',
                foreignField: '_id',
                as: 'companyDetails'
            }
        },
        {
            $unwind: {
                path: '$companyDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                skills: 1,
                location: 1,
                experience: 1,
                basesalary: 1,
                createdAt: 1,
                updatedAt: 1,
                companyDetails: 1
                // 'companyDetails.name': 1,
                // 'companyDetails.location': 1,
                // 'companyDetails.description': 1
                // Add other fields from Company model if needed
          }
     }
];

 const jobs = await Job.aggregate(pipeline).sort({ createdAt: -1 });
return res.json(jobs)

})


export {
    registerUser,
    loginUser,
    logoutUser,
    subscribeCompany,
    deleteUser,
    viewProfile,
    viewProfile2,
    viewHomePost,
    viewHomeJob
}