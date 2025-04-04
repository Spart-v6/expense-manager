import React, { createContext, useState, useContext } from "react";

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [headerOptions, setHeaderOptions] = useState({
    title: "",
    showBack: false,
    rightButtons: [],
    onBackPress: () => {},
  });

  return (
    <HeaderContext.Provider value={{ headerOptions, setHeaderOptions }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);
