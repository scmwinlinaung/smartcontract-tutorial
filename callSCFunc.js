require('dotenv').config();
const { API_URL, PRIVATE_KEY } = process.env;
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider(API_URL)
const web3 = new Web3(provider)

async function main() {
	require('dotenv').config();
	const { API_URL, PRIVATE_KEY } = process.env;
	const Web3 = require('web3')
	const provider = new Web3.providers.HttpProvider(API_URL)
	const web3 = new Web3(provider)

	// const web3 = createAlchemyWeb3(API_URL);
	const myAddress = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57' //TODO: replace this address with your own public address

	const nonce = await getNonce(myAddress); // nonce starts counting from 0
	console.log(nonce)
	const ABI = [
		{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "bytes32",
					"name": "documentHash",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"internalType": "bytes32",
					"name": "prefixedProof",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"internalType": "address",
					"name": "recovered",
					"type": "address"
				}
			],
			"name": "LogSignature",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "userAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "uint8",
					"name": "age",
					"type": "uint8"
				}
			],
			"name": "NewUser",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "userAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "value",
					"type": "uint256"
				}
			],
			"name": "NewValue",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "index",
					"type": "address"
				}
			],
			"name": "getAUser",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "name",
							"type": "string"
						},
						{
							"internalType": "uint8",
							"name": "age",
							"type": "uint8"
						},
						{
							"internalType": "bool",
							"name": "registered",
							"type": "bool"
						}
					],
					"internalType": "struct User.User",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_addr",
					"type": "address"
				},
				{
					"internalType": "bytes32",
					"name": "msgHash",
					"type": "bytes32"
				},
				{
					"internalType": "uint8",
					"name": "v",
					"type": "uint8"
				},
				{
					"internalType": "bytes32",
					"name": "r",
					"type": "bytes32"
				},
				{
					"internalType": "bytes32",
					"name": "s",
					"type": "bytes32"
				}
			],
			"name": "isSigned",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "uint8",
					"name": "_age",
					"type": "uint8"
				}
			],
			"name": "registerUser",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "users",
			"outputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "uint8",
					"name": "age",
					"type": "uint8"
				},
				{
					"internalType": "bool",
					"name": "registered",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "documentHash",
					"type": "bytes32"
				},
				{
					"internalType": "uint8",
					"name": "v",
					"type": "uint8"
				},
				{
					"internalType": "bytes32",
					"name": "r",
					"type": "bytes32"
				},
				{
					"internalType": "bytes32",
					"name": "s",
					"type": "bytes32"
				}
			],
			"name": "verify",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	];

	const contract_address = "0xb3756BAf00a7e62eE5a18a32Ea39Db2AF5ede7fE";

	const contract = new web3.eth.Contract(ABI, contract_address)

	// for setter method

	let extraData = contract.methods.registerUser("0x8fDe201d23CB8e42F4111d8479758614776A8913",
		"SOE GYI", web3.utils.numberToHex(21));
	let data = extraData.encodeABI()
	console.log(data)
	const transaction = {
		// faucet address to return eth
		'to': contract._address,
		// 'from': myAddress,
		// 'value': 1000000000000000000, // 1 ETH
		'gas': 60000,
		'nonce': nonce,
		'data': data
		// optional data field to send message or execute smart contract
	};

	const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

	web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
		if (!error) {
			console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
		} else {
			console.log("❗Something went wrong while submitting your transaction:", error)
		}
	}).catch((error) => { console.log("HEHE " + error) });


	// for getter methods

	contract.methods.getAUser("0x8fDe201d23CB8e42F4111d8479758614776A8913")
		.call(function (err, res) {
			if (err) {
				console.log("An error occured", err)
				return
			}
			console.log("Hash of the transaction: " + res)
		})


}

async function getBlockNumber() {
	const latestBlockNumber = await web3.eth.getBlockNumber()
	console.log(latestBlockNumber)
	return latestBlockNumber
}

async function getNonce(myAddress) {
	return await web3.eth.getTransactionCount(myAddress, 'latest')
}

main();
