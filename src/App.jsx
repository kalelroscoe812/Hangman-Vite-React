import React, { useEffect, useState, useCallback } from 'react';
import HangmanFigure from './components/HangmanFigure.jsx';
import WordDisplay from './components/WordDisplay.jsx';
import Keyboard from './components/Keyboard.jsx';
import UsedLetters from './components/UsedLetters.jsx';
import ResultModal from './components/ResultModal.jsx';
import { fetchPlayer, createPlayer, updatePlayerStats } from './api/playerApi.js';

const WORDS = ['REACT', 'HANGMAN', 'MOREHOUSE', 'JAVASCRIPT', 'COMPONENT', 'FUNCTION', 'STATE', 'PROPS', 'HOOKS'];
const MAX_WRONG = 6;

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const App = () => {
  const [word, setWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [lastFetchedName, setLastFetchedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [statsUpdated, setStatsUpdated] = useState(false);

  const normalizedWordLetters = Array.from(new Set(word.split('')));
  const hasWon = normalizedWordLetters.every((letter) => guessedLetters.includes(letter));
  const hasLost = wrongGuesses >= MAX_WRONG;

  const handleGuess = useCallback(
    (letter) => {
      if (!letter || typeof letter !== 'string') return;
      const upper = letter.toUpperCase();
      if (!/^[A-Z]$/.test(upper)) return;
      if (guessedLetters.includes(upper) || hasWon || hasLost) return;

      setGuessedLetters((prev) => [...prev, upper]);
      if (!word.includes(upper)) {
        setWrongGuesses((prev) => prev + 1);
      }
    },
    [guessedLetters, hasWon, hasLost, word],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      const key = e.key;
      if (/^[a-zA-Z]$/.test(key)) {
        handleGuess(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGuess]);

  const handleNameSubmit = async () => {
    const name = playerName.trim().toUpperCase();

    if (!name) {
      setPlayerData(null);
      setLastFetchedName('');
      return;
    }

    if (name === lastFetchedName) {
      return;
    }

    setLoading(true);
    try {
      let player = await fetchPlayer(name);
      if (!player) {
        player = await createPlayer(name);
      }
      setPlayerData(player);
      setLastFetchedName(name);
    } catch (error) {
      console.error('Error fetching player:', error);
      setPlayerData(null);
      setLastFetchedName('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!playerData || statsUpdated || (!hasWon && !hasLost)) {
      if (hasWon || hasLost) {
        setIsWin(hasWon);
        setIsModalOpen(true);
      }
      return;
    }

    const newStats = {
      wins: playerData.wins + (hasWon ? 1 : 0),
      losses: playerData.losses + (hasLost ? 1 : 0),
    };

    updatePlayerStats(playerData.name, newStats)
      .then((updated) => {
        setPlayerData(updated);
      })
      .catch((error) => {
        console.error('Error updating stats:', error);
      })
      .finally(() => {
        setStatsUpdated(true);
      });

    setIsWin(hasWon);
    setIsModalOpen(true);
  }, [hasWon, hasLost, playerData, statsUpdated]);

  const handleNewGame = () => {
    setWord(getRandomWord());
    setGuessedLetters([]);
    setWrongGuesses(0);
    setIsModalOpen(false);
    setIsWin(false);
    setStatsUpdated(false);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="app">
      <h1>Hangman</h1>

      <div className="player-section">
        <label htmlFor="playerName">Player Name:</label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onBlur={handleNameSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleNameSubmit();
            }
          }}
          placeholder="Enter your name"
          disabled={loading}
        />
        {loading && <span>Loading...</span>}
        {playerData && (
          <div className="player-stats">
            <p>Player: {playerData.name}</p>
            <p>Wins: {playerData.wins}</p>
            <p>Losses: {playerData.losses}</p>
            <p>Games played: {playerData.wins + playerData.losses}</p>
            <p>Score: {playerData.wins - playerData.losses}</p>
          </div>
        )}
      </div>

      <div className="game-top">
        <HangmanFigure wrongGuesses={wrongGuesses} />
        <div className="word-and-info">
          <WordDisplay word={word} guessedLetters={guessedLetters} />
          <p className="lives">Lives remaining: {Math.max(0, MAX_WRONG - wrongGuesses)}</p>
        </div>
      </div>

      <Keyboard guessedLetters={guessedLetters} onGuess={handleGuess} disabled={hasWon || hasLost} />
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
