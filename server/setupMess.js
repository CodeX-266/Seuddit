const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setupMess() {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS mess_menu (
        id SERIAL PRIMARY KEY,
        day VARCHAR(10) NOT NULL,
        meal_type VARCHAR(20) NOT NULL, -- Breakfast, Lunch, Snacks, Dinner
        mess_type VARCHAR(20) DEFAULT 'Regular', -- Regular, Special, South, North
        items TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        const seedCheck = await client.query('SELECT count(*) FROM mess_menu');
        if (parseInt(seedCheck.rows[0].count) === 0) {
            const menuData = [
                ['Monday', 'Breakfast', 'Idli, Sambar, Chutney, Bread-Butter-Jam, Milk'],
                ['Monday', 'Lunch', 'Rice, Dal, Mixed Veg, Chapati, Salad, Buttermilk'],
                ['Monday', 'Snacks', 'Samosa, Tea/Coffee'],
                ['Monday', 'Dinner', 'Rice, Chicken Gravy/Paneer Butter Masala, Chapati, Dal'],
                ['Tuesday', 'Breakfast', 'Poha, Jalebi, Sprouts, Fruits, Tea/Coffee'],
                ['Tuesday', 'Lunch', 'Jeera Rice, Rajma, Aloo Gobhi, Phulka, Curd'],
                ['Tuesday', 'Snacks', 'Veg Sandwich, Tea'],
                ['Tuesday', 'Dinner', 'South Indian Meals, Vatha Sambar, Rasam, Appalam'],
                ['Wednesday', 'Breakfast', 'Dosa, Tomato Chutney, Vada, Milk'],
                ['Wednesday', 'Lunch', 'Rice, Fish Fry/Paneer Fry, Dal Tadka, Roti'],
                ['Wednesday', 'Snacks', 'Pakora, Coffee'],
                ['Wednesday', 'Dinner', 'Veg Pulao, Gobi Manchurian, Dal, Curd'],
                ['Thursday', 'Breakfast', 'Pongal, Sambar, Chutney, Fruits'],
                ['Thursday', 'Lunch', 'Ghee Rice, Kurma, Papad, Roti, Salad'],
                ['Thursday', 'Snacks', 'Bread Omelette/Veg Cutlet'],
                ['Thursday', 'Dinner', 'Chapati, Mattar Paneer, Rice, Dal'],
                ['Friday', 'Breakfast', 'Puri, Aloo Masala, Halwa, Milk'],
                ['Friday', 'Lunch', 'Biryani (Veg/Non-Veg), Raitha, Brinjal Curry'],
                ['Friday', 'Snacks', 'Biscuits, Tea'],
                ['Friday', 'Dinner', 'Chinese Fried Rice, Manchurian, Soup'],
                ['Saturday', 'Breakfast', 'Semiya Upma, Chutney, Bread-Butter'],
                ['Saturday', 'Lunch', 'Lemon Rice, Curd Rice, Poriyal, Appalam'],
                ['Saturday', 'Snacks', 'Bhel Puri, Juice'],
                ['Saturday', 'Dinner', 'Naan, Paneer Lababdar, Jeera Rice, Dal'],
                ['Sunday', 'Breakfast', 'Masala Dosa, Chutney, Sambar, Eggs'],
                ['Sunday', 'Lunch', 'Special South Indian Meals, Payasam, Vada'],
                ['Sunday', 'Snacks', 'Puff (Veg/Egg), Tea'],
                ['Sunday', 'Dinner', 'Ice Cream, Chapati, Veg Sabzi, Dal, Rice']
            ];

            for (const [day, meal, items] of menuData) {
                await client.query(
                    'INSERT INTO mess_menu (day, meal_type, items) VALUES ($1, $2, $3)',
                    [day, meal, items]
                );
            }
            console.log('Seeded mess menu.');
        }
    } catch (err) {
        console.error('Error setup mess:', err);
    } finally {
        client.release();
        process.exit();
    }
}

setupMess();
