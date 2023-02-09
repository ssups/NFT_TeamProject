import React, { useState } from 'react';
import Loading from '../components/Loading/Loading';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  function returnLoadingComp(style) {
    return <Loading LoadingStyle={style} />;
  }

  return { isLoading, setIsLoading, returnLoadingComp };
};

export default useLoading;
