const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        community : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "communities"
        },
        name : {
            type : String,
            required: true
        },
        questions : [
            {
                question : {
                    type : String,
                    required : true
                },
                options : [
                    {
                        text : {
                            type : String,
                            required : true
                        }
                    }
                ],
                ans : {
                    type : String,
                    required : true
                }
            }
        ],
        leaderboard : [{
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "users"
            },
            score : {
                type : Number
            }
        }],
        outOf : {
            type : Number
        }
    }
)
const assignmentModel = new mongoose.model("assingments",assignmentSchema);
module.exports = assignmentModel;