const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setupAcademic() {
    const client = await pool.connect();
    try {
        // Create Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS academic_materials (
        id SERIAL PRIMARY KEY,
        course_code VARCHAR(20) NOT NULL,
        course_name VARCHAR(100) NOT NULL,
        category VARCHAR(20) NOT NULL, -- PYQ, Notes, Materials
        semester VARCHAR(50),
        faculty_name VARCHAR(100),
        file_url TEXT,
        description TEXT,
        uploader_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Add Index for search
        await client.query(`CREATE INDEX IF NOT EXISTS idx_course_code ON academic_materials(course_code);`);

        // Seed Data
        const seedCheck = await client.query('SELECT count(*) FROM academic_materials');
        if (parseInt(seedCheck.rows[0].count) === 0) {
            await client.query(`
        INSERT INTO academic_materials (course_code, course_name, category, semester, faculty_name, file_url, description)
        VALUES 
        ('CSE1001', 'Digital Logic and Design', 'PYQ', 'Winter 2024', 'Dr. Ramesh K', '#', 'CAT-1 Question Paper with detailed solutions attached.'),
        ('CSE2001', 'Computer Architecture', 'Notes', 'Fall 2024', 'Dr. Priya S', '#', 'Comprehensive handwritten notes for Modules 3-5.'),
        ('MAT1001', 'Calculus', 'Materials', 'Winter 2023', 'Prof. Sharma', '#', 'Official Question Bank for FAT preparation including past 5 year trends.'),
        ('CSE3001', 'Software Engineering', 'PYQ', 'Fall 2023', 'Dr. Anita V', '#', 'CAT-2 Final Question Paper with marked marking scheme.'),
        ('STS1001', 'Soft Skills', 'Notes', 'Winter 2024', 'Prof. Arjun', '#', 'Placement specific aptitude shortcuts and formula sheet.');
      `);
            console.log('Seeded example academic materials.');
        }

        console.log('Academic Materials table is ready.');
    } catch (err) {
        console.error('Error setting up academic table:', err);
    } finally {
        client.release();
        process.exit();
    }
}

setupAcademic();
