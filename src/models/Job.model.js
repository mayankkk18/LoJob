// const mongoose=require('mongoose');
import mongoose, {Schema} from "mongoose";
const jobSchema=new Schema({
    title:{
        type :String,
        required :true
    },
    description: {
        type: String,
        required: true
    },
    // dateposted: {
    //     type: Date,
    //     required: true
    // },
    skills: {
        type: String
    },
    location: {
        type: String
    },
    experience: {
        type: Number
    },
    basesalary: {
        type: String
    },
    company: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
 

    applicants: [{
        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            default: 'Pending'
        },
        notification: {
            type: String,
            default: 'no'
        }
    }]
},{
    timestamps:true
});

// const Job = mongoose.model('Job',jobSchema);
// module.exports=Job;
export const Job= mongoose.model('Job',jobSchema);