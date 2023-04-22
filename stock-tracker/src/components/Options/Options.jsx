import React, { useContext, useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Card from '../Card/Card'
import styles from '../../styles.css';
import { BookmarkIcon } from '@heroicons/react/solid';
import { StockContext } from '../../context/stockContext';
import { AuthContext } from '../../context/authContext';

import {EyeIcon, EyeOffIcon} from '@heroicons/react/solid'

const Options = ({data, user}) => {
    const {stockSymbol, saveStock, stockList, getStocks} = useContext(StockContext);
    const [option, setOption] = useState();

    useEffect(() => {
        try {
            if (data.length === 0) {
                setOption(false);
            } else {
                // We get the data in form of an array of objects like [{}, {}, {}, ..., {}]
                // We go through the entire array. Each object is defined as "item" and from the item we get the stockName
                const listStocks = data.map((item) => item.stockName);
                if (listStocks.includes((stockSymbol))) {
                    setOption(true);
                } else {
                    setOption(false);
                }
            }   
        } catch (error) {
            console.log(error)
        };
    }, [stockList, user]);

        
    const bookMark = async () => {
        console.log("bookmark called");
        await(saveStock(stockSymbol));
        setOption(true);
    }

    const removeBookMark = async () => {
        console.log("removeBookMark called");
        await(saveStock(stockSymbol));
        setOption(false);
    }
  return (
    <Card>
        <ul className='w-full h-full flex justify-center '>
            <li className='flex items-center justify-center space-x-5'>
            {
                option ? (<button className='btn-options hover:text-sky-700'
                    type="button" onClick={removeBookMark}> 
                    <EyeOffIcon className='w-9'/>
                </button>)
                :
                (<button className='btn-options hover:text-sky-700'
                    type="button" onClick={bookMark}> 
                    <EyeIcon className='w-9'/>
                </button>)
            }
               
                <button className='btn-options ' type="button"> Buy </button>

                <button className='btn-options' type="button"> Sell </button>
            </li>
        </ul>
    </Card>
  )
}

export default Options