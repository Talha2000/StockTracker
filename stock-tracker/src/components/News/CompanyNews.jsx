import React from 'react'
import Card from '../Card/Card'

const CompanyNews = ({ info }) => {
  return (
    <Card>
        {/* <div className='border-2 w-full rounded-md h-36 overflow-y-scroll text-white bg-gray-900 border-neutral-200 custom-scrollbar'> */}
        <ul className= 'absolute p-1 top-0 left-0 w-full rounded-md sm:h-14 md:h-20 lg:h-22 xl:h-32 2xl:h-36 md:p-1 overflow-y-scroll text-white dark:bg-cyan-800/[0.2] custom-scrollbar'>
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