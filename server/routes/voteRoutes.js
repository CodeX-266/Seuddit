const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* VOTE ON POST */
router.post("/post", authMiddleware, async (req, res) => {
  try {
    const { post_id, vote_type } = req.body;
    const user_id = req.user.userId;

    const existingVote = await pool.query(
      "SELECT * FROM votes WHERE user_id = $1 AND post_id = $2",
      [user_id, post_id]
    );

    if (existingVote.rows.length > 0) {
      // Update vote
      await pool.query(
        "UPDATE votes SET vote_type = $1 WHERE user_id = $2 AND post_id = $3",
        [vote_type, user_id, post_id]
      );
    } else {
      // Insert vote
      await pool.query(
        "INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3)",
        [user_id, post_id, vote_type]
      );
    }

    // Recalculate vote score
    const scoreResult = await pool.query(
      `SELECT 
         SUM(CASE WHEN vote_type = 'UPVOTE' THEN 1 ELSE -1 END) AS score
       FROM votes
       WHERE post_id = $1`,
      [post_id]
    );

    const newScore = scoreResult.rows[0].score || 0;

    await pool.query(
      "UPDATE posts SET vote_score = $1 WHERE id = $2",
      [newScore, post_id]
    );

    res.json({ message: "Vote recorded", vote_score: newScore });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* VOTE ON COMMENT */
router.post("/comment", authMiddleware, async (req, res) => {
  try {
    const { comment_id, vote_type } = req.body;
    const user_id = req.user.userId;

    const existingVote = await pool.query(
      "SELECT * FROM votes WHERE user_id = $1 AND comment_id = $2",
      [user_id, comment_id]
    );

    if (existingVote.rows.length > 0) {
      await pool.query(
        "UPDATE votes SET vote_type = $1 WHERE user_id = $2 AND comment_id = $3",
        [vote_type, user_id, comment_id]
      );
    } else {
      await pool.query(
        "INSERT INTO votes (user_id, comment_id, vote_type) VALUES ($1, $2, $3)",
        [user_id, comment_id, vote_type]
      );
    }

    const scoreResult = await pool.query(
      `SELECT 
         SUM(CASE WHEN vote_type = 'UPVOTE' THEN 1 ELSE -1 END) AS score
       FROM votes
       WHERE comment_id = $1`,
      [comment_id]
    );

    const newScore = scoreResult.rows[0].score || 0;

    await pool.query(
      "UPDATE comments SET vote_score = $1 WHERE id = $2",
      [newScore, comment_id]
    );

    res.json({ message: "Vote recorded", vote_score: newScore });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
