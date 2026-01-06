const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // GET /api/candidates - Ambil semua kandidat
    router.get('/', async (req, res) => {
        try {
            const [rows] = await pool.query(
                'SELECT id, name, vision, photo_url, created_at FROM candidates ORDER BY id'
            );
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Error fetching candidates:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch candidates' });
        }
    });

    // GET /api/candidates/:id - Ambil detail kandidat
    router.get('/:id', async (req, res) => {
        try {
            const [rows] = await pool.query(
                'SELECT id, name, vision, photo_url, created_at FROM candidates WHERE id = ?',
                [req.params.id]
            );
            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Candidate not found' });
            }
            res.json({ success: true, data: rows[0] });
        } catch (error) {
            console.error('Error fetching candidate:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch candidate' });
        }
    });

    return router;
};
