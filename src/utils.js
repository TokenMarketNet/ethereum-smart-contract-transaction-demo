import Wallet from "ethers-wallet";

// http://stackoverflow.com/a/901144/315168
export function getQueryParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Get an Etheruem public address
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
        return null;
    }
}

export function buildTx(functionSignature, functionParameters) {

}