import { Card, Rank, Suit } from '../types';

export class CardModel implements Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number;
  isWild: boolean;
  isRedThree: boolean;
  isBlackThree: boolean;

  constructor(suit: Suit, rank: Rank, deckIndex: number, cardIndex: number) {
    this.suit = suit;
    this.rank = rank;
    this.id = `${suit}-${rank}-${deckIndex}-${cardIndex}`;
    this.value = this.calculateValue();
    this.isWild = this.checkIsWild();
    this.isRedThree = this.checkIsRedThree();
    this.isBlackThree = this.checkIsBlackThree();
  }

  private calculateValue(): number {
    switch (this.rank) {
      case Rank.JOKER:
        return 50;
      case Rank.ACE:
      case Rank.TWO:
        return 20;
      case Rank.KING:
      case Rank.QUEEN:
      case Rank.JACK:
      case Rank.TEN:
      case Rank.NINE:
      case Rank.EIGHT:
        return 10;
      case Rank.SEVEN:
      case Rank.SIX:
      case Rank.FIVE:
      case Rank.FOUR:
        return 5;
      case Rank.THREE:
        // Red threes are +100, black threes are -100 in hand
        // But for meld calculation, they're not counted
        return 0;
      default:
        return 0;
    }
  }

  private checkIsWild(): boolean {
    return this.rank === Rank.JOKER || this.rank === Rank.TWO;
  }

  private checkIsRedThree(): boolean {
    return (
      this.rank === Rank.THREE &&
      (this.suit === Suit.HEARTS || this.suit === Suit.DIAMONDS)
    );
  }

  private checkIsBlackThree(): boolean {
    return (
      this.rank === Rank.THREE &&
      (this.suit === Suit.SPADES || this.suit === Suit.CLUBS)
    );
  }

  isNatural(): boolean {
    return !this.isWild;
  }

  canBeInSequence(): boolean {
    // Wild cards cannot be in sequences
    // Black threes cannot be melded
    // Red threes are auto-collected
    return (
      !this.isWild &&
      !this.isBlackThree &&
      !this.isRedThree &&
      this.rank !== Rank.THREE
    );
  }

  getDisplayName(): string {
    if (this.rank === Rank.JOKER) {
      return 'Joker';
    }
    return `${this.rank} of ${this.suit}`;
  }

  getRankOrder(): number {
    // For sequences: 4, 5, 6, 7, 8, 9, 10, J, Q, K, A
    const order: { [key in Rank]: number } = {
      [Rank.FOUR]: 4,
      [Rank.FIVE]: 5,
      [Rank.SIX]: 6,
      [Rank.SEVEN]: 7,
      [Rank.EIGHT]: 8,
      [Rank.NINE]: 9,
      [Rank.TEN]: 10,
      [Rank.JACK]: 11,
      [Rank.QUEEN]: 12,
      [Rank.KING]: 13,
      [Rank.ACE]: 14,
      [Rank.TWO]: 0, // Wild card, not used in sequences
      [Rank.THREE]: 0, // Not used in sequences
      [Rank.JOKER]: 0, // Wild card, not used in sequences
    };
    return order[this.rank];
  }
}
