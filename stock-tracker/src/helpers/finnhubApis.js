const basePath = "https://finnhub.io/api/v1";
const api_key = "cgk8knpr01qq3c3u2ma0cgk8knpr01qq3c3u2mag"

// export const StockContextProvider = ({children}) => {
    // const [stockSymbol, setStockSymbol] = useState("FB");

// Stock lookup
export const searchSymbol = async (query) => {
    const url = `${basePath}/search?q=${query}&token=${api_key}`;
    const response = await fetch(url);
    if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
    }
    return await response.json();
};

// Company Profile 2 API call to finnhub api
export const companyDetails = async (symbol) => {
    const url = `${basePath}/stock/profile2?symbol=${symbol}&token=${api_key}`;
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
    };

// Stock Price - quote
export const stockQuote = async (symbol) => {
    const url = `${basePath}/quote?symbol=${symbol}&token=${api_key}`;
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
    };

// Stock Candles
export const getHistoricalData = async (symbol, resolution, from, to) => {
    const url = `${basePath}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${api_key}`;
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
};


// Company news YYYY-MM-DD
export const companyNews = async (symbol, from, to) => {
    const url = `${basePath}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${api_key}`;
    const response = await fetch(url);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
};