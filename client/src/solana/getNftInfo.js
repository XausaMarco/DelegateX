const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const {
  fetchDigitalAsset,
} = require("@metaplex-foundation/mpl-token-metadata");
const { publicKey } = require("@metaplex-foundation/umi");
const bs58 = require("bs58");

async function getNftInfo(nftSignature) {
  // Initialize Umi
  const umi = createUmi("https://api.devnet.solana.com");

  try {
    // Fetch the transaction
    const transaction = await umi.rpc.getTransaction(
      publicKey(bs58.decode(nftSignature))
    );

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Find the mint address from the transaction
    const mintAddress = transaction.transaction.message.accounts[0];

    // Fetch the digital asset (NFT) data
    const nftData = await fetchDigitalAsset(umi, mintAddress);

    // Extract relevant information
    const nftInfo = {
      mintAddress: nftData.mint.publicKey,
      name: nftData.metadata.name,
      symbol: nftData.metadata.symbol,
      uri: nftData.metadata.uri,
      sellerFeeBasisPoints: nftData.metadata.sellerFeeBasisPoints,
      primarySaleHappened: nftData.metadata.primarySaleHappened,
      isMutable: nftData.metadata.isMutable,
      editionNonce: nftData.metadata.editionNonce,
      tokenStandard: nftData.metadata.tokenStandard,
      collection: nftData.metadata.collection,
      uses: nftData.metadata.uses,
      creators: nftData.metadata.creators,
    };

    return nftInfo;
  } catch (error) {
    console.error("Error fetching NFT info:", error);
    throw error;
  }
}

// Example usage
// getNftInfo("your_nft_signature_here")
//   .then(nftInfo => console.log(nftInfo))
//   .catch(error => console.error(error));

module.exports = getNftInfo;
