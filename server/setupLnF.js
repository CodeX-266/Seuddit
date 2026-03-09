require("dotenv").config();
const pool = require("./config/db");

async function setupLnF() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS lost_found_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('lost', 'found')),
        category VARCHAR(100),
        location VARCHAR(255),
        date_lost_found DATE,
        contact_info VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        image_url TEXT
      );
    `);
        console.log("lost_found_items table created.");

        // Add example data
        const res = await pool.query("SELECT id FROM users LIMIT 1");
        let userId = res.rows.length > 0 ? res.rows[0].id : null;

        if (!userId) {
            console.log("No users exist, skipping example data insertion. Create a user and run this again if you want example data linked to a user.");
            process.exit(0);
        }

        // only insert if empty
        const countRes = await pool.query("SELECT COUNT(*) FROM lost_found_items");
        if (parseInt(countRes.rows[0].count) === 0) {
            await pool.query(`
        INSERT INTO lost_found_items (title, description, type, category, location, contact_info, user_id)
        VALUES 
        ('Lost Apple Pencil (2nd Gen)', 'Lost my apple pencil near the central library. It has a tiny scratch on the tip.', 'lost', 'Electronics', 'Central Library', 'Contact Admin via App', $1),
        ('Found black umbrella', 'Found a black folding umbrella in LH-4, left it at the admin desk.', 'found', 'Accessories', 'LH-4', 'Admin Desk', $1),
        ('Lost Casio Calculator', 'Brand new Scientific calculator, left it during the physics mid-term.', 'lost', 'Electronics', 'Exam Hall B', 'My email: user@example.com', $1)
      `, [userId]);
            console.log("Inserted example data");
        } else {
            console.log("Example data already exists.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

setupLnF();
