const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


const communityRoutes = require("./routes/communityRoutes");
app.use("/api/communities", communityRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes);

const voteRoutes = require("./routes/voteRoutes");
app.use("/api/votes", voteRoutes);

const lostAndFoundRoutes = require("./routes/lostAndFoundRoutes");
app.use("/api/lost-and-found", lostAndFoundRoutes);

const academicRoutes = require("./routes/academicRoutes");
app.use("/api/academic", academicRoutes);

app.get("/", (req, res) => {
  res.send("CampusSphere Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
