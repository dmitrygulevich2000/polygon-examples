const { use, POSClient } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");

const { ethers } = require("ethers");

const { user, root } = require("../config");
const { getChildSigner, getRootSigner } = require("../ethers/provider")


use(Web3ClientPlugin);

async function getMaticClient() {
    const posClient = new POSClient();
    await posClient.init({
        network: 'testnet',
        version: 'mumbai',
        parent: {
            provider: getRootSigner(),
            defaultConfig: {
                from: user.address
            }
        },
        child: {
            provider: getChildSigner(),
            defaultConfig: {
                from: user.address
            }
        }
    });
    return posClient
}

module.exports = {
    getMaticClient
}

const execute = async () => {
    const client = await getMaticClient()
    const erc20 = client.erc20(root.erc20, true)
    const rootBalance = await erc20.getBalance(user.address)
    console.log(`root balance of DERC20 is ${ethers.utils.formatEther(rootBalance)}`);
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}
