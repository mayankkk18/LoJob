import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Company } from "../models/company.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

// const generateAccessTokens = async(userId) =>{
//     try {
//         const user = await User.findById(userId)
//         const accessToken = user.generateAccessToken()

//         return accessToken

//     } catch (error) {
//         throw new ApiError(500, "Something went wrong while access token")
//     }
// }

const registerCompany = asyncHandler( async (req, res) => {
    const {companyName, email, password } = req.body

    if (
        [companyName, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedCompany = await Company.findOne({email})

    if (existedCompany) {
        throw new ApiError(409, "User with email exists")
    }

    const company = await Company.create({
        companyName,
        email, 
        password,
  
    })

    const createdCompany = await Company.findById(company._id).select(
        "-password"
    )

    if (!createdCompany) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdCompany, "User registered Successfully")
    )

} )

// const loginUser = asyncHandler(async (req, res) =>{

//     const {email, password} = req.body
//     console.log(email);

//     if (!email) {
//         throw new ApiError(400, "email is required")
//     }

//     const user = await User.findOne({email})

//     if (!user) {
//         throw new ApiError(404, "User does not exist")
//     }

//    const isPasswordValid = await user.isPasswordCorrect(password)

//    if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid user credentials")
//     }

//    const accessToken = await generateAccessTokens(user._id)

//     const loggedInUser = await User.findById(user._id).select("-password")

//     const options = {
//         httpOnly: true,
//         secure: true
//     }

//     return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .json(
//         new ApiResponse(
//             200, 
//             {
//                 user: loggedInUser, accessToken
//             },
//             "User logged In Successfully"
//         )
//     )

// })

export {
    registerCompany
}