// Card Types
export enum Suit {
  SPADES = 'SPADES',
  HEARTS = 'HEARTS',
  DIAMONDS = 'DIAMONDS',
  CLUBS = 'CLUBS',
  JOKER = 'JOKER', // Jokers don't have a traditional suit
}

export enum Rank {
  ACE = 'ACE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
  EIGHT = 'EIGHT',
  NINE = 'NINE',
  TEN = 'TEN',
  JACK = 'JACK',
  QUEEN = 'QUEEN',
  KING = 'KING',
  JOKER = 'JOKER',
}

export interface Card {
  id: string; // Unique identifier for each card instance
  suit: Suit;
  rank: Rank;
  value: number; // Point value
  isWild: boolean;
  isRedThree: boolean;
  isBlackThree: boolean;
}

// Meld Types
export enum MeldType {
  GROUP = 'GROUP', // Same rank cards
  SEQUENCE = 'SEQUENCE', // Consecutive cards of same suit
  DIRTY = 'DIRTY', // Group with wild cards (6 natural + 1 wild)
  WILD_GROUP = 'WILD_GROUP', // 7 wild cards
  SEVEN_GROUP = 'SEVEN_GROUP', // 7 cards of rank 7
}

export interface Meld {
  id: string;
  type: MeldType;
  cards: Card[];
  isComplete: boolean; // 7 cards
  teamId: number;
  rank?: Rank; // For groups
  suit?: Suit; // For sequences
}

// Player Types
export interface Player {
  id: number;
  name: string;
  teamId: number;
  hand1: Card[]; // First hand (15 cards)
  hand2: Card[] | null; // Second hand (15 cards, null until picked up)
  hasPickedHand2: boolean;
  hasGoneDown: boolean;
  isCurrentPlayer: boolean;
  setAsideCards: Card[]; // 7 cards from discard pile pickup
}

// Team Types
export interface Team {
  id: number;
  name: string;
  playerIds: number[];
  melds: Meld[];
  redThrees: Card[];
  score: number;
  hasGoneDown: boolean;
}

// Game State Types
export enum GamePhase {
  SETUP = 'SETUP',
  DEALING = 'DEALING',
  PLAYING = 'PLAYING',
  SCORING = 'SCORING',
  GAME_OVER = 'GAME_OVER',
}

export enum TurnPhase {
  DRAW = 'DRAW', // Draw 3 cards or pick up discard pile
  DECLARE_RED_THREES = 'DECLARE_RED_THREES',
  PICK_HAND2 = 'PICK_HAND2',
  MELD = 'MELD',
  DISCARD = 'DISCARD',
}

export interface GameState {
  phase: GamePhase;
  turnPhase: TurnPhase;
  round: number; // 1-4
  currentPlayerIndex: number;
  players: Player[];
  teams: Team[];
  stockPile: Card[];
  discardPile: Card[];
  isDiscardPileBlocked: boolean; // Black Three on top
  goingDownRequirement: number; // 50, 90, 120, or 150
  gameLog: string[];
}

// Going Out Requirements
export interface GoingOutRequirements {
  hasSevenCardSequence: boolean; // 1 required
  hasSevenOfSevens: boolean; // 1 required
  hasWildGroup: boolean; // 1 required
  naturalGroups: number; // 5 required
  hasDirty: boolean; // 1 required
  allCardsPlayed: boolean;
}

// Action Types
export enum ActionType {
  DRAW_FROM_STOCK = 'DRAW_FROM_STOCK',
  PICKUP_DISCARD_PILE = 'PICKUP_DISCARD_PILE',
  DECLARE_RED_THREE = 'DECLARE_RED_THREE',
  PICKUP_HAND2 = 'PICKUP_HAND2',
  CREATE_MELD = 'CREATE_MELD',
  ADD_TO_MELD = 'ADD_TO_MELD',
  DISCARD = 'DISCARD',
  GO_OUT = 'GO_OUT',
}

export interface GameAction {
  type: ActionType;
  playerId: number;
  cards?: Card[];
  meldId?: string;
  timestamp: number;
}
