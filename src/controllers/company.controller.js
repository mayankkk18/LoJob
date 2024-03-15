import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Company } from "../models/company.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokens = async(userId) =>{
    try {
        const company = await Company.findById(userId)
        const accessToken = company.generateAccessToken()

        return accessToken

    } catch (error) {
        throw new ApiError(500, "Something went wrong while access token")
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

   const accessToken = await generateAccessTokens(company._id)

    const loggedInCompany = await User.findById(company._id).select("-password")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                company: loggedInCompany, accessToken
            },
            "Company logged In Successfully"
        )
    )

})

export {
    registerCompany,
    loginCompany
}