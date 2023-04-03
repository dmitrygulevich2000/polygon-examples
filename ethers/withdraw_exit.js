const { ethers } = require("ethers");

const { getRootChainManager } = require("./chain_manager");
const { getRootERC20 } = require("./erc20");
const { checkBalance } = require("./balance");

const { buildExitPayload } = require("../matic/exit_payload");
const { getMaticClient } = require("../matic/client");


async function withdrawExit(rootChainManager, burnTxHash) {
    const maticClient = await getMaticClient()
    const payload = buildExitPayload(maticClient, burnTxHash)

    let tx = await rootChainManager.exit(payload);
    console.log(`exit transaction hash is ${tx.hash}`)
    let txReceipt = await tx.wait()
    console.log(`transaction confirmed with status ${txReceipt.status}`)
    return tx.hash
}

module.exports = {
    withdrawExit,
}

const execute = async () => {
    const rootErc20 = getRootERC20()
    await checkBalance(rootErc20, "root")

    const chainManager = getRootChainManager()
    const burnTx = process.argv[2]
    if (burnTx == undefined) {
        return Promise.reject(new Error("burn txHash not set"))
    }

    await withdrawExit(chainManager, burnTx)
    await checkBalance(rootErc20, "root")
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}