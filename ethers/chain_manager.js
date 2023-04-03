const { ethers } = require("ethers");

const { root, child } = require("../config");
const { getRootSigner } = require("./provider");


function getRootChainManager() {
    const abi = [
        "function stateSenderAddress() external view returns (address)",

        "function depositEtherFor(address user) external payable",
        "function depositFor(address user, address rootToken, bytes calldata depositData) external",
        "function exit(bytes calldata inputData) external",
    ]
    const signer = getRootSigner()
    const chainManager = new ethers.Contract(root.chainManager, abi, signer);
    return chainManager;
}

module.exports = {
    getRootChainManager,
}