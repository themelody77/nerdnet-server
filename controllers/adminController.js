const userModel = require("../models/userModel");

const addAdminController = async (req,res)=>{
    const {receiver_mail,admin} = req.body;
    try {
        const adminMatch = await userModel.findOne({_id:admin});
        const notification = {
            from : adminMatch.username,
            to : receiver_mail,
            message : `${adminMatch.username} wants you to be admin!`
        }
        const updatedPrevilage = await userModel.findOneAndUpdate({email:receiver_mail},
            {
                $set : {
                    isAdmin : "pending"
                },
                $push : {
                    notifications : notification
                }
            });
        if(updatedPrevilage){
            await updatedPrevilage.save();
            res.status(200).json({message:"Successfull invite to admin",status:true});
        }
        else{
            res.status(401).json({message:"User not found!",status:false});
        }
    } catch (error) {
        console.log(error," at add admin")
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
const getPendingInvites = async(req,res)=>{
    const pageSize = 5;
    const {pageNum} = req.body;
    try {
        const totalPages = await userModel.countDocuments({isAdmin:"pending"});
        const pendingUsers = await userModel.find({isAdmin:"pending"}).skip((pageNum-1)*pageNum).limit(pageSize);
        res.status(200).json({message:"Successfull retreival",status:true,pending_invites:pendingUsers,total_pages:totalPages});
    } catch (error) {
        console.log(error," at get pending invites")
        res.status(500).json({message:"Something went wrong!",status:false});
    }
}
module.exports = {addAdminController,getPendingInvites};