import { JsonRpcProvider, Contract, Wallet } from "ethers";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";

const key = ""; // your private key

const provider = new JsonRpcProvider(
  `https://polygon-mumbai.g.alchemy.com/v2/${YOUR_API_KEY}`
);

const signer = new Wallet(key, provider);

const ABI = [
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "priceUpdateData",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "priceID",
        type: "bytes32",
      },
    ],
    name: "getBtcUsdPrice",
    outputs: [
      {
        components: [
          {
            internalType: "int64",
            name: "price",
            type: "int64",
          },
          {
            internalType: "uint64",
            name: "conf",
            type: "uint64",
          },
          {
            internalType: "int32",
            name: "expo",
            type: "int32",
          },
          {
            internalType: "uint256",
            name: "publishTime",
            type: "uint256",
          },
        ],
        internalType: "struct PythStructs.Price",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "updateData",
        type: "bytes[]",
      },
    ],
    name: "getUpdateFee",
    outputs: [
      {
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const pythAddress = "0xFC6bd9F9f0c6481c6Af3A7Eb46b296A5B85ed379"; // Polygon mumbai deployment of the pyth oracle
const address = "0x510Cdc2B4b1e52e1d27E954AE03b205A368Fa44D"; // REPLACE WITH YOUR Polygon mumbai deployment of Demo contract.

const contract = new Contract(address, ABI, signer);
const pythContract = new Contract(pythAddress, ABI, provider);
const date = new Date();
var timestamp = date.getTime();
timestamp = Math.trunc(timestamp / 1000);

const main = async () => {
  const connection = new EvmPriceServiceConnection(
    "https://hermes.pyth.network"
  ); // See Hermes endpoints section below for other endpoints

  const priceIds = [
    // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
    "0x63f341689d98a12ef60a5cff1d7f85c70a9e17bf1575f0e7c0b2512d48b1c8b3", // 1INCH/USD
  ];

  // In order to use Pyth prices in your protocol you need to submit the price update data to Pyth contract in your target
  // chain. `getPriceFeedsUpdateData` creates the update data which can be submitted to your contract. Then your contract should
  // call the Pyth Contract with this data.
  const priceUpdateData = await connection.getPriceFeedsUpdateData(priceIds);
  console.log(priceUpdateData);

  // If the user is paying the price update fee, you need to fetch it from the Pyth contract.
  // Please refer to https://docs.pyth.network/documentation/pythnet-price-feeds/on-demand#fees for more information.
  //
  // `pythContract` below is a web3.js contract; if you wish to use ethers, you need to change it accordingly.
  // You can find the Pyth interface ABI in @pythnetwork/pyth-sdk-solidity npm package.
  const updateFee = await pythContract.getUpdateFee(priceUpdateData);

  console.log(updateFee);

  const feeData = await provider.getFeeData()
  console.log(feeData)


  const res = await contract.getBtcUsdPrice(
    priceUpdateData,
    priceIds[0],
    { value: updateFee, gasPrice: feeData.gasPrice }
  );

  console.log({ res });
};

main();
