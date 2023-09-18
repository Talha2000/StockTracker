import React, {useContext, useEffect, useState ,useCallback} from 'react'
import { useParams } from 'react-router-dom'
import {StockContext} from '../context/stockContext'
import { AuthContext } from '../context/authContext'
import StockInfo from '../components/StockInfo/StockInfo'
import Overview from '../components/Overview/Overview'
import Chart from '../components/Chart/Chart'
import Search from '../components/Search/Search'
import Options from '../components/Options/Options'
import CompanyNews from '../components/News/CompanyNews'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import { ThemeContext } from '../context/themeContext'

const DashBoard = () => {
  const {setStockSymbol, companyDetails, setQuote, quote, stockQuote, companyNews, stockList} = useContext(StockContext);
  const {currentUser, getAuthToken} = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  const [stockDetails, setStockDetails] = useState({});
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  const { stockName } = useParams();

  const formatDate = () => {
    const endDateString = new Date();
    const startDateString = new Date();
    startDateString.setMonth(endDateString.getMonth() - 1);

    const startDate = startDateString.toISOString().slice(0, 10); // e.g. "2022-04-09"
    const endDate = endDateString.toISOString().slice(0, 10); // e.g. "2023-04-09"
    return {startDate, endDate};
  };

  //If there is any change in the stockSymbol, currentuser or navigation, this hook is called
  const loadData = useCallback(async () => {
    if (currentUser == null) {
      navigate('/login');
      return;
    }
  
    try {
      const {startDate, endDate} = await formatDate();
      const [details, quote, news] = await Promise.all([
        companyDetails(stockName),
        stockQuote(stockName),
        companyNews(stockName, startDate, endDate),
      ]);
      setStockDetails(details);
      setQuote(quote);
      setNews(news);
      
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, stockName, navigate]);

  useEffect(() => {
    const getSymbolAndLoadData = async () => {
      const symbol = await checkParam();
      setStockSymbol(symbol);
      loadData();
    }
    getSymbolAndLoadData();

    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  const checkParam = async () => {
    if (stockName !== undefined) {
      return stockName
    }
    else {
      return undefined
    }
  };

  const variants = {
    hidden: { opacity: 0, y : 0},
    visible: { opacity: 1, y: -10, transition: { duration: 2 } },
  };
  return (
    // <motion.div className='text-white pb-20 pt-10 h-screen w-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand bg-mainBg'>
    // <motion.div className='text-white pb-20 pt-10 h-screen w-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand bg-mainBg'>
    <motion.div className={`h-full w-full grid grid-cols-1 md:h-screen md:grid-cols-2 xl:grid-cols-3 grid-rows-8 
                          md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-8 font-quicksand
                          ${darkMode ? "text-white bg-mainBg ease-in duration-200" : "text-black bg-neutral-200 ease-in duration-200" }`}>
                            
      <motion.div className="col-span-1 row-span-1 md:row-span-1 md:col-span-2 xl:col-span-3 flex justify-start items-center" style={{ zIndex: '1' }}
                  variants={variants}
                  initial='hidden'
                  animate='visible'
                >
        <Search/>
      </motion.div>

      {/* <motion.div className="mt-5 w-full h-full row-span-2 sm:row-span-1" style={{ zIndex: '0' }} */}
      <motion.div className="row-span-1 sm:row-span-1" style={{ zIndex: '0' }}
                  variants={variants}
                  initial='hidden'
                  animate={{opacity: 1, transition: { duration: 2 }}}
                >
        <Overview 
          symbol={stockName} 
          price={quote.pc}
          change={quote.d} 
          changePercent={quote.dp} 
          currency={stockDetails.currency}
        />
      </motion.div>

      <motion.div className="row-span-2 md:col-span-2 xl:row-span-3"
                  variants={variants}
                  initial='hidden'
                  animate={{opacity: 1, transition: { delay: 2}}}
                >
        <Chart symbol={stockName}/>
      </motion.div>

      <motion.div className="row-span-2 xl:row-span-3"
                  variants={variants}
                  initial='hidden'
                  animate={{opacity: 1, transition: { duration: 4 }}}
                >
        <StockInfo data={stockDetails}/>
      </motion.div>

      <motion.div className="row-span-1 sm:row-span-1"
                  variants={variants}
                  initial='hidden'
                  animate={{opacity: 1, transition: { duration: 3 }}}
                >
        <Options data={stockList} user={currentUser} stock={stockName}/>
      </motion.div>

      <motion.div className="row-span-2 sm:row-span-1"                  
                  variants={variants}
                  initial='hidden'
                  animate={{opacity: 1, transition: { duration: 4 }}}
                >
        <CompanyNews info={news}/>
      </motion.div>
    </motion.div>
  )
}

export default DashBoard