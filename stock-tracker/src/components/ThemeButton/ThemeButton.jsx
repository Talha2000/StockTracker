
import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../context/themeContext";
import { MoonIcon } from "@heroicons/react/solid";

export const ThemeButton = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const moonIconClasses = useMemo(() => {
    return `h-6 w-11  cursor-pointer stroke-1 ${
      darkMode ? "fill-yellow-400 stroke-yellow-400" : "fill-black stroke-neutral-400"
    }`;
  }, [darkMode]);

  return (
<label class="relative flex items-center justify-center cursor-pointer ">
  <input type="checkbox" value="" className="sr-only peer" onChange={toggleDarkMode}/>
  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer
             dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
             after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"><MoonIcon className={moonIconClasses} /></span>
</label>

    // <label className="relative right-0 top-4 inline-flex items-center cursor-pointer">
    // <input type="checkbox" value="" className="sr-only peer" onChange={toggleDarkMode}
    //         checked={darkMode}/>
    // {/* <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div> */}
    //    {/* <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Checked toggle</span> */}
    //   <MoonIcon className={moonIconClasses} />
    // </label>
    
  //   <button
  //   onClick={toggleDarkMode}
  //   className={`top-5 right-36	 rounded-lg border-1 border-neutral-400 p-2 absolute shadow-lg transition duration-300 ${
  //     darkMode ? "shadow-gray-800" : null
  //   }`}
  // >
  //   <MoonIcon
  //     className={`h-8 w-8 cursor-pointer stroke-1 ${
  //       darkMode
  //         ? "fill-yellow-400 stroke-yellow-400"
  //         : "fill-none stroke-neutral-400"
  //     }`}
  //   />
  // </button>
  );
};

export default ThemeButton