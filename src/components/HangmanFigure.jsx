import React from 'react';

const HangmanFigure = ({ wrongGuesses }) => {
  // wrongGuesses: 0–5 (for 5 lives you have 6 states: 0..5)
  return (
    <svg height="250" width="200" className="hangman-figure">
      {/* Gallows */}
      <line x1="10" y1="240" x2="150" y2="240" stroke="#000" strokeWidth="4" />
      <line x1="40" y1="20" x2="40" y2="240" stroke="#000" strokeWidth="4" />
      <line x1="40" y1="20" x2="140" y2="20" stroke="#000" strokeWidth="4" />
      <line x1="140" y1="20" x2="140" y2="50" stroke="#000" strokeWidth="4" />

      {/* Head */}
      {wrongGuesses > 0 && (
        <circle cx="140" cy="70" r="20" stroke="#000" strokeWidth="3" fill="none" />
      )}

      {/* Body */}
      {wrongGuesses > 1 && (
        <line x1="140" y1="90" x2="140" y2="150" stroke="#000" strokeWidth="3" />
      )}

      {/* Left arm */}
      {wrongGuesses > 2 && (
        <line x1="140" y1="110" x2="115" y2="135" stroke="#000" strokeWidth="3" />
      )}

      {/* Right arm */}
      {wrongGuesses > 3 && (
        <line x1="140" y1="110" x2="165" y2="135" stroke="#000" strokeWidth="3" />
      )}

      {/* Left leg */}
      {wrongGuesses > 4 && (
        <line x1="140" y1="150" x2="120" y2="190" stroke="#000" strokeWidth="3" />
      )}

      {/* Right leg */}
      {wrongGuesses > 5 && (
        <line x1="140" y1="150" x2="160" y2="190" stroke="#000" strokeWidth="3" />
      )}
    </svg>
  );
};

export default HangmanFigure;
