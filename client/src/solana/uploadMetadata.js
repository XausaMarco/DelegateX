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

export default async (attributes) => {
    const metadata = {
      name: "DelegateX Delegation",
      symbol: "DGX",
      description: "DelegateX delegation token",
      image: "",
      attributes: [
          {
              trait_type: "Author",
              value: "DelegateX"
          }
          ...attributes
      ],
      proprieties: {
          files: [
              {
                  type: "image/jpeg",
                  uri: "https://arweave.net/9AXtb2s4JBRoQ_y95OUwUTp5rKCMs4w1IYbPhoJOypg"
              }
          ]
      }
  }

  const nftUri = await umi.uploader.uploadJson(metadata);
  console.log("Your Uri:", nftUri);
  return nftUri;
};


//attributes mus have the form
/**
 * {
 *      trait_type:"",
 *      value:""
 * }
 */