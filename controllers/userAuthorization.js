const jwt = require("jsonwebtoken");
const userDb = require("../models/userModel");
const userModel = require("../models/userModel");
const debugLog = require("../server");
const userAuthorization = async (req,res)=>{
    try{
        const authenticationHeader = req.headers.authorization;
        if(authenticationHeader){
            const token = authenticationHeader.split(" ")[1];
            const decodedToken = jwt.decode(token,process.env.JWT_SECRET_KEY);
            if(decodedToken){
                const expiryTime = decodedToken.exp;
                const currTime = Math.floor(Date.now() /1000);
                if(expiryTime && currTime > expiryTime){
                    console.log("No session");
                    res.status(401).json({authResponse:"No active session!",status:false});
                }
                else{
                    res.status(200).json({authResponse:"User validated!",status:true});
                }
            }
        }
        else{
            res.status(401).json({authResponse:"no active session!",status:false});
        }
    }
    catch(error){
        res.status(500).json({authResponse:"Something went wrong!",status:false});
    }
}
const sendUserInfo = async (req,res)=>{
    try{
        const token = req.body.token;
        const decodedToken = jwt.decode(token,process.env.JWT_SECRET_KEY);
        const targetEmail = decodedToken.email;
        const userMatch = await userDb.findOne({email:targetEmail}).populate([
            {
                path : "posts followers following savedPosts spaces",
                select : '-password',
            },
            {
                path: 'following',
                populate: {
                  path: 'posts',
                  select: '-password',
                  populate: {
                    path: 'userPosted comments likes dislikes',
                    select: '-password',
                  },
                },
                select: '-password',
            },   
            {
                path : 'following',
                populate : {
                    path : "posts",
                    populate : {
                        path : 'comments',
                        populate : {
                            path : 'commentedUser',
                            select : '-passowrd'
                        }
                    }
                }
            },           
            {
                path : 'posts',
                populate : {
                    path : 'comments',
                    populate : {
                        path : 'commentedUser'
                    }
                },
            },
            {
                path : "posts",
                populate : {
                    path : "likes dislikes"
                }
            },
            ,           
            {
                path : 'savedPosts',
                populate : {
                    path : 'comments',
                    populate : {
                        path : 'commentedUser'
                    }
                },
            },
            {
                path : "savedPosts",
                populate : {
                    path : "likes dislikes userPosted"
                }
            },
            {
                path : "recentChats"
            }
        ]).exec();
        if(userMatch){
            res.status(200).json({userData:userMatch,status:true});
        }
        else{
            res.status(401).json({userData:"Critical security alert!",status:false});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({userData:"Something went wrong!",status:false});
    }
}
module.exports = {userAuthorization,sendUserInfo};