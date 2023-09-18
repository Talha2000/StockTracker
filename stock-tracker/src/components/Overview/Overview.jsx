import React, { useContext } from 'react'
import Card from '../Card/Card'
import { ThemeContext } from '../../context/themeContext'
import Options from '../Options/Options'

const Overview = ({ symbol, price, change, changePercent, currency }) => {
  const {darkMode} = useContext(ThemeContext);
  return (
    <Card>
        {/* <div className='pt-5 w-full h-full flex items-center justify-around'> */}
        <div className=' p-5 w-full h-full flex flex-col justify-around items-center sm:flex-row sm:pt-5 md:pt-12'>
          <span className='absolute left-4 top-4 text-xl font-bold xl:text-xl 2xl:text-2xl mb-2'>{symbol}</span>
            <span className='text-2xl xl:text-4xl 2xl:text-5xl flex items-center'>
                ${price}
                <span className='font-bold text-lg xl:text-xl 2xl:text-2xl text-neutral-400 ml-2'>
                    {currency}
                </span>
            </span>
            <span className={`text-xl xl:text-2xl 2xl:text-3xl
                    ${change > 0 ? 'text-lime-500' : 'text-red-500'}`}>
                    {change}
                    <span className='p-1'>({changePercent}%)</span>
          </span>
        </div>
    </Card>
  )
}

export default Overview