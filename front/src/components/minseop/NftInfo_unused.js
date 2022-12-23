import React, { useEffect, useState } from "react";
import axios from "axios";

const NftInfo = ({ tokenId, nftURI }) => {
  //
  const [jsonData, setJsonData] = useState();
  const [attributes, setAttributes] = useState();

  // ==========================================useEffect==========================================
  // =============================================================================================

  useEffect(() => {
    //
    (async () => {
      //
      // "http://localhost:4000/1.json"
      const jsonData = await axios.get(`${nftURI}.json`);
      setAttributes(jsonData.data.attributes);
      setJsonData(jsonData.data);
    })();
  }, []);

  // ===========================================returns===========================================
  // =============================================================================================

  return (
    <div style={{ marginRight: "10px" }}>
      <div>토큰아이디: {tokenId}</div>
      {jsonData && (
        <>
          <div>name : {jsonData.name}</div>

          {/* "http://localhost:4000/images/2.png" */}
          <img style={{ width: "200px", height: "200px" }} src={jsonData.image} alt="" />

          {attributes.map((attribute) => {
            return <div key={attribute.trait_type}>{attribute.trait_type + " : " + attribute.value}</div>;
          })}
        </>
      )}
    </div>
  );
};

export default NftInfo;
