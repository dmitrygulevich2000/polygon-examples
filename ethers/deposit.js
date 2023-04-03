const { ethers } = require("ethers");

const { user, root } = require("../config");
const { getRootChainManager } = require("./chain_manager");
const { getChildERC20 } = require("./erc20");
const { checkBalance } = require("./balance");


async function depositERC20Start(rootChainManager, amount) {
    const wei = ethers.utils.parseEther(amount.toString())
    console.log(`depositing ${wei} amount`)

    const abi = ethers.utils.defaultAbiCoder
    const depositData = abi.encode(["uint256"], [wei])
    console.log(`depositData encoded is ${depositData}`)

    let tx = await rootChainManager.depositFor(user.address, root.erc20, depositData);
    console.log(`depositFor transaction hash is ${tx.hash}`)
    let txReceipt = await tx.wait()
    console.log(`transaction confirmed with status ${txReceipt.status}`)
    return tx.hash
}

async function depositERC20(rootChainManager, amount) {
    const childERC20 = getChildERC20()
    const old_bal = await childERC20.balanceOf(user.address)
    await checkBalance(childERC20, "child")

    await depositERC20Start(rootChainManager, amount)

    for (let i = 0; i < 2000; ++i) {
        process.stdout.write(`${i}: `)
        const bal = await childERC20.balanceOf(user.address)
        if (!bal.eq(old_bal)) {
            console.log("Yeah! deposit completed")
            return
        }
        await new Promise(r => setTimeout(r, 1000 * 60));  // sleep
    }
}

const execute = async () => {
    const chainManager = getRootChainManager()
    const amount = process.argv[2]
    if (amount == undefined) {
        return Promise.reject(new Error("deposit amount not set"))
    }
    await depositERC20Start(chainManager, amount)
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}