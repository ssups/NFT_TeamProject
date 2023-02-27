import React from 'react';
import '../../styles/loading.css';

const Loading = ({ loadingStyle }) => {
  return (
    <div
      className="asd"
      style={{
        ...loadingStyle,
        zIndex: 999999999,
        height: '100%',
        width: '100%',
        marginTop: '100px',
        position: 'fixed',
        top: 0,
      }}
    >
      <p>Loading ...!</p>
    </div>
  );
};

export default Loading;
