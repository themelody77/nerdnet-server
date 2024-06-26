const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    dp : {
        type : String,
        default : "https://i.pinimg.com/736x/b2/54/ea/b254ea1ec256b93c61aecb2aca62e277.jpg"
    },
    username : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    password : {
        type : String,
        required : true
    },
    education : {
        type : String,
        default : "Enthusiast at Nerd.net"
    },
    posts : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "posts",
    },
    followers : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "users",
        default : [],
    },
    following : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "users",
        default : [],
    },
    joined : {
        type : Date,
        required : true,
        default : Date.now
    },
    savedPosts : {
        type : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'posts'
        }],
        default : []
    },
    recentChats : {
        type : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'users'
            },
        ],
        default : []
    },
    spaces : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "communities"
        }
    ],
    isAdmin : {
        type : String,
        required:false,
        default : "false"
    },
    interestsHistory : [{
        type : String,
        required: false
    }],
    notifications : [{
        from : {
            type : String,
            required : true
        },
        to : {
            type : String,
            required : true
        },
        message : {
            type : String,
            required : true
        }
    }]
});

function noDuplicateUsers(value) {
    return Array.isArray(value) && new Set(value).size === value.length;
}
userSchema.path("spaces").validate({
    validator: noDuplicateUsers,
    message: 'Duplicate spaces are not allowed'
});
userSchema.path("posts").validate({
    validator: noDuplicateUsers,
    message: 'Duplicate posts are not allowed'
});
userSchema.path("followers").validate({
    validator: noDuplicateUsers,
    message: 'Duplicate followers are not allowed'
});
userSchema.path("following").validate({
    validator: noDuplicateUsers,
    message: 'Duplicate following are not allowed'
});
const userModel = mongoose.model("users",userSchema);
module.exports = userModel;