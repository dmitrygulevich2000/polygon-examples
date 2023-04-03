const { setProofApi, RootChain, ExitUtil } = require("@maticnetwork/maticjs")

const { getMaticClient } = require("./client");

const { root, proofApi } = require("../config");


setProofApi(proofApi);

async function buildExitPayload(client, txHash) {
    return await client.exitUtil.buildPayloadForExit(txHash, root.logEventSignature.erc20Transfer, true)
}

const execute = async () => {
    const client = await getMaticClient()

    const txHash = process.argv[2]
    if (txHash == undefined) {
        return Promise.reject(new Error("widthraw txHash not set"))
    }

    const payload = await buildExitPayload(client, txHash)
    console.log(`exit payload is\n${payload}`);
}

module.exports = {
    buildExitPayload,
}

if (require.main === module) {
    execute().then(_ => {
        process.exit(0)
    }).catch(err => {
        console.error("error", err);
        process.exit(0);
    })
}