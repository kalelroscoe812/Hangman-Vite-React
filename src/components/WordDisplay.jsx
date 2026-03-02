import React from 'react';
import LetterBox from './LetterBox.jsx';

const WordDisplay = ({ word, guessedLetters }) => {
  return (
    <div className="word-display" aria-live="polite">
      {word.split('').map((char, idx) => {
        const isLetter = /[A-Z]/i.test(char);
        const upper = char.toUpperCase();
        if (!isLetter) {
          return <div key={`gap-${idx}`} className="word-gap" />;
        }
        const revealed = guessedLetters.includes(upper);
        return (
          <LetterBox
            key={`${upper}-${idx}`}
            letter={revealed ? upper : '_'}
            isVisible={true}
            boxStyle={{ width: '44px', height: '56px', margin: '0 6px' }}
            letterStyle={{
              color: revealed ? '#111' : '#444',
              fontSize: '26px',
              letterSpacing: '2px',
            }}
          />
        );
      })}
    </div>
  );
};

export default WordDisplay;
