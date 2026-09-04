import {
  Card,
  GameState,
  GamePhase,
  TurnPhase,
  Player,
  Team,
  Meld,
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

  startNewGame(): void {
    this.state = this.initializeGame();
    this.dealCards();
    this.state.phase = GamePhase.PLAYING;
    this.state.turnPhase = TurnPhase.DRAW;
    this.addLog('Game started! Round 1 begins.');
  }

  private dealCards(): void {
    const deck = new Deck();
    deck.shuffle();

    const hands = deck.dealInitialHands();

    for (let i = 0; i < 4; i++) {
      this.state.players[i].hand1 = hands[i].pile1;
      this.state.players[i].hand2 = hands[i].pile2;
    }

    this.state.stockPile = deck.getCards();
    this.addLog('Cards dealt. Each player has 15 cards in Hand 1.');
  }

  drawFromStock(playerId: number): Card[] {
    if (this.state.turnPhase !== TurnPhase.DRAW) {
      this.addLog('You can only draw at the start of your turn!');
      return [];
    }

    if (this.state.stockPile.length === 0) {
      this.addLog('Stock pile is empty!');
      return [];
    }

    const drawCount = Math.min(3, this.state.stockPile.length);
    const drawnCards = this.state.stockPile.splice(0, drawCount);

    const player = this.state.players[playerId];
    player.hand1 = [...player.hand1, ...drawnCards];

    this.addLog(
      player.name + ' drew ' + drawCount + ' card(s). ' + this.state.stockPile.length + ' cards remaining in stock.'
    );

    this.handleRedThrees(playerId, drawnCards);
    
    this.state.turnPhase = TurnPhase.MELD;

    return drawnCards;
  }

  private handleRedThrees(playerId: number, cards: Card[]): void {
    const player = this.state.players[playerId];
    const team = this.state.teams.find(t => t.id === player.teamId)!;

    const redThrees = player.hand1.filter((card) => card.isRedThree);

    if (redThrees.length > 0) {
      player.hand1 = player.hand1.filter((card) => !card.isRedThree);
      team.redThrees = [...team.redThrees, ...redThrees];

      const replacements = this.state.stockPile.splice(0, redThrees.length);
      player.hand1 = [...player.hand1, ...replacements];

      this.addLog(
        player.name + ' collected ' + redThrees.length + ' Red Three(s) and drew replacements.'
      );
    }
  }

  discard(playerId: number, card: Card): void {
    const player = this.state.players[playerId];

    const index = player.hand1.findIndex((c) => c.id === card.id);
    if (index >= 0) {
      player.hand1 = player.hand1.filter((c) => c.id !== card.id);
    }

    this.state.discardPile = [...this.state.discardPile, card];

    if (card.isBlackThree) {
      this.state.isDiscardPileBlocked = true;
      this.addLog(player.name + ' discarded a Black Three - pile blocked!');
    } else {
      this.state.isDiscardPileBlocked = false;
      this.addLog(player.name + ' discarded ' + card.getDisplayName());
    }

    this.state.turnPhase = TurnPhase.DRAW;
  }

  nextTurn(): void {
    this.state.currentPlayerIndex =
      (this.state.currentPlayerIndex + 1) % this.state.players.length;

    this.state.players.forEach((p, i) => {
      p.isCurrentPlayer = i === this.state.currentPlayerIndex;
    });

    const currentPlayer = this.state.players[this.state.currentPlayerIndex];

    if (currentPlayer.setAsideCards.length > 0) {
      currentPlayer.hand1 = [...currentPlayer.hand1, ...currentPlayer.setAsideCards];
      this.addLog(
        currentPlayer.name + ' incorporates ' + currentPlayer.setAsideCards.length + ' set-aside cards.'
      );
      currentPlayer.setAsideCards = [];
    }

    this.state.turnPhase = TurnPhase.DRAW;
    this.addLog(currentPlayer.name + "'s turn.");
  }

  private addLog(message: string): void {
    this.state.gameLog = [...this.state.gameLog, message];
    console.log(message);
  }

  getState(): GameState {
    return JSON.parse(JSON.stringify(this.state));
  }
}
