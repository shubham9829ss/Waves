const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
    
    tweet: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    code :{
        type:String 
    },
    title :{
        type:String
    },
    tags : [
        {
            type:String
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    answers: [
        {
            avatar: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            comment: {
                type: String
            },
            CODE :{
                type :String
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model("Post", PostSchema);