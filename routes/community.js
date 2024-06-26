const express = require("express");
const Router = express.Router();
const {createCommunity,getCommunityInfo,editCommunityController} = require("../controllers/communityController");


Router.post("/create-community",createCommunity);
Router.post("/get-community-info",getCommunityInfo);
Router.post("/edit-community-info",editCommunityController);
module.exports = Router;