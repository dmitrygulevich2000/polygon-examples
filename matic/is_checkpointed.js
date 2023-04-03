const { getMaticClient } = require("./client");


// also may use https://apis.matic.network/api/v1/mumbai/block-included/<block-number>
const execute = async () => {
    const client = await getMaticClient()

    const txHash = process.argv[2]
    if (txHash == undefined) {
        return Promise.reject(new Error("txHash not set"))
    }

    const checkpointed = await client.isCheckPointed(txHash)
    console.log(`tx ${txHash} is checkpointed: ${checkpointed}`);
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}