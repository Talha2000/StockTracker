import React, { useContext } from 'react'
import {StockContext} from '../../context/stockContext'
import { useNavigate } from 'react-router-dom';

// import './searchResult.scss'
const SearchResults = ({ results }) => {

  const {setStockSymbol} = useContext(StockContext)
  const navigate = useNavigate();
  // const changeStockSymbol = (item) => {
  //   setStockSymbol(item.symbol);
  // }
  // changeStockSymbol(item)
  return (
    <ul className='absolute top-12 border-2 w-full rounded-md h-64 overflow-y-scroll text-black bg-white border-neutral-200 custom-scrollbar'>
        {results.map((item) => {
            return (
                <li key={item.symbol} 
                  className='cursor-pointer p-4 m-2 flex items-center justify-between rounded-md hover:bg-cyan-100'
                  onClick={() => {setStockSymbol(item.symbol); navigate(`/${item.symbol}`)} }> 
                  <span> {item.symbol} </span>
                  <span> {item.description} </span>
              </li>
            );
        })};
    </ul>
  );
};

export default SearchResults