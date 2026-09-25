// Market data is served by our own API (/api/market/*); the provider key lives server-side only.
const basePath = "https://stocktrackerapi.onrender.com/api/market";

const get = async (path, params) => {
    const response = await fetch(`${basePath}${path}?${new URLSearchParams(params)}`);
    if (!response.ok) {
        throw new Error(`An error has occured: ${response.status}`);
    }
    return await response.json();
};

// Stock lookup
export const searchSymbol = (query) => get("/search", { q: query });

// Company Profile
export const companyDetails = (symbol) => get("/profile", { symbol });

// Stock Price - quote
export const stockQuote = (symbol) => get("/quote", { symbol });

// Stock Candles
export const getHistoricalData = (symbol, resolution, from, to) =>
    get("/candles", { symbol, resolution, from, to });

// Company news YYYY-MM-DD
export const companyNews = (symbol, from, to) => get("/news", { symbol, from, to });
