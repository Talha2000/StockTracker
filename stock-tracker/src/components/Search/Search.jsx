import React, { useEffect, useState, useContext } from 'react'
// import StockContext from '../../context/stockContext';
import { SearchIcon, XIcon} from "@heroicons/react/solid"
import SearchResults from '../SearchResults/SearchResults';
import { searchSymbol } from '../../helpers/finnhubApis';

// import './searchStyle.scss';

const Search = () => {
    const [input, setInput] = useState("");
    const [bestMatches, setBestMatches] = useState([]);

    const clear = () => {
        setInput("");
        setBestMatches([]);
    }

    /*
    Some notes for Fetch vs Axios
    Fetch's body = Axios' data
    Fetch's body has to be stringified, Axios' data contains the object
    Fetch has no url in request object, Axios has url in request object
    Fetch request function includes the url as parameter, Axios request function does not include the url as parameter.
    Fetch request is ok when response object contains the ok property, Axios request is ok when status is 200 and statusText is 'OK'
    To get the json object response: in fetch call the json() function on the response object, in Axios get data property of the response object.
    */

    // TLDR: in AXIOS you have to use response.data where data include array data
    //       in FETCH, it returns the data but has to be stringified with response.json()
    const updateBestMatches = async () => {
        try {
          if (input) {
            const response = await searchSymbol(input);
            // const response = await axios.get(`/stock/searchResults?q=${input}`)
            // const data = response.data;
            // const data = await response.json();
            const data = response.result
            setBestMatches(data);
          }
        } catch (error) {
          setBestMatches([]);
          console.log(error);
        }
      }
      

    // const changeInput = (e) => {
    //   setInput(e.target.value);
    // }

    // const keyPressed = (e) => {
    //   if(e.key === "Enter") {
    //     updateBestMatches();
    //   }
    // }

  return (
    <div className="flex items-center mt-20 border-2 rounded-md relative z-50 w-96 bg-white border-neutral-200">
        <input type="text" value={input} className='w-full px-4 py-2 focus:outline-none rounded-md text-black'
        placeholder='Search Stock...'
        onChange={(event) => setInput(event.target.value)} // changeInput
        onKeyDown={(event) => { // keyPressed
          if (event.key === "Enter") {
            updateBestMatches();
          }
        }}>
        </input>

        {input && (
        <button onClick={clear} className="m-1">
          <XIcon className="h-4 w-4 fill-gray-500">
          </XIcon>
        </button>
        )}

        <button onClick={updateBestMatches} className="h-8 w-8 bg-cyan-800 rounded-md flex justify-center items-center m-1 p-2 transition duration-300 hover:ring-2 ring-cyan-700">
          <SearchIcon className='h-4 w-4 fill-gray-100'/>
        </button>

        {input && bestMatches.length > 0 ? <SearchResults results={bestMatches}/> : null}
    </div>
  )
}

export default Search