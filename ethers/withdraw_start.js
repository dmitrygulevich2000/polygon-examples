const { ethers } = require("ethers");

const { getChildERC20 } = require("./erc20");
const { checkBalance } = require("./balance");


async function withdrawERC20Start(childERC20, amount) {
    const wei = ethers.utils.parseEther(amount.toString())
    console.log(`starting withdraw ${wei} amount`)

    let tx = await childERC20.withdraw(wei);
    console.log(`withdraw transaction hash is ${tx.hash}`)
    let txReceipt = await tx.wait()
    console.log(`transaction confirmed with status ${txReceipt.status}`)
    console.log(`included in block num. ${txReceipt.blockNumber}`)
    return tx.hash
}

module.exports = {
    withdrawERC20Start,
}

const execute = async () => {
    const childERC20 = getChildERC20()
    await checkBalance(childERC20, "child")

    const amount = process.argv[2]
    if (amount == undefined) {
        return Promise.reject(new Error("withdraw amount not set"))
    }

    await withdrawERC20Start(childERC20, amount)
    await checkBalance(childERC20, "child")
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}