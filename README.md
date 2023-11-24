# Pyth-oracle-demo
A smaple repo that shows how to use the Pyth oracle in your Dapp


In pyth-contracts, there is a contract called Demo, that has a simple function shows you how to use the Pyth oracle. You can deploy it on your own, or use my deployment `0x510Cdc2B4b1e52e1d27E954AE03b205A368Fa44D` (polygon mumbai).

The pyth-script folder has a script that will interact with the contract and the pyth oracle on mumbai. You will have to put the private key of your account and your own rpc provider to run it.

The steps to run the script are
```
yarn i
yarn pyth-demo
```