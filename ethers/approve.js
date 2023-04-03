const { ethers } = require("ethers");

const { root } = require("../config");
const { checkBalance, checkAllowance } = require("./balance");
const { getRootERC20 } = require("./erc20");


async function approve(erc20, amount) {
    const wei = ethers.utils.parseEther(amount.toString())
    console.log(`approving ${wei} amount to ERC20Predicate`)

    let tx = await erc20.approve(root.erc20Predicate, wei);
    console.log(`approve transaction hash is ${tx.hash}`)
    let txReceipt = await tx.wait()
    console.log(`transaction confirmed with status ${txReceipt.status}`)
}

const execute = async () => {
    const erc20 = getRootERC20()
    await checkBalance(erc20)
    await checkAllowance(erc20)
    const amount = process.argv[2]
    if (amount == undefined) {
        return Promise.reject(new Error("approve amount not set"))
    }
    await approve(erc20, amount)
    await checkAllowance(erc20)
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}