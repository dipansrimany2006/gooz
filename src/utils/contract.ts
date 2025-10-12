import { ethers } from 'ethers';
import { prepareContractCall, sendTransaction, readContract } from 'thirdweb';
import { defineChain, getContract } from 'thirdweb';
import { createThirdwebClient } from 'thirdweb';

// Contract Configuration
export const CONTRACT_ADDRESS = '0x39cECF23772596579276303a850cd641c3f152bA';

// U2U Nebulas Testnet Chain Definition
export const u2uTestnet = defineChain({
  id: 2484, // U2U Nebulas Testnet chain ID
  name: 'U2U Nebulas Testnet',
  nativeCurrency: {
    name: 'U2U',
    symbol: 'U2U',
    decimals: 18,
  },
  rpc: 'https://rpc-nebulas-testnet.u2u.xyz',
  blockExplorers: [
    {
      name: 'U2U Explorer',
      url: 'https://testnet.u2uscan.xyz',
    },
  ],
  testnet: true,
});

// Initialize Thirdweb client
const getClient = () => {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set');
  }
  return createThirdwebClient({ clientId });
};

/**
 * Convert string gameId to bytes32 for contract interaction
 */
export function gameIdToBytes32(gameId: string): string {
  return ethers.id(gameId);
}

/**
 * Get the entry fee from the contract
 * @returns Entry fee in wei
 */
export async function getEntryFee(): Promise<bigint> {
  try {
    const client = getClient();

    const contract = getContract({
      client,
      chain: u2uTestnet,
      address: CONTRACT_ADDRESS,
    });

    const result = await readContract({
      contract,
      method: 'function ENTRY_FEE() external view returns (uint256)',
      params: [],
    });

    return result as bigint;
  } catch (error) {
    console.error('Error getting entry fee:', error);
    throw error;
  }
}

/**
 * Deposit entry fee to join a game
 * @param gameId - The game ID (will be converted to bytes32)
 * @param account - The connected wallet account
 * @returns Transaction result
 */
export async function depositToGame(gameId: string, account: any) {
  try {
    // Verify user is on U2U Testnet
    if (account.chain?.id && account.chain.id !== u2uTestnet.id) {
      throw new Error(
        `Wrong network! Please switch to U2U Nebulas Testnet (Chain ID: ${u2uTestnet.id})`
      );
    }

    const client = getClient();

    // Get contract instance
    const contract = getContract({
      client,
      chain: u2uTestnet,
      address: CONTRACT_ADDRESS,
    });

    // Get entry fee from contract
    const entryFee = await getEntryFee();
    const entryFeeInU2U = ethers.formatEther(entryFee);

    // Convert gameId to bytes32
    const gameIdBytes32 = gameIdToBytes32(gameId);

    console.log('🎮 Depositing to game:', gameId);
    console.log('📝 GameId (bytes32):', gameIdBytes32);
    console.log('💰 Entry fee:', entryFeeInU2U, 'U2U');
    console.log('💰 Entry fee (wei):', entryFee.toString());
    console.log('🌐 Network:', account.chain?.name || 'Unknown', `(Chain ID: ${account.chain?.id || 'N/A'})`);

    // Prepare the contract call
    const transaction = prepareContractCall({
      contract,
      method: 'function playerDeposit(bytes32 _gameId) external payable',
      params: [gameIdBytes32 as `0x${string}`],
      value: entryFee,
    });

    // Send the transaction
    const receipt = await sendTransaction({
      transaction,
      account,
    });

    console.log('✅ Deposit successful!');
    console.log('📝 Transaction hash:', receipt.transactionHash);

    return {
      success: true,
      transactionHash: receipt.transactionHash,
    };
  } catch (error: any) {
    console.error('❌ Deposit failed:', error);
    throw new Error(error.message || 'Deposit transaction failed');
  }
}

/**
 * Check if a player has already deposited for a game
 * @param gameId - The game ID
 * @param playerAddress - The player's wallet address
 * @returns true if player has deposited
 */
export async function hasPlayerDeposited(
  gameId: string,
  playerAddress: string
): Promise<boolean> {
  try {
    const client = getClient();

    const contract = getContract({
      client,
      chain: u2uTestnet,
      address: CONTRACT_ADDRESS,
    });

    const gameIdBytes32 = gameIdToBytes32(gameId);

    // Call the view function
    const result = await readContract({
      contract,
      method: 'function hasPlayerDeposited(bytes32 _gameId, address _player) external view returns (bool)',
      params: [gameIdBytes32 as `0x${string}`, playerAddress as `0x${string}`],
    });

    return result as boolean;
  } catch (error) {
    console.error('Error checking deposit status:', error);
    return false;
  }
}

/**
 * Get game details from contract
 * @param gameId - The game ID
 * @returns Game details
 */
export async function getGameDetails(gameId: string) {
  try {
    const client = getClient();

    const contract = getContract({
      client,
      chain: u2uTestnet,
      address: CONTRACT_ADDRESS,
    });

    const gameIdBytes32 = gameIdToBytes32(gameId);

    const result = await readContract({
      contract,
      method: 'function getGameDetails(bytes32 _gameId) external view returns (address[4] memory players, uint256 poolAmount, bool isCompleted, bool hasTransferred)',
      params: [gameIdBytes32 as `0x${string}`],
    });

    return {
      players: Array.from(result[0]) as string[],
      poolAmount: result[1] as bigint,
      isCompleted: result[2] as boolean,
      hasTransferred: result[3] as boolean,
    };
  } catch (error) {
    console.error('Error getting game details:', error);
    return null;
  }
}
