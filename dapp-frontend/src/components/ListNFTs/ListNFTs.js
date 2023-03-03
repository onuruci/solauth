import React, { useEffect } from "react";
import { useState } from "react";

import Skeleton from "@mui/material/Skeleton";

import { walletAddress, getAllNFTs } from "../../utils/interaction";

const ListNFTs = () => {
  const [userNFTs, setNFTs] = useState([]);

  useEffect(() => {
    if (walletAddress) {
      getAllNFTs(setNFTs);
    }
  }, [walletAddress]);

  return (
    <code className="introstyle">
      <div>All DoGGO's</div>
      {userNFTs.length === 0 ? (
        <div className="doglist">
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="circular" width={120} height={120} />
        </div>
      ) : (
        <div className="doglist">
          {userNFTs.map((e, i) => {
            return (
              <div>
                <img className="doglistimage" src={e} />
              </div>
            );
          })}
        </div>
      )}
    </code>
  );
};

export default ListNFTs;
