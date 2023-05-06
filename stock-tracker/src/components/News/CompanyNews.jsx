import React, { useContext } from 'react'
import Card from '../Card/Card'
import { ThemeContext } from '../../context/themeContext';
const CompanyNews = ({ info }) => {
    const {darkMode} = useContext(ThemeContext);

    return (
        <Card>
            {/* <div className='border-2 w-full rounded-md h-36 overflow-y-scroll text-white bg-gray-900 border-neutral-200 custom-scrollbar'> */}
            <ul className={`w-full h-full absolute p-2 top-0 left-0 rounded-md  
                            overflow-y-scroll   custom-scrollbar
                            ${darkMode ? "text-white bg-cyan-800/[0.2] " : "text-black bg-neutral-300"}`}>
                {info.map((item) => {
                    return (
                        <li className='flex items-center justify-between p-2 text-right' key={item.id}>
                            {/* <h2>{value.category}</h2> */}
                            <img className='h-14 w-14' src={item.image} alt={item.headline} />
                            <span>{item.headline}</span>
                        </li>
                    );
                })};
            </ul>
            {/* </div> */}
        </Card>
  );
};

export default CompanyNews