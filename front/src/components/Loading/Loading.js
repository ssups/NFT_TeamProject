import React from 'react';
import '../../styles/loading.css';

const Loading = ({ LoadingStyle }) => {
  return (
    <div class="asd" style={{ ...LoadingStyle, zIndex: 999 }}>
      <p>Loading ...!</p>
    </div>
  );
};

export default Loading;
