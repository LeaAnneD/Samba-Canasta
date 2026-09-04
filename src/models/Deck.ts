import { Card, Rank, Suit } from '../types';
import { CardModel } from './Card';

export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.cards = [];

    // Create 6 standard decks
    for (let deckIndex = 0; deckIndex < 6; deckIndex++) {
      let cardIndex = 0;

      // Add 2 Jokers per deck (12 total)
      for (let i = 0; i < 2; i++) {
        this.cards.push(
          new CardModel(Suit.JOKER, Rank.JOKER, deckIndex, cardIndex++)
        );
      }

      // Add all standard cards for each suit
      const suits = [Suit.SPADES, Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS];
      const ranks = [
        Rank.ACE,
        Rank.TWO,
        Rank.THREE,
        Rank.FOUR,
        Rank.FIVE,
        Rank.SIX,
        Rank.SEVEN,
        Rank.EIGHT,
        Rank.NINE,
        Rank.TEN,
        Rank.JACK,
        Rank.QUEEN,
        Rank.KING,
      ];

      for (const suit of suits) {
        for (const rank of ranks) {
          this.cards.push(new CardModel(suit, rank, deckIndex, cardIndex++));
        }
      }
    }
  }

  shuffle(): void {
    // Fisher-Yates shuffle algorithm
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(count: number = 1): Card[] {
    if (count > this.cards.length) {
      // Return whatever is left if not enough cards
      const remaining = this.cards.splice(0, this.cards.length);
      return remaining;
    }
    return this.cards.splice(0, count);
  }

  getCards(): Card[] {
    return [...this.cards];
  }

  getRemainingCount(): number {
    return this.cards.length;
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  // For dealing: deal 15 cards to each player (4 players = 60 cards)
  // Each player gets two piles of 15
  dealInitialHands(): { pile1: Card[]; pile2: Card[] }[] {
    const hands: { pile1: Card[]; pile2: Card[] }[] = [];

    for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
      const pile1: Card[] = [];
      const pile2: Card[] = [];

      // Deal 15 cards to pile1
      for (let i = 0; i < 15; i++) {
        const card = this.draw(1)[0];
        if (card) pile1.push(card);
      }

      // Deal 15 cards to pile2
      for (let i = 0; i < 15; i++) {
        const card = this.draw(1)[0];
        if (card) pile2.push(card);
      }

      hands.push({ pile1, pile2 });
    }

    return hands;
  }

  // Get total card count (should be 324)
  static getTotalCardCount(): number {
    return 324; // 6 decks × (52 cards + 2 jokers) = 6 × 54 = 324
  }
}
