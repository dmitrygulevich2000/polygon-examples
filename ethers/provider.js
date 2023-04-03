const { ethers } = require("ethers");

const { root, child, user } = require("../config")


function getRootSigner() {
    const provider = new ethers.providers.EtherscanProvider("goerli", user.provider.etherscan)
    const signer = new ethers.Wallet(user.privateKey, provider)
    return signer
}

function getChildSigner() {
    const provider = new ethers.providers.JsonRpcProvider(child.rpc)
    const signer = new ethers.Wallet(user.privateKey, provider)
    return signer
}

module.exports = {
    getRootSigner,
    getChildSigner,
}

const execute = async () => {
    const rootSigner = getRootSigner()
    console.log(`root signer with address ${rootSigner.address}`)
    var balance = await rootSigner.getBalance()
    console.log(`root balance is ${ethers.utils.formatEther(balance)}`)

    const childSigner = getChildSigner()
    console.log(`child signer with address ${childSigner.address}`)
    balance = await childSigner.getBalance()
    console.log(`child balance is ${ethers.utils.formatEther(balance)}`)
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}

