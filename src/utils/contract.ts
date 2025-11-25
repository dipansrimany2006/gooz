import { ethers } from 'ethers';
import { prepareContractCall, sendTransaction, readContract } from 'thirdweb';
import { defineChain, getContract } from 'thirdweb';
import { createThirdwebClient } from 'thirdweb';

// Contract Configuration - Celo Mainnet
export const CONTRACT_ADDRESS = '0x2A9caFEDFc91d55E00B6d1514E39BeB940832b5D';

// Celo Mainnet Chain Definition
export const celoMainnet = defineChain({
  id: 42220,
  name: 'Celo Mainnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpc: 'https://forno.celo.org',
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
 * @returns Entry fee in wei (0.01 CELO)
 */
export async function getEntryFee(): Promise<bigint> {
  try {
    const client = getClient();

    const contract = getContract({
      client,
      chain: celoMainnet,
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
    // Verify user is on Celo Mainnet
    if (account.chain?.id && account.chain.id !== celoMainnet.id) {
      throw new Error(
        `Wrong network! Please switch to Celo Mainnet (Chain ID: ${celoMainnet.id})`
      );
    }

    const client = getClient();

    // Get contract instance
    const contract = getContract({
      client,
      chain: celoMainnet,
      address: CONTRACT_ADDRESS,
    });

    // Get entry fee from contract
    const entryFee = await getEntryFee();
    const entryFeeInCELO = ethers.formatEther(entryFee);

    // Convert gameId to bytes32
    const gameIdBytes32 = gameIdToBytes32(gameId);

    console.log('🎮 Depositing to game:', gameId);
    console.log('📝 GameId (bytes32):', gameIdBytes32);
    console.log('💰 Entry fee:', entryFeeInCELO, 'CELO');
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
      chain: celoMainnet,
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
      chain: celoMainnet,
      address: CONTRACT_ADDRESS,
    });

    const gameIdBytes32 = gameIdToBytes32(gameId);

    const result = await readContract({
      contract,
      method: 'function getGameDetails(bytes32 _gameId) external view returns (address[] memory players, uint256 poolAmount, bool isCompleted, bool isCancelled)',
      params: [gameIdBytes32 as `0x${string}`],
    });

    return {
      players: Array.from(result[0]) as string[],
      poolAmount: result[1] as bigint,
      isCompleted: result[2] as boolean,
      isCancelled: result[3] as boolean,
    };
  } catch (error) {
    console.error('Error getting game details:', error);
    return null;
  }
}
