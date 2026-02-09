const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* CREATE POST */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { community_id, title, content } = req.body;

    const newPost = await pool.query(
      `INSERT INTO posts (community_id, user_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [community_id, req.user.userId, title, content]
    );

    res.status(201).json(newPost.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET POSTS BY COMMUNITY */
router.get("/community/:id", async (req, res) => {
  try {
    const posts = await pool.query(
      `SELECT p.*, u.name AS author
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE community_id = $1
       ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json(posts.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
