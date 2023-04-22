import React, { useContext, useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Card from '../Card/Card'
import styles from '../../styles.css';
import { BookmarkIcon } from '@heroicons/react/solid';
import { StockContext } from '../../context/stockContext';
import { AuthContext } from '../../context/authContext';

import {EyeIcon, EyeOffIcon} from '@heroicons/react/solid'
import { motion } from "framer-motion"


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

    
    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { delay: 1 } },
    };

    return (
        <Card>
            <ul className='w-full h-full flex justify-center '>
                <li className='flex items-center justify-center space-x-5'>
                {
                    option ? (
                        <motion.button 
                                className='btn-options hover:text-sky-700'
                                type="button" onClick={removeBookMark}
                                variants={variants}
                                initial='hidden'
                                animate='visible'
                                > 
                                <EyeOffIcon className='w-9'/>
                        </motion.button>)
                    :
                    (
                        <motion.button className='btn-options hover:text-sky-700'
                                type="button" onClick={bookMark}
                                variants={variants}
                                initial='hidden'
                                animate='visible'
                                > 
                                <EyeIcon className='w-9'/>
                        </motion.button>
                    )
                }
                
                    <motion.button className='btn-options' 
                            type="button"
                            variants={variants}
                            initial='hidden'
                            animate='visible'> 
                        Buy 
                    </motion.button>

                    <motion.button className='btn-options' 
                            type="button"
                            variants={variants}
                            initial='hidden'
                            animate='visible'>
                        Sell 
                    </motion.button>
                </li>
            </ul>
        </Card>
    )
}

export default Options