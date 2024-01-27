const {chatDb} = require("../models/chatModel");
const {messageDb} = require("../models/chatModel");
const {getSession} = require("../db/dataBase");
const userDb = require("../models/userModel");
const getChat = async (req,res)=>{
    const {chatId} = req.body;
    try{
        const chats = await chatDb.findOne({id:chatId}).populate("chats chats.user");
        if(chats){
            res.status(200).json({message:"Success",status:true,data:chats});
        }
        else{
            const chatSession = await new chatDb({
                id : chatId
            });
            await chatSession.save();
            res.status(200).json({message:"Success",status:true,data:chatSession});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}

const addMessage = async (req,res)=>{
    const {chatId,userId,message} = req.body;
    const session = await getSession();
    try{
        const chatSessionMatch = await chatDb.findOne({id:chatId});
        const userMatch = await userDb.findOne({_id:userId});
        if(userMatch){
            if(chatSessionMatch){
                await session.withTransaction(async ()=>{
                    const newMessage = await new messageDb({
                        user : userMatch._id,
                        message : message,
                    });
                    await newMessage.save();
                    await chatSessionMatch.chats.push(newMessage);
                    await chatSessionMatch.save();
                    res.status(200).json({message:"Success",status:true});
                })
            }
            else{
                res.status(401).json({message:"No chat room found!",status:false});
            }
            // session.commitTransaction();
        }
        else{
            res.status(401).json({message:"Critical Security threat!",status:false});
        }
    }
    catch(error){
        console.log(error);
        // session.abortTransaction();
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}

module.exports = {getChat,addMessage};