const { ethers } = require("ethers");

const { root } = require("../config");
const { getRootERC20, getChildERC20 } = require("./erc20");


async function checkBalance(erc20, network = "root") {
    const symb = await erc20.symbol()
    const bal = await erc20.balanceOf(erc20.signer.address)
    console.log(`${network} balance of ${symb} is ${ethers.utils.formatEther(bal)}`)
}

async function checkAllowance(erc20) {
    const allow = await erc20.allowance(erc20.signer.address, root.erc20Predicate)
    console.log(`allowance to ERC20Predicate is ${ethers.utils.formatEther(allow)}`)
}

module.exports = {
    checkBalance,
    checkAllowance,
}

const execute = async () => {
    const rootErc20 = getRootERC20()
    await checkBalance(rootErc20, "root")
    await checkAllowance(rootErc20)

    const childErc20 = getChildERC20()
    await checkBalance(childErc20, "child")
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}
