import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import {StockContext} from '../context/stockContext'
import { AuthContext } from '../context/authContext'
import StockInfo from '../components/StockInfo/StockInfo'
import Overview from '../components/Overview/Overview'
import Chart from '../components/Chart/Chart'
import Search from '../components/Search/Search'
import Options from '../components/Options/Options'
import CompanyNews from '../components/News/CompanyNews'
import { chartConfig } from '../constants/config'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"

const DashBoard = () => {
  const {stockSymbol, companyDetails, setQuote, quote, stockQuote, companyNews, getStocks, stockList} = useContext(StockContext);
  const {currentUser, getAuthToken} = useContext(AuthContext);
  const [stockDetails, setStockDetails] = useState({});
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  
  const { stockName } = useParams();
  console.log(stockName);
  const [ symbol, setSymbol ] = useState();

  const formatDate = () => {
    const endDateString = new Date();
    const startDateString = new Date();
    startDateString.setMonth(endDateString.getMonth() - 1);

    const startDate = startDateString.toISOString().slice(0, 10); // e.g. "2022-04-09"
    const endDate = endDateString.toISOString().slice(0, 10); // e.g. "2023-04-09"
    return {startDate, endDate};
  };

  const checkParam = () => {
    if (stockName !== undefined) {
      console.log("This is the stockName in IF: " + stockName)
      return stockName
    }
    else {
      console.log("This is the ELSE: " + stockSymbol)
      return "META"
    }
  };

  //If there is any change in the stockSymbol, this hook is called
  useEffect(() => { 
    if (currentUser == null) {
      navigate('StockTrackerMain/login')
    }
    const getSymbol = async () => {
      setSymbol(await checkParam());
      console.log("this is the symbol after check Param: " + symbol);
      console.log("After functin call " + symbol);
      getInfo();
      getCompanyData();
    }
    
    // get all the stocks the user has already BookMarked from the userStocks table
    const getInfo = async () => {
      try {
        console.log("getInfo called")
          await(getStocks());
          console.log("getStocks done")
      }
      catch (exception) {
          console.log(exception)
      };
    };

    const getCompanyData = async () => {
      try {
        console.log("getCompanyData called")
        const {startDate, endDate } = await formatDate();

        const responseDetails = await companyDetails(stockName);
        setStockDetails(responseDetails);

        const responseQuote = await stockQuote(stockName);
        setQuote(responseQuote);

        const responseNews = await companyNews(stockName, startDate, endDate);
        setNews(responseNews);
      } catch (error) {
        setStockDetails({});
        setQuote({});
        setNews([]);
        console.log(error)
      };
    };

    getSymbol();
    
    const interval = setInterval(() => {
      getCompanyData(); // call the API every 5 minutes
    }, 5 * 60 * 1000);
    return () => clearInterval(interval); // clean up the interval
  }, [currentUser, stockName, navigate]); // stockSymbol is the dependency for the useEffect

  const variants = {
    hidden: { opacity: 0, y : 0},
    visible: { opacity: 1, y: -10, transition: { duration: 2 } },
  };

  return (
    <motion.div className='text-white pb-20 pt-10 h-screen w-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand bg-mainBg'>

      <motion.div className="mt-10 col-span-1 md:col-span-2 xl:col-span-3 row-span-1 flex justify-start items-center" style={{ zIndex: '1' }}
                  variants={variants}
                  initial='hidden'
                  animate='visible'
                >
        <Search/>
      </motion.div>

      <motion.div className="mt-5" style={{ zIndex: '0' }}
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

      <motion.div className="mt-5 md:col-span-2 row-span-3"
                  variants={variants}
                  initial='hidden'
                  animate={{opacity: 1, transition: { delay: 2}}}
                >
        <Chart/>
      </motion.div>

      <motion.div className="row-span-2 xl:row-span-3"
                  variants={variants}
                  initial='hidden'
                  animate={{opacity: 1, transition: { duration: 4 }}}
                >
        <StockInfo data={stockDetails}/>
      </motion.div>

      <motion.div className=""
                  variants={variants}
                  initial='hidden'
                  animate={{opacity: 1, transition: { duration: 3 }}}
                >
        <Options data={stockList} user={currentUser}/>
      </motion.div>

      <motion.div className=""                  
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