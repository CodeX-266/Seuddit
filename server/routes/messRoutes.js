const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get full weekly menu
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mess_menu ORDER BY CASE day WHEN \'Monday\' THEN 1 WHEN \'Tuesday\' THEN 2 WHEN \'Wednesday\' THEN 3 WHEN \'Thursday\' THEN 4 WHEN \'Friday\' THEN 5 WHEN \'Saturday\' THEN 6 WHEN \'Sunday\' THEN 7 END, CASE meal_type WHEN \'Breakfast\' THEN 1 WHEN \'Lunch\' THEN 2 WHEN \'Snacks\' THEN 3 WHEN \'Dinner\' THEN 4 END');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching mess menu' });
    }
});

// Update a specific meal (Admin only - just adding for completeness)
router.patch('/:id', async (req, res) => {
    const { items } = req.body;
    try {
        await pool.query('UPDATE mess_menu SET items = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [items, req.params.id]);
        res.json({ message: 'Menu updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating menu' });
    }
});

module.exports = router;
