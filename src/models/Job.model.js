
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
            enum: ['Pending', 'Accepted', 'Rejected'], // Add possible status values
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

export const Job= mongoose.model('Job',jobSchema);