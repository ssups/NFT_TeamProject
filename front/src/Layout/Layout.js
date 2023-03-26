import React, { createContext, useState } from 'react';

import Header from '../components/Header/Header';
import Loading from '../components/Loading/Loading';
import Routers from '../routes/Routers';

const Layout = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Header />
      <LoadingContext.Provider value={{ setIsLoading }}>
        <div>
          {isLoading ? <Loading /> : null}
          <Routers />
        </div>
      </LoadingContext.Provider>
    </>
  );
};

export const LoadingContext = createContext();
export default Layout;
