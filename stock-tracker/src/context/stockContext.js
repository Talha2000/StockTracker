import { createContext, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

import { searchSymbol, companyDetails, stockQuote, getHistoricalData as stockCandles, companyNews } from "../helpers/finnhubApis";

export const StockContext = createContext();


export const StockContextProvider = ({children}) => {
    const [stockSymbol, setStockSymbol] = useState();
    const {getAuthToken} = useContext(AuthContext);
    const [quote, setQuote] = useState({});
    const [stockList, setStockList ] = useState([]);

    // BookMark the stock
    const saveStock = async (symbol) => {
      const authToken = await getAuthToken();
      const res = await axios.post("https://stocktrackerapi.onrender.com/api/stock/saveStock", {symbol}, authToken);
      if (res.status >= 200 && res.status < 300) {
        console.log('Successfully bookmarked: ' + symbol);
      }
      else {
        console.log('failed to bookmark, most likely stock is already bookmarked');
      }
    }

    // removeBookMark
    const removeStock = async (symbol) => {
      const authToken = await getAuthToken();
        const res = await axios.post("https://stocktrackerapi.onrender.com/api/stock/removeStock", {symbol}, authToken);
        if (res.status >= 200 && res.status < 300) {
          console.log('Successfully removed bookmark: ' + symbol);
        }
        else {
          console.log('Failed to remove bookmark');
        }
    }



    // get user stocks from database
    const getStocks = async () => {
      const authToken = await getAuthToken();
      const res = await axios.get("https://stocktrackerapi.onrender.com/api/stock/getStocks", authToken)
      if (res.status == 200) {
        setStockList(res.data);
      } 
      else if (res.status == 401) {
          console.log("This is hit with 401");
      }
      else {
        console.log("There was an error in retrieving the data")
      }
    }


    return (
        // <StockContext.Provider value={{ searchSymbol, stockSymbol, setStockSymbol }}>
        <StockContext.Provider value={{
          searchSymbol, companyDetails, stockQuote, stockCandles, companyNews, saveStock, removeStock,
          setStockSymbol, stockSymbol, setQuote, quote, getStocks, stockList}}>
            {children}
        </StockContext.Provider>
    )
}