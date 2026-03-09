const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* GET ALL LOST AND FOUND ITEMS */
router.get("/", async (req, res) => {
    try {
        const items = await pool.query(
            `SELECT l.*, u.name as user_name 
       FROM lost_found_items l 
       LEFT JOIN users u ON l.user_id = u.id 
       ORDER BY l.created_at DESC`
        );
        res.json(items.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching items" });
    }
});

/* CREATE A NEW ITEM */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, type, category, location, contact_info } = req.body;

        if (!title || !description || !type) {
            return res.status(400).json({ message: "Title, description, and type are required" });
        }

        const newItem = await pool.query(
            `INSERT INTO lost_found_items (title, description, type, category, location, contact_info, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
            [title, description, type, category, location, contact_info, req.user.userId]
        );

        res.status(201).json(newItem.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error creating item" });
    }
});

/* UPDATE STATUS TO RESOLVED */
router.patch("/:id/resolve", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the item belongs to the user
        const item = await pool.query("SELECT * FROM lost_found_items WHERE id = $1", [id]);

        if (item.rows.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.rows[0].user_id !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to update this item" });
        }

        const updatedItem = await pool.query(
            `UPDATE lost_found_items SET status = 'resolved' WHERE id = $1 RETURNING *`,
            [id]
        );

        res.json(updatedItem.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error updating item" });
    }
});

module.exports = router;
