// sorta the "search engine" for the search box in games.html

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function similarityScore(query, text) {
  const q = normalizeText(query);
  const t = normalizeText(text);

  if (!q) return 1;
  if (!t) return 0;
  if (t.includes(q)) return 100;

  const queryWords = q.split(/\s+/).filter(Boolean);
  const textWords = t.split(/\s+/).filter(Boolean);

  let score = 0;

  for (const qw of queryWords) {
    for (const tw of textWords) {
      if (tw.includes(qw) || qw.includes(tw)) {
        score += 30;
      } else if (levenshtein(qw, tw) <= 2) {
        score += 15;
      }
    }
  }

  return score;
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }

  return dp[a.length][b.length];
}

function getSearchQuery() {
  const params = new URLSearchParams(location.search);
  return params.get("search") || "";
}

function setSearchQuery(query) {
  const clean = String(query || "").trim();

  if (!clean) {
    location.href = location.pathname;
    return;
  }

  location.href = `${location.pathname}?search="${encodeURIComponent(clean)}"`;
}

function filterGames(query) {
  const searchStatus = document.getElementById("searchStatus");
  const gameSearch = document.getElementById("gameSearch");

  if (gameSearch) gameSearch.value = query;

  const gameRows = [...document.querySelectorAll("p")].filter(p =>
    p.querySelector("a[href]")
  );

  let shown = 0;

  for (const row of gameRows) {
    const link = row.querySelector("a[href]");
    const text = `${link.textContent} ${row.textContent} ${link.getAttribute("href")}`;
    const score = similarityScore(query, text);

    if (!query || score > 0) {
      row.style.display = "";
      row.dataset.searchScore = score;
      shown++;
    } else {
      row.style.display = "none";
    }
  }

  gameRows
    .filter(row => row.style.display !== "none")
    .sort((a, b) => Number(b.dataset.searchScore || 0) - Number(a.dataset.searchScore || 0))
    .forEach(row => row.parentNode.appendChild(row));

  if (searchStatus) {
    searchStatus.textContent = query
      ? `Showing ${shown} result(s) for "${query}"`
      : "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gameSearch = document.getElementById("gameSearch");
  const gameSearchBtn = document.getElementById("gameSearchBtn");

  const query = getSearchQuery().replace(/^"|"$/g, "");
  filterGames(query);

  if (gameSearch) {
    gameSearch.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        setSearchQuery(gameSearch.value);
      }
    });
  }

  if (gameSearchBtn) {
    gameSearchBtn.addEventListener("click", () => {
      setSearchQuery(gameSearch?.value || "");
    });
  }
});