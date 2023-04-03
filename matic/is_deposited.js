const { getMaticClient } = require("./client");


const execute = async () => {
    const client = await getMaticClient()

    const txHash = process.argv[2]
    if (txHash == undefined) {
        return Promise.reject(new Error("txHash not set"))
    }

    const deposited = await client.isDeposited(txHash)
    console.log(`tx ${txHash} is deposited: ${deposited}`);
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}