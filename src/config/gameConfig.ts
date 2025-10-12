// Game Configuration
export const GAME_CONFIG = {
  // Game Session Settings (Update these based on your current game)
  GAME_ID: '00BF80D3', // Current game ID from server response

  // Player Settings (Modify these for testing different players)
  PLAYER_ID: 'player123',
  PLAYER_NAME: 'John Doe',
  PLAYER_COLOR: '#FF0000',

  // Game Settings
  AUTO_CREATE_GAME: false, // Set to true to create new game, false to join existing
  AUTO_JOIN_EXISTING: true, // Set to true to join the existing game ID above

  // Debug Settings
  ENABLE_CONSOLE_LOGS: true,
  SHOW_CONNECTION_STATUS: true,
} as const;

// Helper function to update game config at runtime
export const updateGameConfig = (updates: Partial<typeof GAME_CONFIG>) => {
  Object.assign(GAME_CONFIG, updates);
};

// Different player configurations for testing
export const PLAYER_CONFIGS = {
  PLAYER_1: {
    PLAYER_ID: 'player123',
    PLAYER_NAME: 'John Doe',
    PLAYER_COLOR: '#FF0000'
  },
  PLAYER_2: {
    PLAYER_ID: 'player456',
    PLAYER_NAME: 'Jane Smith',
    PLAYER_COLOR: '#00FF00'
  },
  PLAYER_3: {
    PLAYER_ID: 'player789',
    PLAYER_NAME: 'Bob Wilson',
    PLAYER_COLOR: '#0000FF'
  },
  PLAYER_4: {
    PLAYER_ID: 'player101',
    PLAYER_NAME: 'Alice Brown',
    PLAYER_COLOR: '#FFFF00'
  }
} as const;

// Position mapping from server to frontend (1:1 mapping, both have 14 positions 0-13)
export const POSITION_MAPPING = {
  // Server position -> Frontend position (identical)
  0: 0,   // GO
  1: 1,   // Mediterranean Avenue
  2: 2,   // Baltic Avenue
  3: 3,   // Oriental Avenue
  4: 4,   // Rest House
  5: 5,   // Vermont Avenue
  6: 6,   // Virginia Avenue
  7: 7,   // Jail
  8: 8,   // St. James Place
  9: 9,   // Tennessee Avenue
  10: 10, // New York Avenue
  11: 11, // Party House
  12: 12, // Kentucky Avenue
  13: 13, // Marvin Gardens
} as const;