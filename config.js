module.exports = {
    // to obtain contract addresses see https://wiki.polygon.technology/docs/category/network-details
    root: {
        erc20: "0x655F2166b0709cd575202630952D71E2bB0d61Af",
        erc20Predicate: "0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34",
        chainManager: "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74",
        chain: "0x2890bA17EfE978480615e330ecB65333b880928e",
        logEventSignature: {
            // used for exit by https://github.com/maticnetwork/matic.js/blob/master/src/pos/erc20.ts#L141
            // https://github.com/maticnetwork/matic.js/blob/master/src/enums/log_event_signature.ts
            erc20Transfer: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        },
    },
    child: {
        rpc: process.env.MATIC_RPC,
        erc20: "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
        chainManager: "0xb5505a6d998549090530911180f38aC5130101c6",
    },
    user: {
        privateKey: process.env.USER_KEY,
        address: process.env.USER_ADDRESS,
        provider: {
            etherscan: process.env.ETHERSCAN_API_KEY
        }
    },
    // https://wiki.polygon.technology/docs/develop/ethereum-polygon/matic-js/set-proof-api
    proofApi: process.env.PROOF_API || "https://apis.matic.network/"
}

if (require.main === module) {
    console.log(module.exports)
}