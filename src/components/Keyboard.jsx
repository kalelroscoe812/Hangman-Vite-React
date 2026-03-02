import React from 'react';
const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Keyboard = ({ guessedLetters, onGuess, disabled }) => {
  return (
    <div className="keyboard" role="application" aria-label="On-screen keyboard">
      {KEYS.map((key) => {
        const isUsed = guessedLetters.includes(key);
        const className = `key-button ${isUsed ? 'key-used' : ''}`;
        return (
          <button
            key={key}
            className={className}
            onClick={() => !disabled && onGuess(key)}
            disabled={disabled || isUsed}
            aria-pressed={isUsed}
            aria-label={`Letter ${key}`}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;
