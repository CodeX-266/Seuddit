const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* CREATE COMMENT */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { post_id, content, parent_comment_id } = req.body;

    const newComment = await pool.query(
      `INSERT INTO comments (post_id, user_id, content, parent_comment_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        post_id,
        req.user.userId,
        content,
        parent_comment_id || null
      ]
    );

    res.status(201).json(newComment.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


/* GET COMMENTS FOR A POST */
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await pool.query(
      `SELECT c.*, u.name AS author
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE post_id = $1
       ORDER BY created_at ASC`,
      [req.params.postId]
    );

    res.json(comments.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
