const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/dataBase.js");
const authRoute = require("./routes/authentication.js");
const postRoute = require("./routes/postRouting.js");
const statRoute = require("./routes/stats.js");
const express = require("express");
const cors = require("cors");
const userDb = require("./models/userModel.js");
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth/", authRoute);
app.use("/api/posts/",postRoute);
app.use("/api/stats/",statRoute);

app.listen(3500, () => {
    console.log("Server running!");
});
