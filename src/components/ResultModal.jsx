import React from 'react';

const ResultModal = ({ isOpen, isWin, word, onClose, onNewGame }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{isWin ? 'You Won!' : 'You Lost'}</h2>
        <p>The word was: <strong>{word.toUpperCase()}</strong></p>
        <div className="modal-actions">
          <button onClick={onNewGame}>New Game</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
