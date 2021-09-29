const Web3 = require( 'web3' )

require( 'dotenv' ).config();
const { API_URL, PRIVATE_KEY } = process.env;
const provider = new Web3.providers.HttpProvider( API_URL )
const web3 = new Web3( provider )

module.exports = web3;