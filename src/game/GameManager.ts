import {
  Card,
  GameState,
  GamePhase,
  TurnPhase,
  Player,
  Team,
  Meld,
  ActionType,
  GameAction,
  MeldType,
  Rank,
} from '../types';
import { Deck } from '../models/Deck';
import { GameRules } from './GameRules';
import { Scoring } from './Scoring';
import { MeldModel } from '../models/Meld';

export class GameManager {
  private state: GameState;

  constructor() {
    this.state = this.initializeGame();
  }

  private initializeGame(): GameState {
    const players: Player[] = [
      {
        id: 0,
        name: 'Player 1',
        teamId: 0,
        hand1: [],
        hand2: null,
        hasPickedHand2: false,
        hasGoneDown: false,
        isCurrentPlayer: true,
        setAsideCards: [],
      },
      {
        id: 1,
        name: 'Player 2',
        teamId: 1,
        hand1: [],
        hand2: null,
        hasPickedHand2: false,
        hasGoneDown: false,
        isCurrentPlayer: false,
        setAsideCards: [],
      },
      {
        id: 2,
        name: 'Player 3',
        teamId: 0,
        hand1: [],
        hand2: null,
        hasPickedHand2: false,
        hasGoneDown: false,
        isCurrentPlayer: false,
        setAsideCards: [],
      },
      {
        id: 3,
        name: 'Player 4',
        teamId: 1,
        hand1: [],
        hand2: null,
        hasPickedHand2: false,
        hasGoneDown: false,
        isCurrentPlayer: false,
        setAsideCards: [],
      },
    ];

    const teams: Team[] = [
      {
        id: 0,
        name: 'Team 1',
        playerIds: [0, 2],
        melds: [],
        redThrees: [],
        score: 0,
        hasGoneDown: false,
      },
      {
        id: 1,
        name: 'Team 2',
        playerIds: [1, 3],
        melds: [],
        redThrees: [],
        score: 0,
        hasGoneDown: false,
      },
    ];

    return {
      phase: GamePhase.SETUP,
      turnPhase: TurnPhase.DRAW,
      round: 1,
      currentPlayerIndex: 0,
      players,
      teams,
      stockPile: [],
      discardPile: [],
      isDiscardPileBlocked: false,
      goingDownRequirement: 50,
      gameLog: [],
    };
  }

  // Start a new game
  startNewGame(): void {
    this.state = this.initializeGame();
    this.dealCards();
    this.state.phase = GamePhase.PLAYING;
    this.addLog('Game started! Round 1 begins.');
  }

  // Deal cards using the two-hand system
  private dealCards(): void {
    const deck = new Deck();
    deck.shuffle();

    // Deal initial hands (each player gets 2 piles of 15)
    const hands = deck.dealInitialHands();

    // Simulate card exchange (in a real game, players would pass piles)
    // For now, we'll just assign them directly
    for (let i = 0; i < 4; i++) {
      // In actual game, players would exchange piles with left/right neighbors
      // For simplicity, we'll just assign pile1 to hand1 and pile2 to hand2
      this.state.players[i].hand1 = hands[i].pile1;
      this.state.players[i].hand2 = hands[i].pile2;
    }

    // Remaining cards become stock pile
    this.state.stockPile = deck.getCards();

    this.addLog('Cards dealt. Each player has 15 cards in Hand 1.');
  }

  // Draw 3 cards from stock
  drawFromStock(playerId: number): Card[] {
    if (this.state.stockPile.length === 0) {
      this.addLog('Stock pile is empty!');
      return [];
    }

    const drawCount = Math.min(3, this.state.stockPile.length);
    const drawnCards = this.state.stockPile.splice(0, drawCount);

    const player = this.getPlayer(playerId);
    player.hand1.push(...drawnCards);

    this.addLog(
      `${player.name} drew ${drawCount} card(s) from stock. ${this.state.stockPile.length} cards remaining.`
    );

    // Check for Red Threes
    this.handleRedThrees(playerId, drawnCards);

    return drawnCards;
  }

