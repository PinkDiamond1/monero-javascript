# Monero JavaScript API

## Introduction

This project provides a modern JavaScript API for a Monero wallet and daemon.

The API currently relies on running instances of [Monero Wallet RPC](https://getmonero.org/resources/developer-guides/wallet-rpc.html) and [Monero Daemon RPC](https://getmonero.org/resources/developer-guides/daemon-rpc.html).

## Code Samples

See [tests](tests) for the most complete examples of using this library.

### Wallet Sample

```js
// create a wallet that uses a monero-wallet-rpc endpoint
let wallet = new MoneroWalletRpc({uri: "http://localhost:38083", user: "rpc_user", pass: "abc123"});

// get primary address and balance of wallet
let balance = await wallet.getBalance();               // e.g. 533648366742 (BigInteger)
let primaryAddress = await wallet.getPrimaryAddress(); // e.g. 59aZULsUF3YNSKGiHz4JPMfjGYkm1S4TB3sPsTr3j85HhXb9crZqGa7jJ8cA87U48kT5wzi2VzGZnN2PKojEwoyaHqtpeZh

// get address and balance of subaddress [1, 0]
let subaddress = await wallet.getSubaddress(1, 0);
let subaddressBalance = subaddress.getBalance();
let subaddressAddress = subaddress.getAddress();

// send a payment
let sentTx = await wallet.send("74oAtjgE2dfD1bJBo4DWW3E6qXCAwUDMgNqUurnX9b2xUvDTwMwExiXDkZskg7Vct37tRGjzHRqL4gH4H3oag3YyMYJzrNp", new BigInteger(50000));

// send 1/10th the balance to multiple destinations from subaddress 0, 1 which can be split into multiple transactions
let payments = [];
payments.push(new MoneroPayment("7BV7iyk9T6kfs7cPfmn7vPZPyWRid7WEwecBkkVr8fpw9MmUgXTPtvMKXuuzqKyr2BegWMhEcGGEt5vNkmJEtgnRFUAvf29", new BigInteger(50000)));
payments.push(new MoneroPayment("78NWrWGgyZeYgckJhuxmtDMqo8Kzq5r9j1kV8BQXGq5CDnECz2KjQeBDc3KKvdMQmR6TWtfbRaedgbSGmmwr1g8N1rBMdvW", new BigInteger(50000)));
let sendConfig = new MoneroSendConfig();
sendConfig.setPayments(payments);
sendConfig.setAccountIndex(0);
sendConfig.setSubaddressIndices([1]);
let sentTxs = await wallet.sendSplit(sendConfig);

// get wallet transactions without filtering
for (let tx of await wallet.getTxs()) {
  let txId = tx.getId();                 // e.g. f8b2f0baa80bf6b686ce32f99ff7bb15a0f198baf7aed478e933ee9a73c69f80
  let txFee = tx.getFee();               // e.g. 752343011023 (BigInteger)
  let isConfirmed = tx.getIsConfirmed(); // e.g. false
}
```

### Daemon Sample

```js
// create a daemon that uses a monero-daemon-rpc endpoint
let daemon = new MoneroDaemonRpc({uri: "http://localhost:38081"});

// get daemon info
let height = await daemon.getHeight();           // e.g. 1523651
let feeEstimate = await daemon.getFeeEstimate(); // e.g. 75000 (BigInteger)

// get first 100 blocks as a binary request
let blocks = await daemon.getBlocksByRange(0, 100);

// get block info
for (let block of blocks) {
  let blockHeight = block.getHeader().getHeight();
  let blockHash = block.getHeader().getHash();
  let blockSize = block.getHeader().getBlockSize();
  let numTxs = block.getTxs().length;
}
```

## Running Tests

1. Set up running instances of [Monero Wallet RPC](https://getmonero.org/resources/developer-guides/wallet-rpc.html) and [Monero Daemon RPC](https://getmonero.org/resources/developer-guides/daemon-rpc.html).  See [Monero RPC Setup](#monero-rpc-setup).
2. `git clone --recurse-submodules https://github.com/woodser/monero-javascript.git`
3. `npm install`
4. Configure the appropriate RPC endpoints and authentication by modifying `WALLET_RPC_CONFIG` and `DAEMON_RPC_CONFIG` in [TestUtils.js](tests/TestUtils.js).
5. `npm test`

Note: some tests are failing as not all functionality is implemented.

## Monero RPC Setup

1. Download and extract the latest [Monero CLI](https://getmonero.org/downloads/) for your platform.
2. Start Monero daemon locally: `./monerod --stagenet` (or use a remote daemon).
3. Create a wallet file if one does not exist.  This is only necessary one time.
	- Create new / open existing: `./monero-wallet-cli --daemon-address http://localhost:38081 --stagenet`
	- Restore from mnemonic seed: `./monero-wallet-cli --daemon-address http://localhost:38081 --stagenet --restore-deterministic-wallet`
4. Start monero-wallet-rpc (requires --wallet-dir to run tests):
	
	e.g. For wallet name `test_wallet_1`, user `rpc_user`, password `abc123`, stagenet: `./monero-wallet-rpc --daemon-address http://localhost:38081 --stagenet --rpc-bind-port 38083 --rpc-login rpc_user:abc123 --wallet-dir /Applications/monero-v0.13.0.2`

## Interfaces and Data Models

- [Monero daemon interface (MoneroDaemon.js)](src/daemon/MoneroDaemon.js)
- [Monero daemon rpc implementation (MoneroDaemonRpc.js)](src/daemon/MoneroDaemonRpc.js)
- [Monero daemon data model (src/daemon/model)](src/daemon/model)
- [Monero wallet interface (src/wallet/MoneroWallet.js](src/wallet/MoneroWallet.js)
- [Monero wallet rpc implementation (src/wallet/MoneroWalletRpc.js)](src/wallet/MoneroWalletRpc.js)
- [Monero wallet data model (src/wallet/model)](src/wallet/model)

## Future Goals

Primary goals of this project are to implement a fully client-side JavaScript wallet (requires a node running monero-daemon-rpc) and a "light wallet" which shares the view key with a 3rd party (e.g. MyMonero) to scan the blockchain.

## License

This project is licensed under MIT.