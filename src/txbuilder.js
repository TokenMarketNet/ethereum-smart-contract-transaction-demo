import Wallet from "ethers-wallet";
import {simpleEncode} from "ethereumjs-abi";

/**
 * Get an Ethereum public address from a private key.
 *
 * @param privateKey Private key as 32 bytes hexadecimal string starting 0x
 *
 * @return 0x hexadecimal address or null if the private key is invalid.
 */
export function getAddressFromPrivateKey(privateKey) {
    try {
        let wallet = new Wallet(privateKey);
        return wallet.address;
    } catch(e) {
        console.error(e);
        return null;
    }
}

/**
 * Calculate the nonce for the next outbound transaction from the address.
 *
 * @param txCount How many tx the address has sent
 * @param testnetOffset 0x100000 for Ropsten, http://ethereum.stackexchange.com/questions/3215/testnet-first-transaction-nonce
 * @param internalOffset Always increase +1 when sends a tx
 */
export function calculateNonce(txCount, testnetOffset, internalOffset) {
    return txCount + testnetOffset+ internalOffset;
}

/**
 * Build a raw transaction calling a contract function.
 *
 * @param contractAddress Contracts's address as hexadecimal string
 * @param privateKey Private key as 0x prefixed hexadecimal
 * @param nonce Must be incremented by 1 for each transaction
 * @param functionSignature E.g. setValue(uint)
 * @param functionParameters E.g. 2000
 * @param value as hexadecimal string of wei (optional)
 * @param gasLimit as a stringed number (optional)
 * @param gasPrice as a stringed number (optional)
 */
export function buildTx({contractAddress, privateKey, nonce, functionSignature, functionParameters, value, gasLimit, gasPrice}) {

    let wallet = new Wallet(privateKey);

    if(!gasLimit) {
        gasLimit = "0x300000";
    }

    if(!value) {
        value = "0x0";
    }

    if(!gasPrice) {
        // Ropsten testnet 2017-01
        gasPrice = "0x4a817c800"; // 20000000000
    }

    if(nonce === undefined) {
        throw new Error("Cannot send a transaction without a nonce.")
    }

    // Construct function call data payload using ethereumjs-abi
    // https://github.com/ethereumjs/ethereumjs-abi
    const params = functionParameters.split(",").filter((x) => x.trim());
    const signatureArgs = [functionSignature].concat(params);
    const encoded = "0x" + simpleEncode.apply(this, signatureArgs).toString("hex");

    const txData = {
        nonce: nonce,
        to: contractAddress,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        value: value,
        data: encoded,
    };

    console.log("Transaction data", txData);

    // Sign transactions
    let tx = wallet.sign(txData);

    return tx;
}