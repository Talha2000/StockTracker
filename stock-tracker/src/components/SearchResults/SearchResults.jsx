import React, { useContext } from 'react'
import {StockContext} from '../../context/stockContext'
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/themeContext';

const SearchResults = ({ results }) => {

  const {setStockSymbol} = useContext(StockContext);
  const {darkMode} = useContext(ThemeContext);
  const navigate = useNavigate();
  // const changeStockSymbol = (item) => {
  //   setStockSymbol(item.symbol);
  // }
  // changeStockSymbol(item)
  return (
  // <div className="">
    <ul className={`absolute top-12 border-2 w-full rounded-md h-64 overflow-y-scroll   custom-scrollbar
                   ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-700"}`}>
        {results.map((item) => {
            return (
                <li key={item.symbol} 
                  className={`cursor-pointer p-4 m-2 flex items-center justify-between rounded-md 
                              transition ease-in-out duration-200
                             ${darkMode ? "hover:bg-white hover:text-black" : "hover:bg-black hover:text-white" }`}
                  onClick={() => {setStockSymbol(item.symbol); navigate(`/${item.symbol}`)} }> 
                  <span> {item.symbol} </span>
                  <span> {item.description} </span>
              </li>
            );
        })};
    </ul>

    // </div>
  );
};

export default SearchResults