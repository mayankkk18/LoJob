import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Company } from "../models/company.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(companyId) =>{
    try {
        const company = await Company.findById(companyId)
        const accessToken = company.generateAccessToken()
        const refreshToken = company.generateRefreshToken()

        company.refreshToken = refreshToken
        await company.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

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

const loginCompany = asyncHandler(async (req, res) =>{

    const {email, password} = req.body
    console.log(email);

    if (!email) {
        throw new ApiError(400, "email is required")
    }

    const company = await Company.findOne({email})

    if (!company) {
        throw new ApiError(404, "Company does not exist")
    }

   const isPasswordValid = await company.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid company credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(company._id)

    const loggedInCompany = await Company.findById(company._id).select("-password -refreshToken")

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
                user: loggedInCompany, accessToken
            },
            "Company logged In Successfully"
        )
    )

})

const logoutCompany = asyncHandler(async (req, res) => {
    await Company.findByIdAndUpdate(
        req.company._id,
        {
            $unset: {
                refreshToken: 1 // Remove the refreshToken field from the document
            }
        },
        {
            new: true // Return the updated document after update
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Company logged Out"));
});


export {
    registerCompany,
    loginCompany,
    logoutCompany
}