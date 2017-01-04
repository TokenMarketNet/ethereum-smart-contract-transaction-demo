import Wallet from "ethers-wallet";


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
export function buildTx(contractAddress, privateKey, nonce, functionSignature, functionParameters, value, gasLimit, gasPrice) {

    let wallet = new Wallet(privateKey);

    if(!gasLimit) {
        gasLimit = "0x300000";
    }

    if(!value) {
        value = 0;
    }

    if(!gasPrice) {
        // Ropsten testnet 2017-01
        gasPrice = "20000000000";
    }

    // Sign transactions
    tx = wallet.sign({
        none: nonce,
        to: contractAddress,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        value: value
    });

}