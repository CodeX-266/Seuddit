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

        // Truncate to refresh samples
        await client.query('TRUNCATE TABLE academic_materials CASCADE;');

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
        ('STS1001', 'Soft Skills', 'Notes', 'Winter 2024', 'Prof. Arjun', '#', 'Placement specific aptitude shortcuts and formula sheet.'),
        ('CSE2002', 'Operating Systems', 'PYQ', 'Winter 2024', 'Dr. S. Moorthy', '#', 'FAT 2023 solved paper with process scheduling diagrams.'),
        ('MAT2001', 'Statistics and Probability', 'Notes', 'Fall 2024', 'Prof. Lakshmi', '#', 'Handwritten notes for probability distributions and testing of hypothesis.'),
        ('PHY1001', 'Engineering Physics', 'Materials', 'Winter 2023', 'Dr. K. Nair', '#', 'Lab Manual and previous year assignment solutions (CAT-1/CAT-2).'),
        ('CHY1001', 'Engineering Chemistry', 'PYQ', 'Winter 2024', 'Prof. Reddy', '#', 'CAT-1 question paper from last year (Morning Slot)'),
        ('EEE1001', 'Basic Electrical Engineering', 'PYQ', 'Fall 2024', 'Dr. G. Venkat', '#', 'Detailed step-by-step solutions for KVL/KCL and AC circuit problems.'),
        ('HUM1001', 'Ethics and Values', 'Materials', 'Fall 2024', 'Dr. Zarina', '#', 'PDF of all case studies discussed in class for CAT-2 preparation.'),
        ('BME1001', 'Thermodynamics', 'Notes', 'Winter 2024', 'Prof. Vignesh', '#', 'Simplified notes for the first three laws and Carnot cycle.'),
        ('FRE1001', 'French Language', 'Notes', 'Fall 2024', 'Madame Sophie', '#', 'Self-study guide for common dialogues and grammar rules for J-component.');
      `);
            console.log('Seeded expanded academic materials library.');
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
