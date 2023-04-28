import React from 'react'

const Card = ({ children }) => {
  return (
    <div className='w-full h-full rounded-md relative p-4 border-2 border-cyan-600'>
      {children}
    </div>
  )
}

export default Card