const solanaWeb3 = require('@solana/web3.js');
//console.log(solanaWeb3);

let axios = require("axios");


dothis = async function () {
    let config = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getInflationReward",
        "params": [
          ["BdLv3bn8AUe1aVSy35Fi8qRHyrNcaijnqpoJaibGYY8M"], {"epoch": 154}
        ]
      };
    //   let config = {
    //     "jsonrpc": "2.0",
    //     "id": 1,
    //     "method": "getEpochInfo",
    //   };

    // let config = {
    //     "jsonrpc": "2.0",
    //     "id": 1,
    //     "method": "getTransaction",
    //     "params": [
    //       "2nBhEBYYvfaAe16UMNqRHre4YNSskvuYgx3M6E4JP1oDYvZEJHvoPzyUidNgNX5r9sTyN1J9UxtbCXy2rqYcuyuv",
    //       "json"
    //     ]
    //   }

    //   let config = {
    //     "jsonrpc": "2.0",
    //     "id": 1,
    //     "method": "getBalance",
    //     "params": [
    //       "2nBhEBYYvfaAe16UMNqRHre4YNSskvuYgx3M6E4JP1oDYvZEJHvoPzyUidNgNX5r9sTyN1J9UxtbCXy2rqYcuyuv",
    //       "json"
    //     ]
    //   }

      
    
      let url = `https://api.velas.com`
      let data = await axios.post(url, config).then((d)=>{
          console.log(d.data)
          return d.data})
}

dothis().then((value) => {
    console.log(value);
    return value
  });
