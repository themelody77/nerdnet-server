const postDb = require("../models/postModel");
const userDb = require("../models/userModel");
const {getSession} = require("../db/dataBase");
const { communityModel } = require("../models/communityModel");
const addNewPost = async (req,res)=>{
    try{
        const {email,postTo} = req.body.backendData;
        const userMatch = await userDb.findOne({email:email});
        const session = await getSession();
        if(userMatch){
            if(postTo === "user"){
                const newPost = new postDb({
                    isMultimedia : req.body.backendData.isMultimedia,
                    userPosted : userMatch,
                    postData : req.body.backendData.postData,
                    likes : [],
                    dislikes : [],
                    comments : [],
                    caption : req.body.backendData.caption ? req.body.backendData.caption : "",
                    time : Date.now(),
                    tags : req.body.backendData.tags ? req.body.backendData.tags : ["others"]
                });
                await session.withTransaction(async()=>{
                    await newPost.save();
                    await userMatch.posts.push(newPost);
                    await userMatch.save();
                    res.status(200).json({postStatus:"Post added succesfully",status:true});
                }).catch(error=>{
                    console.log('Transaction failed:', error);
                    throw error;
                })
            }
            else{
                const communityMatch = await communityModel.findById(postTo);
                if(communityMatch){
                    const newPost = new postDb({
                        isMultimedia : req.body.backendData.isMultimedia,
                        userPosted : userMatch,
                        postData : req.body.backendData.postData,
                        likes : [],
                        dislikes : [],
                        comments : [],
                        caption : req.body.backendData.caption ? req.body.backendData.caption : "",
                        time : Date.now(),
                        tags : req.body.backendData.tags ? req.body.backendData.tags : ["others"]
                    })
                    await session.withTransaction(async()=>{
                        await newPost.save();
                        await userMatch.posts.push(newPost);
                        await userMatch.save();
                        await communityMatch.posts.push(newPost);
                        await communityMatch.save();
                        res.status(200).json({postStatus:"Post added succesfully",status:true});
                    }).catch(error=>{
                        console.log('Transaction failed:', error);
                        throw error;
                    })
                }
                else{
                    res.status(401).json({postStatus:"No community found!",status:false});
                }
            }
        }
        else{
            res.status(401).json({postStatus:"No user found!",status:false});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({postStatus:"Something went wrong!",status:false});
    }
}
module.exports = addNewPost;