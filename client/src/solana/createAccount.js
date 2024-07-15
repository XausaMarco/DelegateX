const {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

// Connection to the Devnet cluster
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function createAccount() {
  // Generate a new keypair
  const recipientKeypair = Keypair.generate();

  // Request an airdrop of SOL to the new account
  await requestAirdrop(recipientKeypair.publicKey);
  console.log(recipientKeypair.secretKey);
  return recipientKeypair.secretKey.toString("base64");
}

async function requestAirdrop(publicKey) {
  try {
    // Request SOL from the faucet to fund the new account
    await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);

    console.log(`Airdrop successful for ${publicKey.toBase58()}`);
  } catch (error) {
    console.error("Error requesting airdrop:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
}

module.exports = createAccount;
