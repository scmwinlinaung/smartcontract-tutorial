require( 'dotenv' ).config();
const { API_URL, PRIVATE_KEY } = process.env;
const Web3 = require( 'web3' )
const provider = new Web3.providers.HttpProvider( API_URL )
const web3 = new Web3( provider )

async function main ()
{
	const { API_URL, PRIVATE_KEY } = process.env;
	const Web3 = require( 'web3' )
	const provider = new Web3.providers.HttpProvider( API_URL )
	const web3 = new Web3( provider )
	// console.log(await getBlockNumber())

	const myAddress = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57' //TODO: replace this address with your own public address


	const nonce = await getNonce( myAddress ); // nonce starts counting from 0
	console.log( nonce )

	const ABI = [
		{
			inputs: [
				{
					internalType: 'string',
					name: '_firstName',
					type: 'string',
				},
				{
					internalType: 'string',
					name: '_lastName',
					type: 'string',
				},
				{
					internalType: 'string',
					name: '_userName',
					type: 'string',
				},
				{
					internalType: 'string',
					name: '_signature',
					type: 'string',
				},
			],
			stateMutability: 'nonpayable',
			type: 'constructor',
		},
		{
			inputs: [],
			name: 'getUser',
			outputs: [
				{
					internalType: 'string',
					name: '',
					type: 'string',
				},
				{
					internalType: 'string',
					name: '',
					type: 'string',
				},
				{
					internalType: 'string',
					name: '',
					type: 'string',
				},
			],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'string',
					name: 'document',
					type: 'string',
				},
				{
					internalType: 'address',
					name: 'user',
					type: 'address',
				},
			],
			name: 'inviteSignUser',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{
					internalType: 'string',
					name: 'document',
					type: 'string',
				},
			],
			name: 'signDocument',
			outputs: [],
			stateMutability: 'nonpayable',
			type: 'function',
		},
	];
	const ByteCode = "608060405234801561001057600080fd5b50604051610347380380610347833981810160405281019061003291906100b7565b33600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600081905550426001819055506000600260006101000a81548160ff02191690831515021790555050610101565b6000815190506100b1816100ea565b92915050565b6000602082840312156100c957600080fd5b60006100d7848285016100a2565b91505092915050565b6000819050919050565b6100f3816100e0565b81146100fe57600080fd5b50565b610237806101106000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80630a5ed1cd1461003b5780632ca151221461005d575b600080fd5b610043610067565b60405161005495949392919061015c565b60405180910390f35b6100656100bb565b005b60008060008060008054600154600260009054906101000a900460ff16600354600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16945094509450945094509091929394565b6001600260006101000a81548160ff0219169083151502179055504260038190555033600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b610129816101af565b82525050565b610138816101c1565b82525050565b610147816101cd565b82525050565b610156816101f7565b82525050565b600060a082019050610171600083018861013e565b61017e602083018761014d565b61018b604083018661012f565b610198606083018561014d565b6101a56080830184610120565b9695505050505050565b60006101ba826101d7565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600081905091905056fea2646970667358221220d86dc8512d11c536e8be7aa3950ec304af938a6f9f28e6bca1fb1d8dad1d02e764736f6c63430008040033";

	const contract_address = "0xd9145CCE52D386f254917e481eB44e9943F39138";

	const contract = new web3.eth.Contract( ABI, contract_address )
	// const encodedParameters = web3.eth.abi.encodeParameter(
	// 	'bytes32',
	// 	'0x1111111111111111111111111111111111111111111111111111111111111111',
	// ).slice(2);
	// console.log(encodedParameters)
	// const bytecodeWithEncodedParameters = '0x' + ByteCode + encodedParameters;

	// deploy contract with constructor value
	const tx = await contract.deploy( {
		data: ByteCode, arguments: [
			'0x1111111111111111111111111111111111111111111111111111111111111111' ]
	} )
	await sendSignedTransaction( contract._address, nonce,
		tx.encodeABI()
	);
	// for setter method
	let extraData = contract.methods.sign();
	let data = extraData.encodeABI()

	await sendSignedTransaction( contract._address, nonce, data );

	// for getter methods
	await getDocumentState( contract );



}

async function getDocumentState ( contract )
{
	const state = await contract.methods.getDocumentState().call();
	console.log( state )
	// contract.methods.getDocumentState()
	// 	.call(function (err, res) {
	// 		if (err) {
	// 			console.log("An error occured", err)
	// 			return
	// 		}
	// 		console.log("Hash of the transaction: " + res)
	// 	})
}

async function getAUser ( contract )
{
	contract.methods.getAUser( "0x8fDe201d23CB8e42F4111d8479758614776A8913" )
		.call( function ( err, res )
		{
			if ( err )
			{
				console.log( "An error occured", err )
				return
			}
			console.log( "Hash of the transaction: " + res )
		} )
}

async function sendSignedTransaction ( contractAddress, nonce, data )
{
	const transaction = {
		// faucet address to return eth
		'to': contractAddress,
		// 'from': myAddress,
		// 'value': 1000000000000000000, // 1 ETH
		'gas': 100000,
		'nonce': nonce,
		'data': data
		// optional data field to send message or execute smart contract
	};


	const signedTx = await web3.eth.accounts.signTransaction( transaction, PRIVATE_KEY );

	web3.eth.sendSignedTransaction( signedTx.rawTransaction, function ( error, hash )
	{
		if ( !error )
		{
			console.log( "🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!" );
		} else
		{
			console.log( "❗Something went wrong while submitting your transaction:", error )
		}
	} ).catch( ( error ) => { console.log( " " + error ) } );


}

async function getBlockNumber ()
{
	const latestBlockNumber = await web3.eth.getBlockNumber()
	return latestBlockNumber
}

async function getNonce ( myAddress )
{
	return await web3.eth.getTransactionCount( myAddress, 'latest' )
}

main();
