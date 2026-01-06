-- Database Schema untuk E-Voting Insan Muda
-- Jalankan script ini di MySQL

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS voting_insan_muda;
USE voting_insan_muda;

-- Tabel Kandidat
CREATE TABLE IF NOT EXISTS candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    vision TEXT DEFAULT NULL,
    photo_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Voting
CREATE TABLE IF NOT EXISTS votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    voter_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- Insert 5 kandidat
INSERT INTO candidates (name) VALUES
('Calon 01'),
('Calon 02'),
('Calon 03'),
('Calon 04'),
('Calon 05');

-- Index untuk performa
CREATE INDEX idx_votes_candidate ON votes(candidate_id);
CREATE INDEX idx_votes_token ON votes(voter_token);
