import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App.jsx';

vi.mock('./api/playerApi.js', () => ({
  fetchPlayer: vi.fn(),
  createPlayer: vi.fn(),
  updatePlayerStats: vi.fn(),
}));

const { fetchPlayer, createPlayer } = await import('./api/playerApi.js');

describe('Hangman App', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates a new player when not found and shows stats', async () => {
    fetchPlayer.mockRejectedValueOnce(Object.assign(new Error('not-found'), { code: 'NOT_FOUND' }));
    createPlayer.mockResolvedValueOnce({ name: 'JANE', wins: 0, losses: 0 });

    render(<App />);

    await userEvent.type(screen.getByRole('textbox', { name: /player name/i }), 'Jane');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/welcome, jane/i)).toBeInTheDocument();
    expect(screen.getByText(/wins: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/losses: 0/i)).toBeInTheDocument();
    expect(createPlayer).toHaveBeenCalledWith('Jane');
  });
});
