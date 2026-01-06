const express = require('express');
const crypto = require('crypto');
const router = express.Router();

module.exports = (pool) => {
    // POST /api/vote - Submit vote
    router.post('/', async (req, res) => {
        try {
            const { candidateId, voterToken } = req.body;

            if (!candidateId) {
                return res.status(400).json({ success: false, message: 'Candidate ID is required' });
            }

            // Generate voter token jika tidak ada (dari browser fingerprint atau session)
            const token = voterToken || crypto.randomUUID();

            // Cek apakah sudah pernah voting
            const [existing] = await pool.query(
                'SELECT id FROM votes WHERE voter_token = ?',
                [token]
            );

            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Anda sudah melakukan voting sebelumnya',
                    alreadyVoted: true
                });
            }

            // Cek apakah kandidat valid
            const [candidate] = await pool.query(
                'SELECT id FROM candidates WHERE id = ?',
                [candidateId]
            );

            if (candidate.length === 0) {
                return res.status(404).json({ success: false, message: 'Kandidat tidak ditemukan' });
            }

            // Insert vote
            await pool.query(
                'INSERT INTO votes (candidate_id, voter_token) VALUES (?, ?)',
                [candidateId, token]
            );

            res.json({
                success: true,
                message: 'Vote berhasil dicatat!',
                voterToken: token
            });
        } catch (error) {
            console.error('Error submitting vote:', error);
            res.status(500).json({ success: false, message: 'Gagal menyimpan vote' });
        }
    });

    // GET /api/vote/check/:token - Cek status voting
    router.get('/check/:token', async (req, res) => {
        try {
            const [rows] = await pool.query(
                `SELECT v.id, v.created_at, c.name as candidate_name 
         FROM votes v 
         JOIN candidates c ON v.candidate_id = c.id 
         WHERE v.voter_token = ?`,
                [req.params.token]
            );

            if (rows.length === 0) {
                return res.json({ success: true, hasVoted: false });
            }

            res.json({
                success: true,
                hasVoted: true,
                vote: rows[0]
            });
        } catch (error) {
            console.error('Error checking vote:', error);
            res.status(500).json({ success: false, message: 'Failed to check vote status' });
        }
    });

    // GET /api/vote/results - Hasil voting
    router.get('/results', async (req, res) => {
        try {
            const [results] = await pool.query(`
        SELECT 
          c.id,
          c.name,
          c.vision,
          c.photo_url,
          COUNT(v.id) as vote_count
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id
        GROUP BY c.id
        ORDER BY vote_count DESC
      `);

            const [totalVotes] = await pool.query('SELECT COUNT(*) as total FROM votes');

            res.json({
                success: true,
                data: results,
                totalVotes: totalVotes[0].total
            });
        } catch (error) {
            console.error('Error fetching results:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch results' });
        }
    });

    return router;
};
