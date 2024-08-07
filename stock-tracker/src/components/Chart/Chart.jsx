import React, { useContext, useEffect, useState } from 'react'
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Card from '../Card/Card'
import Filters from './Filters';
import { chartConfig } from '../../constants/config';
import { convertUnixTimeStampToDate, convertDateToUnixTimeStamp, createDate } from '../../helpers/helper';
import { getHistoricalData } from '../../helpers/finnhubApis';
// import { StockContext } from '../../context/stockContext';
import { ThemeContext } from '../../context/themeContext';
import { useNavigate } from 'react-router-dom';

const Chart = ({symbol}) => {
    const [data, setChartData] = useState([]);
    const [filter, setFilter ] = useState("1W");
    // const {stockSymbol} = useContext(StockContext);

    const {darkMode} = useContext(ThemeContext);
    const navigate = useNavigate();
    const formatData = (data) => {
        return data.c.map((item, index) => {
            return {
                value: item.toFixed(2),
                date: convertUnixTimeStampToDate(data.t[index])
            };
        });
    };

    useEffect(() => {
        const getDateInterval = () => {
            // javascript destructing property
            const {days, weeks, months, years} = chartConfig[filter];

            const endDate = new Date();
            const startDate = createDate(endDate, -days, -weeks, -months, -years);

            const startTimeUnix = convertDateToUnixTimeStamp(startDate);
            const endDateUnix = convertDateToUnixTimeStamp(endDate);

            return {startTimeUnix, endDateUnix};
        };

        const updateChart = async () => {
            try{
                const {startTimeUnix, endDateUnix } = getDateInterval();
                const resolution = chartConfig[filter].resolution;
                const response = await getHistoricalData(symbol, resolution, startTimeUnix, endDateUnix);
                setChartData(formatData(response));
            }
            catch (error) {
                setChartData([]);
                console.log(error);
            };
        };

        updateChart();
    }, [symbol, filter, navigate]);

  return (
    <Card>
        <ul className='flex absolute top-0 right-2 z-40'>
            {Object.keys(chartConfig).map((item) => {
                return (
                    <li key={item}>
                        <Filters 
                        text={item} 
                        active={filter === item}
                        onClick={() => {
                            setFilter(item);
                        }}/>
                    </li>
                );
            })}
        </ul>
        <ResponsiveContainer>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={darkMode ? "white" : "black"} stopOpacity={0.9}/>
                    <stop offset="95%" stopColor={darkMode ? "cyan" : "black"} stopOpacity={0.2}/>
                    </linearGradient>
                </defs>
                <Tooltip
                    // contentStyle={{ backgroundColor: "#111827" }}
                    // itemStyle={{ color: "#818cf8" }}
                    // contentStyle={{backgroundColor: "#111827" }}
                    // itemStyle={{ color: "#818cf8" }}
                    contentStyle={{ backgroundColor: darkMode ? "#1f2937" : "#f9fafb" }}
                    itemStyle={{ color: "#818cf8" }}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#312e81" 
                    fill="url(#chartColor)"
                    fillOpacity={1} 
                    strokeWidth={0.5}
                />
                <XAxis dataKey="date"/>
                <YAxis domain={["dataMin", "dataMax"]}/>
            </AreaChart> 
        </ResponsiveContainer>
    </Card>
  );
};

export default Chart