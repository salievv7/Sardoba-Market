const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

app.use(express.json());

// PostgreSQL bazasiga ulanish sozlamalari
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sardoba_market',
    password: '14112011', // <-- pgAdmin-ga kirgan parolingizni yozing
    port: 5432, // PostgreSQL 17 standart porti
});

// 1. Status API
app.get('/api/status', (req, res) => {
    res.json({ project: "Sardoba Market (PostgreSQL)", status: "Active" });
});

// 2. Bazadan barcha do'konlarni olish (GET)
app.get('/api/shops', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shops ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
});

// 3. Bazaga yangi do'kon qo'shish (POST)
app.post('/api/shops', async (req, res) => {
    const { name, category } = req.body;
    if (!name || !category) {
        return res.status(400).json({ error: "Do'kon nomi va kategoriyasi shart!" });
    }
    try {
        const newShop = await pool.query(
            'INSERT INTO shops (name, category) VALUES ($1, $2) RETURNING *',
            [name, category]
        );
        res.status(201).json({ message: "Do'kon bazaga muvaffaqiyatli saqlandi!", shop: newShop.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
});

app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} manzilida ishlamoqda...`);
});