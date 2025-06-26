import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [poem, setPoem] = useState('');
  const [flowers, setFlowers] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const poemRef = useRef(null);

  const themes = [
    "Hope", "Love", "Friendship", "Growth", "Dreams", "Strength",
    "Peace", "Positivity", "Self-love", "Nature", "Magic"
  ];

  useEffect(() => {
    const flowerArray = Array.from({ length: 35 }).map((_, index) => ({
      id: index,
      left: Math.random() * 100 + '%',
      animationDuration: Math.random() * 5 + 10 + 's',
      animationDelay: Math.random() * 5 + 's',
      fontSize: Math.random() * 12 + 18 + 'px',
    }));
    setFlowers(flowerArray);
  }, []);

  const handleStart = async () => {
    setStarted(true);
    try {
      await fetch('http://localhost:5000/start-bot', { method: 'POST' });
      console.log("✅ Bot started");
    } catch (err) {
      alert("❌ Failed to start bot.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSubmitted(false);

    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, theme }),
      });

      const data = await response.json();

      if (data.error) {
        alert("❌ Backend Error: " + data.error);
        console.error(data.error);
      } else {
        setPoem(data.poem);
        setHasSubmitted(true);
        setTimeout(() => {
          poemRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } catch (err) {
      alert('Oops! Failed to fetch poem. Please check your backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="flower-container">
        {flowers.map((flower) => (
          <div
            key={flower.id}
            className="flower"
            style={{
              left: flower.left,
              animationDuration: flower.animationDuration,
              animationDelay: flower.animationDelay,
              fontSize: flower.fontSize,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      <div className="form-box">
        <h1>🌷 Poem Generator 🌷</h1>
        
        {!started ? (
          <button className="custom-button" onClick={handleStart}>
            Start
          </button>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                required
              >
                <option value="" disabled>Select a Theme</option>
                {themes.map((t, index) => (
                  <option key={index} value={t.toLowerCase()}>{t}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="custom-button">
              {loading ? 'Generating...' : 'Generate Poem'}
            </button>
          </form>
        )}
      </div>

      {hasSubmitted && poem && (
        <div className="poem-display" ref={poemRef}>
          <h3>Your Poem ✨</h3>
          <pre>{poem}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
