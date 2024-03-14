import mongoose, {Schema} from "mongoose";
const companySchema = new Schema({
    companyName:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true,

    }
},{
    timestamps:true
});


export const Company= mongoose.model('Company',companySchema);
