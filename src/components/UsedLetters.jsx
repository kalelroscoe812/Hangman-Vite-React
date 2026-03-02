import React from 'react';

const UsedLetters = ({ guessedLetters }) => {
  const onlyLetters = guessedLetters.filter((l) => /^[A-Z]$/.test(l));
  const sorted = [...onlyLetters].sort();

  return (
    <div className="used-letters" aria-live="polite">
      <h3>Chosen Letters:</h3>
      <div className="used-letters-list">
        {sorted.length === 0 ? (
          <span className="used-none">None yet</span>
        ) : (
          sorted.map((letter) => (
            <span key={letter} className="used-letter">
              {letter}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default UsedLetters;
