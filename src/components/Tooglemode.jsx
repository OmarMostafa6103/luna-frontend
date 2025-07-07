import React, { useState, useEffect } from 'react';


const Togglemode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark'); 
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  

  return (
    <button
      onClick={toggleTheme}
      className="p-2  bg-gray-200 dark:bg-gray-700 text-black h-10 w-10 dark:text-white rounded-[50%]"
    >
      {isDarkMode ? '🌙' : '☀︎'}
    </button>
  );
};

export default Togglemode;