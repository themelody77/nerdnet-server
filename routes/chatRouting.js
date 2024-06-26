const express = require("express");
const Router = express.Router();
const {getChat} = require("../controllers/chatController");
const {addMessage} = require("../controllers/chatController");
const {addRecentChats} = require("../controllers/chatController");
Router.post("/get-chat",getChat);
Router.post("/add-message",addMessage);
Router.post("/add-recent-chats",addRecentChats);
module.exports = Router;