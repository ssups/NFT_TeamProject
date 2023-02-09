import React, { Component, useState } from 'react';
import Loading from '../components/Loading/Loading';

/**
 * @returns {Object} isLoading, setIsLoading, returnLoadingComp
 */

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @param {Object} componentStyle
   * @returns {Component} loading Component
   */

  function returnLoadingComp(style) {
    return <Loading LoadingStyle={style} />;
  }

  return { isLoading, setIsLoading, returnLoadingComp };
};

export default useLoading;
