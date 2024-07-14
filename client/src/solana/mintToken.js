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
} = require("@metaplex-foundation/umi");
const { base58 } = require("@metaplex-foundation/umi/serializers");

const wallet = require("../wallet.json");

const umi = createUmi("https://api.devnet.solana.com", "finalized");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner)).use(mplTokenMetadata());

const name = "DelegateX delegation";
const mint = generateSigner(umi);
const sellerFeeBasisPoints = percentAmount(5, 2);

export default async (uri) => {
  let tx = createNft(umi, {
    mint,
    name,
    uri,
    sellerFeeBasisPoints,
  });

  let result = await tx.sendAndConfirm(umi);
  const signature = base58.deserialize(result.signature);
  console.log(signature);
  return signature;
};
