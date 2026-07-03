const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

app.use(express.json());

// PostgreSQL bazasiga ulanish sozlamalari
// DIQQAT: 'PAROLINGIZ' o'rniga o'zingizning pgAdmin parolingizni yozing!
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sardoba_market',
    password: '14112011', 
    port: 5432, 
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

// =================== YANGI QO'SHILGAN FUNKSIYALAR ===================

// 4. Do'kon ma'lumotlarini yangilash (PUT)
app.put('/api/shops/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, status } = req.body;
    
    try {
        const updateShop = await pool.query(
            'UPDATE shops SET name = $1, category = $2, status = $3 WHERE id = $4 RETURNING *',
            [name, category, status, id]
        );

        if (updateShop.rows.length === 0) {
            return res.status(404).json({ error: "Bunday ID dagi do'kon topilmadi!" });
        }

        res.json({ message: "Do'kon ma'lumotlari yangilandi!", shop: updateShop.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
});

// 5. Do'konni bazadan o'chirish (DELETE)
app.delete('/api/shops/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const deleteShop = await pool.query('DELETE FROM shops WHERE id = $1 RETURNING *', [id]);

        if (deleteShop.rows.length === 0) {
            return res.status(404).json({ error: "Bunday ID dagi do'kon topilmadi!" });
        }

        res.json({ message: "Do'kon bazadan muvaffaqiyatli o'chirildi!", deletedShop: deleteShop.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Serverda xatolik yuz berdi" });
    }
});

app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} manzilida ishlamoqda...`);
});