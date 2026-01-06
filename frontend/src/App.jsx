import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voting, setVoting] = useState(false);
  const [lastVote, setLastVote] = useState(null);

  // Fetch candidates from backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${API_URL}/candidates`);
        const data = await response.json();
        if (data.success) {
          setCandidates(data.data);
        } else {
          setError('Gagal memuat data kandidat');
        }
      } catch (err) {
        setError('Tidak dapat terhubung ke server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleSelectCandidate = (id) => {
    setSelectedCandidate(id);
  };

  const handleSaveVote = async () => {
    if (!selectedCandidate || voting) return;

    setVoting(true);
    try {
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: selectedCandidate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const votedName = candidates.find(c => c.id === selectedCandidate)?.name;
        setLastVote(votedName);
        setSelectedCandidate(null);
        alert('✅ ' + data.message);
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      alert('❌ Gagal mengirim vote. Coba lagi nanti.');
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600">Voting Ketua Insan Muda</h1>
        <p className="text-gray-600 mt-2">Pilih kandidat lalu klik tombol Simpan Vote</p>
        {lastVote && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-xl inline-block">
            ✅ Vote terakhir: <strong>{lastVote}</strong>
          </div>
        )}
      </header>

      {/* Row 1: Calon 01, 02, 03 */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-6">
        {candidates.slice(0, 3).map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectCandidate(item.id)}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition transform hover:scale-105 ${selectedCandidate === item.id
              ? 'ring-4 ring-blue-500 bg-blue-50'
              : 'hover:shadow-2xl'
              }`}
          >
            <div className="w-full aspect-[3/4] bg-blue-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {item.photo_url ? (
                <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">👤</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-center">{item.name}</h2>
            {selectedCandidate === item.id && (
              <div className="mt-3 text-center text-blue-600 font-semibold">
                ✓ Dipilih
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Row 2: Calon 04, 05 - centered with offset */}
      <div className="flex justify-center gap-6 max-w-5xl mx-auto mb-8">
        <div className="w-1/6 hidden md:block"></div>
        {candidates.slice(3, 5).map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectCandidate(item.id)}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition transform hover:scale-105 w-full md:w-1/3 ${selectedCandidate === item.id
              ? 'ring-4 ring-blue-500 bg-blue-50'
              : 'hover:shadow-2xl'
              }`}
          >
            <div className="w-full aspect-[3/4] bg-blue-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {item.photo_url ? (
                <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">👤</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-center">{item.name}</h2>
            {selectedCandidate === item.id && (
              <div className="mt-3 text-center text-blue-600 font-semibold">
                ✓ Dipilih
              </div>
            )}
          </div>
        ))}
        <div className="w-1/6 hidden md:block"></div>
      </div>

      {/* Tombol Simpan Vote */}
      <div className="text-center space-y-4">
        <button
          onClick={handleSaveVote}
          disabled={!selectedCandidate || voting}
          className={`w-64 py-4 rounded-xl font-bold text-lg transition ${!selectedCandidate
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : voting
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
        >
          {voting ? '⏳ Menyimpan...' : '💾 Simpan Vote'}
        </button>

        <div>
          <Link
            to="/results"
            className="inline-block w-64 text-center bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            📊 Lihat Hasil Voting
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;