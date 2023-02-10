import React, { createContext, useEffect, useState } from 'react';

import Header from '../components/Header/Header';
import Loading from '../components/Loading/Loading';
import { REACT_APP_BACK_URL_HI } from '../constant/urlConstant';
import Routers from '../routes/Routers';

const Layout = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('로딩', isLoading);
  }, [isLoading]);

  return (
    <>
      {/* 전체페이지에 헤더 적용 */}
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
