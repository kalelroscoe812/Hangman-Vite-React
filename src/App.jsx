import React, { useEffect, useState, useCallback } from 'react';
import HangmanFigure from './components/HangmanFigure.jsx';
import WordDisplay from './components/WordDisplay.jsx';
import Keyboard from './components/Keyboard.jsx';
import UsedLetters from './components/UsedLetters.jsx';
import ResultModal from './components/ResultModal.jsx';

const WORDS = ['REACT', 'HANGMAN', 'VITE', 'JAVASCRIPT', 'COMPONENT', 'KEYBOARD'];
const MAX_WRONG = 5;

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const App = () => {
  const [word, setWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const normalizedWordLetters = Array.from(new Set(word.split('')));

  const hasWon = normalizedWordLetters.every((letter) =>
    guessedLetters.includes(letter),
  );
  const hasLost = wrongGuesses >= MAX_WRONG;

  const handleGuess = useCallback(
    (letter) => {
      if (!letter || typeof letter !== 'string') return;
      const upper = letter.toUpperCase();
      if (!/^[A-Z]$/.test(upper)) return; // only single letters
      if (guessedLetters.includes(upper) || hasWon || hasLost) return;

      setGuessedLetters((prev) => [...prev, upper]);

      if (!word.includes(upper)) {
        setWrongGuesses((prev) => prev + 1);
      }
    },
    [guessedLetters, hasWon, hasLost, word],
  );

  // Keyboard input support: only accept A-Z single characters
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      // Accept only single-letter keys a-z or A-Z
      if (/^[a-zA-Z]$/.test(key)) {
        handleGuess(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGuess]);

  useEffect(() => {
    if (hasWon) {
      setIsWin(true);
      setIsModalOpen(true);
    } else if (hasLost) {
      setIsWin(false);
      setIsModalOpen(true);
    }
  }, [hasWon, hasLost]);

  const handleNewGame = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
    setWrongGuesses(0);
    setIsModalOpen(false);
    setIsWin(false);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="app">
      <h1>Hangman</h1>

      <div className="game-top">
        <HangmanFigure wrongGuesses={wrongGuesses} />
        <div className="word-and-info">
          <WordDisplay word={word} guessedLetters={guessedLetters} />
          <p className="lives">Lives remaining: {Math.max(0, MAX_WRONG - wrongGuesses)}</p>
        </div>
      </div>

      <Keyboard
        guessedLetters={guessedLetters}
        onGuess={handleGuess}
        disabled={hasWon || hasLost}
      />

      <UsedLetters guessedLetters={guessedLetters} />

      <button className="new-game-button" onClick={handleNewGame}>
        New Game
      </button>

      <ResultModal
        isOpen={isModalOpen}
        isWin={isWin}
        word={word}
        onClose={handleCloseModal}
        onNewGame={handleNewGame}
      />
    </div>
  );
};

export default App;
