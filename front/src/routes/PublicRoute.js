import React from 'react';
import { Navigate } from 'react-router-dom';
import useWeb3 from '../hooks/useWeb3';



const PublicRoute = ({ children }) => {
    const {web3} = useWeb3()
  return web3 ? <Navigate to='/' /> : children;
};

export default PublicRoute;