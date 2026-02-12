const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* CREATE COMMUNITY */
router.post("/", authMiddleware, async (req, res) => {
  const client = await pool.connect();

  try {
    const { name, description } = req.body;

    await client.query("BEGIN");

    // 1️⃣ Create community
    const newCommunity = await client.query(
      `INSERT INTO communities (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, req.user.userId]
    );

    const communityId = newCommunity.rows[0].id;

    // 2️⃣ Insert creator as owner
    await client.query(
      `INSERT INTO community_members (user_id, community_id, role)
       VALUES ($1, $2, 'owner')`,
      [req.user.userId, communityId]
    );

    await client.query("COMMIT");

    res.status(201).json(newCommunity.rows[0]);

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});



/* JOIN COMMUNITY */
router.post("/join/:communityId", authMiddleware, async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO community_members (user_id, community_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [req.user.userId, req.params.communityId]
    );

    res.json({ message: "Joined community" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET ALL COMMUNITIES */
router.get("/", async (req, res) => {
  try {
    const communities = await pool.query(
      "SELECT * FROM communities ORDER BY created_at DESC"
    );

    res.json(communities.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
