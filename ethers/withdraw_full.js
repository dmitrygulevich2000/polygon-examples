const { ethers } = require("ethers");

const { user, root } = require("../config");
const { getChildERC20, getRootERC20 } = require("./erc20");
const { checkBalance } = require("./balance");
const { getRootChainManager } = require("./chain_manager");
const { withdrawERC20Start } = require("./withdraw_start");
const { withdrawExit } = require("./withdraw_exit");

const { getMaticClient } = require("../matic/client");

async function withdrawERC20(amount) {
    const childERC20 = getChildERC20()
    const rootERC20 = getRootERC20()
    await checkBalance(childERC20, "child")
    await checkBalance(rootERC20, "root")

    const burnTx = await withdrawERC20Start(childERC20, amount)
    await checkBalance(childERC20, "child")
    await checkBalance(rootERC20, "root")

    const maticClient = await getMaticClient()
    for (let i = 0; i < 4000; ++i) {
        const checkpointed = await maticClient.isCheckPointed(burnTx)
        if (checkpointed) {
            console.log("Yeah! checkpoint arrived")
            break
        }
        await new Promise(r => setTimeout(r, 1000 * 30));  // sleep
    }

    await checkBalance(childERC20, "child")
    await checkBalance(rootERC20, "root")

    const rootChainManager = getRootChainManager()
    await withdrawExit(rootChainManager, burnTx)

    await checkBalance(childERC20, "child")
    await checkBalance(rootERC20, "root")
}

const execute = async () => {
    const amount = process.argv[2]
    if (amount == undefined) {
        return Promise.reject(new Error("withdraw amount not set"))
    }
    await withdrawERC20(amount)
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}