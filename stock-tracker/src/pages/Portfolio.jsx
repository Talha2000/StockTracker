import React, { useContext, useEffect, useState} from 'react'
import Card from '../components/Card/Card'
import { StockContext } from '../context/stockContext'
import { Link, useNavigate} from 'react-router-dom'

const Portfolio = () => {
  const {stockList, getStocks, stockQuote} = useContext(StockContext);
  const [stockPrices, setStockPrices] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      await getStocks();
    }
    getData();
  }, []);

  useEffect(() => {
    const getStockPrices = async () => {
      const symbols = stockList.map(stock => stock.stockName);

      const stockPrices = await Promise.all(symbols.map(async (stock) => {
        const price = await stockQuote(stock);
        console.log("this is hte price" + price);
        return price.pc
      }));
      setStockPrices(stockPrices);
    }
    
    getStockPrices();
  }, [stockList])

  console.log(stockList);
  console.log(stockPrices);
// make it so that the price is colored based on negative or postive percent gain...

  const navigateStock = (stockName) => {
    navigate(`/${stockName}`)
  }

  return (
      <div className='h-screen w-screen bg-mainBg flex justify-center items-center'>
        <div className='h-1/2 w-1/2 border flex justify-center items-center text-white'>
          <div className='positive absolute top-20 text-3xl'>My Portfolio</div>
          <table className="table-fixed m-32 border-cyan-600 rounded-lg text-center w-screen text-white align-center">
              <thead>
                <tr>
                  <th className='p-4'>Stock Name</th>
                  <th className=''>Current Price</th>
                </tr>
              </thead>
              <tbody className="">
                {
                  stockList.map((item, index) => (
                    <tr className="border-b-2 border-t-2 border-cyan-600" key={index}>
                      <td>
                        <button onClick={() => navigateStock(item.stockName)}
                          className='p-2 m-2 bg-neutral-200 rounded-lg w-1/2 text-black hover:bg-cyan-600 hover:text-white '>
                          {item.stockName}
                        </button>
                      </td>
                      <td>{stockPrices[index] ?? '---'}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
        </div>
      </div>
  )
}

export default Portfolio