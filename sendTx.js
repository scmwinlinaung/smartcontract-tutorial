async function main() {
    require('dotenv').config();
    const { API_URL, PRIVATE_KEY } = process.env;
    // const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
    const Web3 = require('web3')
    const provider  = new Web3.providers.HttpProvider(API_URL)
    const web3 = new Web3(provider)

    // const web3 = createAlchemyWeb3(API_URL);
    const myAddress = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57' //TODO: replace this address with your own public address
   
    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest'); // nonce starts counting from 0

    const transaction = {
     'to': '0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73', // faucet address to return eth
     'value': 1000000000000000000, // 1 ETH
     'gas': 30000, 
     'nonce': nonce,
     // optional data field to send message or execute smart contract
    };
   
    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
    
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
    if (!error) {
      console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
    } else {
      console.log("❗Something went wrong while submitting your transaction:", error)
    }
   });
}

main();
