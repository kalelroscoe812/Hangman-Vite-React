const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const buildUrl = (path) => `${API_BASE}${path}`;

export async function fetchPlayer(name) {
  const response = await fetch(buildUrl(`/api/player?name=${encodeURIComponent(name)}`));
  if (response.ok) {
    return response.json();
  }

  if (response.status === 404) {
    return null;
  }

  throw new Error('Unable to fetch player');
}

export async function createPlayer(name) {
  const response = await fetch(buildUrl('/api/player'), {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Player already exists');
    }
    throw new Error('Unable to create player');
  }

  return response.json();
}

export async function updatePlayerStats(name, stats) {
  const response = await fetch(buildUrl(`/api/player/${encodeURIComponent(name)}`), {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(stats),
  });

  if (!response.ok) {
    throw new Error('Unable to update player stats');
  }

  return response.json();
}