  // Handle Red Three auto-collection
  private handleRedThrees(playerId: number, cards: Card[]): void {
    const player = this.getPlayer(playerId);
    const team = this.getTeam(player.teamId);

    const redThrees = cards.filter((card) => card.isRedThree);

    if (redThrees.length > 0) {
      // Remove from hand and add to team's red threes
      player.hand1 = player.hand1.filter((card) => !card.isRedThree);
      team.redThrees.push(...redThrees);

      // Draw replacement cards
      const replacements = this.state.stockPile.splice(0, redThrees.length);
      player.hand1.push(...replacements);

      this.addLog(
        `${player.name} collected ${redThrees.length} Red Three(s) and drew replacement cards.`
      );
    }
  }

  // Pick up discard pile (top 8 cards)
  pickupDiscardPile(playerId: number, matchingCards: Card[]): boolean {
    const player = this.getPlayer(playerId);
    const team = this.getTeam(player.teamId);
    const topCard = this.state.discardPile[this.state.discardPile.length - 1];

    if (!topCard) {
      this.addLog('No cards in discard pile.');
      return false;
    }

    // Validate pickup
    const validation = GameRules.canPickupDiscardPile(
      player.hand1,
      this.state.discardPile,
      topCard,
      team.hasGoneDown,
      team.melds,
      this.state.round,
      !team.hasGoneDown
    );

    if (!validation.canPickup) {
      this.addLog(`Cannot pickup discard pile: ${validation.reason}`);
      return false;
    }

    // Take top 8 cards
    const pickedCards = this.state.discardPile.splice(-8);
    const topCardFromPile = pickedCards[pickedCards.length - 1];
    const remaining7 = pickedCards.slice(0, 7);

    // Must meld top card immediately with 2 matching cards
    const meldCards = [topCardFromPile, ...matchingCards];

    // Remove matching cards from hand
    for (const card of matchingCards) {
      const index = player.hand1.findIndex((c) => c.id === card.id);
      if (index >= 0) {
        player.hand1.splice(index, 1);
      }
    }

    // Create or add to meld
    const existingMeld = team.melds.find(
      (m) => m.rank === topCardFromPile.rank && m.type === MeldType.GROUP
    );

    if (existingMeld) {
      for (const card of meldCards) {
        existingMeld.cards.push(card);
      }
    } else {
      const newMeld = new MeldModel(
        meldCards,
        MeldType.GROUP,
        team.id,
        topCardFromPile.rank
      );
      team.melds.push(newMeld);
    }

    // Set aside the remaining 7 cards
    player.setAsideCards = remaining7;

    this.addLog(
      `${player.name} picked up discard pile (8 cards). 7 cards set aside for next turn.`
    );

    return true;
  }

  // Create a new meld
  createMeld(
    playerId: number,
    cards: Card[],
    type: MeldType
  ): Meld | null {
    const player = this.getPlayer(playerId);
    const team = this.getTeam(player.teamId);

    // Validate meld
    if (!GameRules.canCreateMeld(cards, type)) {
      this.addLog('Invalid meld combination.');
      return null;
    }

    // Determine rank/suit
    let rank: Rank | undefined;
    let suit;

    if (
      type === MeldType.GROUP ||
      type === MeldType.DIRTY ||
      type === MeldType.SEVEN_GROUP
    ) {
      rank = cards.find((c) => c.isNatural())?.rank;
    }

    if (type === MeldType.SEQUENCE) {
      suit = cards[0].suit;
    }

    const meld = new MeldModel(cards, type, team.id, rank, suit);

    // Remove cards from hand
    for (const card of cards) {
      const index = player.hand1.findIndex((c) => c.id === card.id);
      if (index >= 0) {
        player.hand1.splice(index, 1);
      }
    }

    team.melds.push(meld);

    this.addLog(
      `${player.name} created a ${type} meld with ${cards.length} cards.`
    );

    return meld;
  }

