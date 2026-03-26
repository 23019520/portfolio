/**
 * js/github-api.js
 * Fetches public repos from GitHub REST API.
 * Caches results in sessionStorage to avoid redundant requests.
 */

const GitHubAPI = (function () {
  'use strict';

  const USERNAME     = '23019520';
  const BASE_URL     = 'https://api.github.com';
  const CACHE_KEY    = 'gh_repos_cache';
  const CACHE_TTL    = 15 * 60 * 1000; // 15 minutes

  // ── Public API ────────────────────────────────────────
  async function getRepos() {
    const cached = _getCache(CACHE_KEY);
    if (cached) return cached;

    try {
      const res  = await fetch(`${BASE_URL}/users/${USERNAME}/repos?sort=updated&per_page=30`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const data = await res.json();
      _setCache(CACHE_KEY, data);
      return data;
    } catch (err) {
      console.warn('GitHub API unavailable, using fallback data.', err);
      return null; // caller will use fallback
    }
  }

  async function getUser() {
    try {
      const res  = await fetch(`${BASE_URL}/users/${USERNAME}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // ── Cache helpers ─────────────────────────────────────
  function _setCache(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch (_) {}
  }

  function _getCache(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) return null;
      return data;
    } catch {
      return null;
    }
  }

  return { getRepos, getUser };
})();
