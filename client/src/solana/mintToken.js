const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const {
  createNft,
  mplTokenMetadata,
} = require("@metaplex-foundation/mpl-token-metadata");
const {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
  publicKey,
} = require("@metaplex-foundation/umi");
const { createAssociatedToken } = require("@metaplex-foundation/mpl-toolbox");
const bs58 = require("bs58");

const umi = createUmi("https://api.devnet.solana.com");

const name = "DelegateX delegation";
const sellerFeeBasisPoints = percentAmount(5, 2);

async function mintToken(uri, recipientPrivateKeyString) {
  const mint = generateSigner(umi);

  // Convert the comma-separated string to an array of numbers
  const recipientPrivateKeyArray = recipientPrivateKeyString
    .split(",")
    .map(Number);

  // Create recipient's keypair from the array of numbers
  const recipientKeypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(recipientPrivateKeyArray)
  );
  const recipientPublicKey = publicKey(recipientKeypair.publicKey);

  const myKeypairSigner = createSignerFromKeypair(umi, recipientKeypair);
  umi.use(signerIdentity(myKeypairSigner)).use(mplTokenMetadata());

  // Create the NFT
  let tx = createNft(umi, {
    mint,
    name,
    uri,
    sellerFeeBasisPoints,
    tokenOwner: recipientPublicKey, // Set the token owner to the recipient
  });

  // Send and confirm the transaction
  let result = await tx.sendAndConfirm(umi);
  const nftSignature = result.signature;
  console.log("NFT created and sent. Signature:", bs58.encode(nftSignature));

  return bs58.encode(nftSignature);
}

module.exports = mintToken;
