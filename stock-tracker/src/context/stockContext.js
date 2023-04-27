import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

export const StockContext = createContext();

const basePath = "https://finnhub.io/api/v1";

const api_key = "cgk8knpr01qq3c3u2ma0cgk8knpr01qq3c3u2mag"

export const StockContextProvider = ({children}) => {
    const [stockSymbol, setStockSymbol] = useState("META");
    const {getAuthToken} = useContext(AuthContext);
    const [quote, setQuote] = useState({});
    const [stockList, setStockList ] = useState([]);

    // Stock lookup
    const searchSymbol = async (query) => {
        const url = `${basePath}/search?q=${query}&token=${api_key}`;
        const response = await fetch(url);
        if (!response.ok) {
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
        }
        return await response.json();
      };

    // Company Profile 2 API call to finnhub api
    const companyDetails = async (symbol) => {
      const url = `${basePath}/stock/profile2?symbol=${symbol}&token=${api_key}`;
      const response = await fetch(url);
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      return await response.json();
    };

    // Stock Price - quote
    const stockQuote = async (symbol) => {
      const url = `${basePath}/quote?symbol=${symbol}&token=${api_key}`;
      const response = await fetch(url);
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      return await response.json();
    };
    
    // Stock Candles
    const stockCandles= async (symbol, resolution, from, to) => {
      const url = `${basePath}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${api_key}`;
      const response = await fetch(url);
      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      return await response.json();
    };

    // Company news YYYY-MM-DD
    const companyNews = async (symbol, from, to) => {
      const url = `${basePath}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${api_key}`;
      const response = await fetch(url);
      if (!response.ok) {
          const message = `An error has occured: ${response.status}`;
          throw new Error(message);
      }
      return await response.json();
    };

    // BookMark the stock
    const saveStock = async (symbol) => {
        const res = await axios.post("/stock/saveStock", {symbol});
        if (res.status >= 200 && res.status < 300) {
          console.log('Successfully bookmarked: ' + symbol);
        }
        else {
          console.log('failed to bookmark, most likely stock is already bookmarked');
        }

        // console.log("this is the saveStock api: " + res.data);
    }

    // get user stocks from database
    const getStocks = async () => {
      const authToken = getAuthToken();
      const res = await axios.get("/stock/getStocks", authToken)
      if (res.status == 200) {
        setStockList(res.data);
      } else {
        console.log('No data');
      }
    }


    return (
        // <StockContext.Provider value={{ searchSymbol, stockSymbol, setStockSymbol }}>
        <StockContext.Provider value={{
          searchSymbol, companyDetails, stockQuote, stockCandles, companyNews, saveStock, 
          setStockSymbol, stockSymbol, setQuote, quote, getStocks, stockList}}>
            {children}
        </StockContext.Provider>
    )
}