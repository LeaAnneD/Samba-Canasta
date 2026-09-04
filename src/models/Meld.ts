import { Card, Meld, MeldType, Rank, Suit } from '../types';

export class MeldModel implements Meld {
  id: string;
  type: MeldType;
  cards: Card[];
  isComplete: boolean;
  teamId: number;
  rank?: Rank;
  suit?: Suit;

  constructor(
    cards: Card[],
    type: MeldType,
    teamId: number,
    rank?: Rank,
    suit?: Suit
  ) {
    this.id = `meld-${Date.now()}-${Math.random()}`;
    this.cards = cards;
    this.type = type;
    this.teamId = teamId;
    this.rank = rank;
    this.suit = suit;
    this.isComplete = cards.length >= 7;
  }

  addCard(card: Card): boolean {
    if (this.isComplete) {
      return false; // Cannot add to complete meld
    }

    if (!this.canAddCard(card)) {
      return false;
    }

    this.cards.push(card);
    this.isComplete = this.cards.length >= 7;
    return true;
  }

  canAddCard(card: Card): boolean {
    if (this.isComplete) {
      return false;
    }

    switch (this.type) {
      case MeldType.GROUP:
        return card.rank === this.rank && card.isNatural();

      case MeldType.SEQUENCE:
        return this.canAddToSequence(card);

      case MeldType.DIRTY:
        return this.canAddToDirty(card);

      case MeldType.WILD_GROUP:
        return card.isWild;

      case MeldType.SEVEN_GROUP:
        return card.rank === Rank.SEVEN;

      default:
        return false;
    }
  }

  private canAddToSequence(card: Card): boolean {
    if (!card.canBeInSequence() || card.suit !== this.suit) {
      return false;
    }

    // Check if card fits in the sequence
    const ranks = this.cards.map((c) => c.getRankOrder()).sort((a, b) => a - b);
    const newRankOrder = card.getRankOrder();

    // Check if it's consecutive to lowest or highest card
    const minRank = Math.min(...ranks);
    const maxRank = Math.max(...ranks);

    return newRankOrder === minRank - 1 || newRankOrder === maxRank + 1;
  }

  private canAddToDirty(card: Card): boolean {
    // Dirty must be exactly 6 natural + 1 wild
    if (this.isComplete) {
      return false;
    }

    const naturalCount = this.cards.filter((c) => c.isNatural()).length;
    const wildCount = this.cards.filter((c) => c.isWild).length;

    if (card.isWild) {
      // Can only add wild if we have 6 naturals already
      return naturalCount === 6 && wildCount === 0;
    } else {
      // Adding natural card
      if (card.rank !== this.rank) {
        return false;
      }
      // Can add natural if we don't have 6 yet
      return naturalCount < 6;
    }
  }

  getPointValue(): number {
    if (!this.isComplete) {
      // Incomplete melds only count card values
      return this.cards.reduce((sum, card) => sum + card.value, 0);
    }

    // Complete meld bonuses
    switch (this.type) {
      case MeldType.SEQUENCE:
        return 2000; // Samba bonus

      case MeldType.SEVEN_GROUP:
        return 2000; // Seven 7s bonus

      case MeldType.WILD_GROUP:
        return 2000; // 7 wild cards bonus

      case MeldType.GROUP:
        return 500; // Natural group of 7

      case MeldType.DIRTY:
        return 300; // Dirty bonus

      default:
        return this.cards.reduce((sum, card) => sum + card.value, 0);
    }
  }

  getCardCount(): number {
    return this.cards.length;
  }

  hasWildCards(): boolean {
    return this.cards.some((card) => card.isWild);
  }

  getNaturalCount(): number {
    return this.cards.filter((card) => card.isNatural()).length;
  }

  getWildCount(): number {
    return this.cards.filter((card) => card.isWild).length;
  }

  isValidMeld(): boolean {
    if (this.cards.length < 3) {
      return false;
    }

    switch (this.type) {
      case MeldType.GROUP:
        return this.isValidGroup();

      case MeldType.SEQUENCE:
        return this.isValidSequence();

      case MeldType.DIRTY:
        return this.isValidDirty();

      case MeldType.WILD_GROUP:
        return this.cards.every((card) => card.isWild);

      case MeldType.SEVEN_GROUP:
        return this.cards.every((card) => card.rank === Rank.SEVEN);

      default:
        return false;
    }
  }

  private isValidGroup(): boolean {
    // All cards must be same rank and natural
    if (!this.rank) return false;
    return this.cards.every(
      (card) => card.rank === this.rank && card.isNatural()
    );
  }

  private isValidSequence(): boolean {
    // All cards must be same suit, consecutive, and natural
    if (!this.suit) return false;

    const allSameSuit = this.cards.every((card) => card.suit === this.suit);
    const allNatural = this.cards.every((card) => card.isNatural());

    if (!allSameSuit || !allNatural) {
      return false;
    }

    // Check consecutive
    const ranks = this.cards.map((c) => c.getRankOrder()).sort((a, b) => a - b);
    for (let i = 1; i < ranks.length; i++) {
      if (ranks[i] !== ranks[i - 1] + 1) {
        return false;
      }
    }

    return true;
  }

  private isValidDirty(): boolean {
    // Must be exactly 6 natural + 1 wild (when complete)
    // During building, must always have more naturals than wilds
    if (!this.rank) return false;

    const naturalCount = this.getNaturalCount();
    const wildCount = this.getWildCount();

    // All naturals must be same rank
    const naturals = this.cards.filter((c) => c.isNatural());
    const allSameRank = naturals.every((card) => card.rank === this.rank);

    if (!allSameRank) {
      return false;
    }

    // Must always have more naturals than wilds
    if (wildCount >= naturalCount) {
      return false;
    }

    // When complete, must be exactly 6+1
    if (this.isComplete) {
      return naturalCount === 6 && wildCount === 1;
    }

    return true;
  }
}
