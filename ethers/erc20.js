const { ethers } = require("ethers");

const { root, child } = require("../config");
const { getRootSigner, getChildSigner } = require("./provider");


function getRootERC20() {
    const abi = [
        "function symbol() view returns (string memory)",
        "function balanceOf(address account) view returns (uint256)",
        "function allowance(address owner, address spender) view returns (uint256)",

        "function approve(address spender, uint256 amount) returns (bool)",
    ]
    const signer = getRootSigner()
    const erc20 = new ethers.Contract(root.erc20, abi, signer);
    return erc20;
}

function getChildERC20() {
    const abi = [
        "function symbol() view returns (string memory)",
        "function balanceOf(address account) view returns (uint256)",

        "function withdraw(uint256 amount) external",
    ]
    const signer = getChildSigner()
    const erc20 = new ethers.Contract(child.erc20, abi, signer);
    return erc20;
}

module.exports = {
    getRootERC20,
    getChildERC20,
}