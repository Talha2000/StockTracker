import React from 'react'
import Card from '../Card/Card'

const StockInfo = ({data}) => {
    const dataList = {
        name: "Name",
        country: "Country",
        currency: "Currency",
        exchange: "Exchange",
        marketCapitalization: "Market Capitilization",
        finnhubIndustry: "Industry"
    }

    const convertValue = (number) => {
        return (number / 1000).toFixed(2);
    }

  return (
    <Card>
        <ul className='w-full h-full flex flex-col justify-between divide-y-1'>
            {Object.keys(dataList).map((item) => {
                return (
                <li key={item} className='flex-1 flex justify-between items-center'>
                    <span className=''>{dataList[item]}</span>
                    <span>{item === "marketCapitalization"
                            ? `${convertValue(data[item])}B`
                            : data[item]}</span>
                </li>
                );
            })}
        </ul>
    </Card>
  );
};

export default StockInfo