  // Discard a card
  discard(playerId: number, card: Card): void {
    const player = this.getPlayer(playerId);

    // Remove from hand
    const index = player.hand1.findIndex((c) => c.id === card.id);
    if (index >= 0) {
      player.hand1.splice(index, 1);
    }

    // Add to discard pile
    this.state.discardPile.push(card);

    // Check if Black Three blocks pile
    if (card.isBlackThree) {
      this.state.isDiscardPileBlocked = true;
      this.addLog(`${player.name} discarded a Black Three - discard pile is blocked!`);
    } else {
      this.state.isDiscardPileBlocked = false;
      this.addLog(`${player.name} discarded ${card.getDisplayName()}.`);
    }
  }

  // Check if player can go down
  canGoDown(playerId: number, proposedMelds: Meld[]): boolean {
    const player = this.getPlayer(playerId);
    const team = this.getTeam(player.teamId);

    if (team.hasGoneDown) {
      return true; // Already gone down
    }

    const totalPoints = proposedMelds.reduce(
      (sum, meld) => sum + GameRules.calculateMeldPoints(meld.cards),
      0
    );

    return totalPoints >= this.state.goingDownRequirement;
  }

  // Attempt to go out
  attemptGoOut(playerId: number): boolean {
    const player = this.getPlayer(playerId);
    const team = this.getTeam(player.teamId);

    const hasCardsRemaining = player.hand1.length > 0;
    const validation = GameRules.canGoOut(team.melds, hasCardsRemaining);

    if (!validation.canGoOut) {
      this.addLog(
        `Cannot go out. Missing: ${validation.missingRequirements.join(', ')}`
      );
      return false;
    }

    this.addLog(`${player.name} goes out! Team ${team.name} wins the round!`);
    this.state.phase = GamePhase.SCORING;
    this.calculateFinalScores();

    return true;
  }

  // Calculate final scores
  private calculateFinalScores(): void {
    for (const team of this.state.teams) {
      const teamPlayers = this.state.players.filter(
        (p) => p.teamId === team.id
      );
      const teamWentOut = this.state.phase === GamePhase.SCORING; // Simplified
      const stockDepleted = this.state.stockPile.length === 0;

      const scoreBreakdown = Scoring.calculateTeamScore(
        team,
        teamPlayers,
        teamWentOut,
        stockDepleted
      );

      team.score = scoreBreakdown.totalScore;

      this.addLog(`\n${team.name} Score Breakdown:`);
      this.addLog(Scoring.formatScoreBreakdown(scoreBreakdown));
    }
  }

  // Next turn
  nextTurn(): void {
    this.state.currentPlayerIndex =
      (this.state.currentPlayerIndex + 1) % this.state.players.length;

    // Update current player flags
    this.state.players.forEach((p, i) => {
      p.isCurrentPlayer = i === this.state.currentPlayerIndex;
    });

    const currentPlayer = this.getCurrentPlayer();

    // Incorporate set-aside cards from previous discard pile pickup
    if (currentPlayer.setAsideCards.length > 0) {
      currentPlayer.hand1.push(...currentPlayer.setAsideCards);
      this.addLog(
        `${currentPlayer.name} incorporates ${currentPlayer.setAsideCards.length} set-aside cards into hand.`
      );
      currentPlayer.setAsideCards = [];
    }

    this.state.turnPhase = TurnPhase.DRAW;
    this.addLog(`\n${currentPlayer.name}'s turn.`);
  }

  // Pick up Hand 2
  pickupHand2(playerId: number): void {
    const player = this.getPlayer(playerId);

    if (player.hasPickedHand2 || !player.hand2) {
      return;
    }

    player.hand1.push(...player.hand2);
    player.hand2 = null;
    player.hasPickedHand2 = true;

    this.addLog(`${player.name} picks up Hand 2 (15 cards).`);
  }

  // Helper methods
  private getPlayer(playerId: number): Player {
    return this.state.players[playerId];
  }

  private getTeam(teamId: number): Team {
    return this.state.teams[teamId];
  }

  private getCurrentPlayer(): Player {
    return this.state.players[this.state.currentPlayerIndex];
  }

  private addLog(message: string): void {
    this.state.gameLog.push(message);
    console.log(message);
  }

  // Get current game state
  getState(): GameState {
    return { ...this.state };
  }
}
