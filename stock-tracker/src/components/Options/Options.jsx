import React, { useContext, useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Card from '../Card/Card'
import styles from '../../styles.css';
import { BookmarkIcon } from '@heroicons/react/solid';
import { StockContext } from '../../context/stockContext';
import { AuthContext } from '../../context/authContext';

import {EyeIcon, EyeOffIcon} from '@heroicons/react/solid'
import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/themeContext';
const Options = ({data, stock}) => {
    const {saveStock, removeStock, stockList} = useContext(StockContext);
    const [option, setOption] = useState();
    const {darkMode} = useContext(ThemeContext);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (data.length === 0) {
                setOption(false);
            } else {
                // We get the data in form of an array of objects like [{}, {}, {}, ..., {}]
                // We go through the entire array. Each object is defined as "item" and from the item we get the stockName
                const listStocks = data.map((item) => item.stockName);
                if (listStocks.includes((stock))) {
                    setOption(true);
                } else {
                    setOption(false);
                }
            }   
        } catch (error) {
            console.log(error)
        };
    }, [stockList, navigate]);

        
    const bookMark = async () => {
        console.log("bookmark called");
        await(saveStock(stock));
        setOption(true);
    }

    const removeBookMark = async () => {
        console.log("removeBookMark called");
        await(removeStock(stock));
        setOption(false);
    }

    
    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { delay: 1 } },
    };

    return (
        <Card>
            <ul className='w-full h-full flex justify-center'>
                <li className='w-full flex items-center justify-center space-x-5 lg:text-lg xl:text-xl 2xl:text-2xl'>
                {
                    option ? (
                        <motion.button 
                                className={darkMode ? "btn-options" : "btn-optionsLight"}
                                type="button" onClick={removeBookMark}
                                variants={variants}
                                initial='hidden'
                                animate='visible'
                                > 
                                <EyeOffIcon className='w-9'/>
                        </motion.button>)
                    :
                    (
                        <motion.button 
                                className={darkMode ? "btn-options" : "btn-optionsLight"}
                                type="button" onClick={bookMark}
                                variants={variants}
                                initial='hidden'
                                animate='visible'
                                > 
                                <EyeIcon className='w-9'/>
                        </motion.button>
                    )
                }
                
                    <motion.button 
                            className={darkMode ? "btn-options" : "btn-optionsLight"}
                            type="button"
                            variants={variants}
                            initial='hidden'
                            animate='visible'> 
                        BUY 
                    </motion.button>

                    <motion.button 
                            className={darkMode ? "btn-options" : "btn-optionsLight"} 
                            type="button"
                            variants={variants}
                            initial='hidden'
                            animate='visible'>
                        SELL 
                    </motion.button>
                </li>
            </ul>
        </Card>
    )
}

export default Options