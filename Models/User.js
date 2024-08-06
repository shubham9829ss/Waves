const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    followers :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
    
})

UserSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("User", UserSchema);