const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const {
  createSignerFromKeypair,
  signerIdentity,
} = require("@metaplex-foundation/umi");
const { irysUploader } = require("@metaplex-foundation/umi-uploader-irys");
const wallet = require("../../wallet.json");

const umi = createUmi("https://api.devnet.solana.com", "finalized");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());

async function createMetadata(attributes) {
  const metadata = {
    name: "DelegateX Delegation",
    symbol: "DGX",
    description: "DelegateX delegation token",
    image: "",
    attributes: [
      {
        trait_type: "Author",
        value: "DelegateX",
      },
      ...attributes,
    ],
  };

  const nftUri = await umi.uploader.uploadJson(metadata);
  console.log("Your Uri:", nftUri);
  return nftUri;
}

module.exports = createMetadata;
