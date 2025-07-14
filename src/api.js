const API_BASE = "/api";

export async function startGame(rarity) {
    const res = await fetch(`${API_BASE}/start?rarity=${rarity}`, {
        credentials: 'include',
    });
    return await res.json();
}

export async function suggestNames(query) {
    const res = await fetch(`${API_BASE}/suggest?query=${encodeURIComponent(query)}`, {
        credentials: 'include',
    });
    return await res.json();
}

export async function guessName(name) {
    const res = await fetch(`${API_BASE}/guess?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        credentials: 'include',
    });
    return await res.json();
}
