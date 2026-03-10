const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all materials or filter
router.get('/', async (req, res) => {
    try {
        const { query, category } = req.query;
        let sql = 'SELECT * FROM academic_materials';
        const params = [];

        if (query || category) {
            sql += ' WHERE';
            if (query) {
                params.push(`%${query}%`);
                sql += ` (course_code ILIKE $${params.length} OR course_name ILIKE $${params.length} OR faculty_name ILIKE $${params.length})`;
            }
            if (category) {
                if (params.length > 0) sql += ' AND';
                params.push(category);
                sql += ` category = $${params.length}`;
            }
        }

        sql += ' ORDER BY created_at DESC';
        const result = await pool.query(sql, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching materials' });
    }
});

// Post new material (requires auth)
router.post('/', authMiddleware, async (req, res) => {
    const { course_code, course_name, category, semester, faculty_name, file_url, description } = req.body;

    if (!course_code || !course_name || !category) {
        return res.status(400).json({ message: 'Course Code, Name and Category are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO academic_materials 
      (course_code, course_name, category, semester, faculty_name, file_url, description, uploader_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [course_code, course_name, category, semester, faculty_name, file_url, description, req.user.userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error uploading material' });
    }
});

module.exports = router;
