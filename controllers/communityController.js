const { communityModel } = require("../models/communityModel");
const userModel = require("../models/userModel");

const createCommunity = async(req,res)=>{
    try {
        const data = req.body;
        const userMatch = await userModel.findOne({_id:data.user});
        if(userMatch)
        {
            const newCommunity = await new communityModel(
                {
                    name : data.community_name,
                    dp : data.community_dp,
                    coverPic : data.community_cover_pic,
                    subject : data.subject,
                    description : data.description,
                    createdBy : data.user,
                    dateCreated : Date.now(),
                    followers : [data.user],
                    admins : [data.user]
                }
            );
            await newCommunity.save();
            await userModel.findOneAndUpdate({_id:data.user},{
                $addToSet : { 
                    spaces : newCommunity._id
                }
            });
            res.status(200).json({message:"Added new community!",status:true,result:newCommunity._id});
        }
        else{
            res.status(401).json({message:"User not found!",status:false});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
const getCommunityInfo = async({socket,data})=>{
    try {
        const community_match = await communityModel.findOne({_id:data.id}).populate([
            {
                path : "posts",
                populate : {
                    path : "userPosted likes dislikes comments"
                }
            },
            {
                path : "posts",
                populate : {
                    path : "comments",
                    populate : {
                        path : "commentedUser",
                        select : "-password"
                    }
                }
            },
            {
                path : "assessments"
            }
        ]);
        if(community_match){
            return ({message:"Community found",status:true,community_info:community_match});
        }
        else{
            return {message:"Community not found!",status:false};
        }
    } catch (error) {
        console.log(error)
        return {message:"Something went wrong!",status:false};
    }
}
const checkUserSubscription = async({socket,data})=>{
    try {
        const userMatch = await userModel.findOne({_id:data.user_id});
        const communityMatch = await communityModel.findOne({_id:data.community_id});
        if(userMatch && communityMatch){
            if(communityMatch.followers.includes(userMatch._id)){
                return ({message:"Successfull check!",status:true,subscriptionStatus:true});
            }
            else{
                return ({message:"Successfull check!",status:true,subscriptionStatus:false});
            }
        }
        else{
            return ({message:"User or Community not found!",status:false});
        }
    } catch (error) {
        console.log(error);
        return ({message:"Something went wrong!",status:false});
    }
}
const editCommunityController = async (req,res)=>{
    try {
        const {dp,coverPic,description,community_id} = req.body;
        const communityMatch = await communityModel.findOne({_id:community_id});
        if(communityMatch){
            const updatedCommunity = await communityModel.findOneAndUpdate({_id:community_id},{
                $set : {
                    dp : dp.length ? dp : communityMatch.dp
                },
                $set : {
                    coverPic : coverPic.length ? coverPic : communityMatch.coverPic
                },
                $set : {
                    description : description.length ? description : communityMatch.description
                }
            });
            return res.status(200).json({message:"Successfull update!",status:true});
        }
        else{
            return res.status(401).json({message:"No community found!",status:false});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {createCommunity,getCommunityInfo,checkUserSubscription,editCommunityController};