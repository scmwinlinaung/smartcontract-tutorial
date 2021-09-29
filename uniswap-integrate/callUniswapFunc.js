const Web3 = require( 'web3' )

require( 'dotenv' ).config();
const API_URL = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const provider = new Web3.providers.HttpProvider( API_URL )
const web3 = new Web3( provider )
const tokenAddress = "0xab2a7ee096c3ab2a2Ccc82fA2720fE8d183372AE";
const pk = "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const from = "2769f9ea642955caf9bf69a5ada402ef41d41dc000f74847c90f8dae5ba51b42";
const {
    factoryABI,
    factoryAddress,
    exchangeABI,
    tokenABI
} = require( "./uniswapInfo" );
// integrate uniswap protocol
async function main ()
{
    try
    {

        const factoryContract = new web3.eth.Contract( factoryABI, factoryAddress );
        // can use once 
        // await createExchange( factoryContract, factoryAddress )
        const exchangeAddress = await factoryContract.methods.getExchange( tokenAddress ).call();;
        const exchangeContract = new web3.eth.Contract( exchangeABI, exchangeAddress );
        // const tokenAddress1 = await factoryContract.methods.getToken( exchangeAddress ).call();
        const ethReserve = await web3.eth.getBalance( exchangeAddress );
        const tokenContract = new web3.eth.Contract( tokenABI, tokenAddress );
        // const tokenReserve = await tokenContract.methods.balanceOf( exchangeAddress ).call();
        console.log( exchangeAddress )
    } catch ( e )
    {
        console.log( e )
    }
}

async function createExchange ( contract, contractAddress )
{
    const bytecodeWithEncodedParameters = contract.methods
        .createExchange( tokenAddress )
        .encodeABI();
    const { address: userAddress } =
        web3.eth.accounts.privateKeyToAccount( from );

    const nonce = await web3.eth.getTransactionCount( userAddress );
    console.log( nonce )
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = await web3.eth.estimateGas( {
        to: contractAddress,
        data: bytecodeWithEncodedParameters,
    } );
    console.log( "Gas Limit for transaction " + gasLimit );
    const txObject = {
        to: contractAddress,
        nonce: web3.utils.toHex( nonce ),
        gasLimit: web3.utils.toHex( gasLimit ),
        gasPrice: web3.utils.toHex( gasPrice ),
        data: `${ bytecodeWithEncodedParameters }`,
        from: userAddress
    };

    const signedTx = await web3.eth.accounts.signTransaction(
        txObject,
        from
    );

    await web3.eth
        .sendSignedTransaction( signedTx.rawTransaction )
        .catch( ( reason ) =>
        {
            console.log( reason );
        } );
}

main();