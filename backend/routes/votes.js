const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // POST /api/vote - Submit vote (allows multiple votes)
    router.post('/', async (req, res) => {
        try {
            const { candidateId } = req.body;

            if (!candidateId) {
                return res.status(400).json({ success: false, message: 'Candidate ID is required' });
            }

            // Cek apakah kandidat valid
            const [candidate] = await pool.query(
                'SELECT id, name FROM candidates WHERE id = ?',
                [candidateId]
            );

            if (candidate.length === 0) {
                return res.status(404).json({ success: false, message: 'Kandidat tidak ditemukan' });
            }

            // Insert vote
            await pool.query(
                'INSERT INTO votes (candidate_id, voter_token) VALUES (?, ?)',
                [candidateId, 'anonymous']
            );

            res.json({
                success: true,
                message: `Vote untuk ${candidate[0].name} berhasil dicatat!`
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

    // DELETE /api/vote/reset - Reset semua voting
    router.delete('/reset', async (req, res) => {
        try {
            await pool.query('DELETE FROM votes');
            res.json({
                success: true,
                message: 'Semua data voting berhasil direset!'
            });
        } catch (error) {
            console.error('Error resetting votes:', error);
            res.status(500).json({ success: false, message: 'Gagal mereset voting' });
        }
    });

    return router;
};
