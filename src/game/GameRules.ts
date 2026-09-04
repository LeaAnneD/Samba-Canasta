import {
  Card,
  Meld,
  MeldType,
  Rank,
  Suit,
  Team,
  GoingOutRequirements,
} from '../types';

export class GameRules {
  // Going down requirements by round
  static getGoingDownRequirement(round: number): number {
    const requirements: { [key: number]: number } = {
      1: 50,
      2: 90,
      3: 120,
      4: 150,
    };
    return requirements[round] || 50;
  }

  // Validate if cards can form a valid initial meld
  static canCreateMeld(cards: Card[], type: MeldType): boolean {
    if (cards.length < 3) {
      return false;
    }

    switch (type) {
      case MeldType.GROUP:
        return this.isValidGroup(cards);

      case MeldType.SEQUENCE:
        return this.isValidSequence(cards);

      case MeldType.DIRTY:
        return this.isValidDirty(cards);

      case MeldType.WILD_GROUP:
        return cards.every((card) => card.isWild);

      case MeldType.SEVEN_GROUP:
        return cards.every((card) => card.rank === Rank.SEVEN);

      default:
        return false;
    }
  }

  private static isValidGroup(cards: Card[]): boolean {
    if (cards.length < 3) return false;

    // All must be natural and same rank
    const rank = cards[0].rank;
    return cards.every((card) => card.rank === rank && card.isNatural());
  }

  private static isValidSequence(cards: Card[]): boolean {
    if (cards.length < 3) return false;

    // All must be natural, same suit, and consecutive
    const suit = cards[0].suit;
    if (!cards.every((card) => card.suit === suit && card.canBeInSequence())) {
      return false;
    }

    // Sort by rank order and check consecutive
    const sorted = [...cards].sort(
      (a, b) => a.getRankOrder() - b.getRankOrder()
    );
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].getRankOrder() !== sorted[i - 1].getRankOrder() + 1) {
        return false;
      }
    }

    return true;
  }

  private static isValidDirty(cards: Card[]): boolean {
    if (cards.length < 3) return false;

    const naturals = cards.filter((c) => c.isNatural());
    const wilds = cards.filter((c) => c.isWild);

    // Must have more naturals than wilds
    if (wilds.length >= naturals.length) {
      return false;
    }

    // All naturals must be same rank
    if (naturals.length === 0) return false;
    const rank = naturals[0].rank;
    return naturals.every((card) => card.rank === rank);
  }

  // Calculate point value of cards for going down
  static calculateMeldPoints(cards: Card[]): number {
    return cards.reduce((sum, card) => sum + card.value, 0);
  }

  // Validate discard pile pickup
  static canPickupDiscardPile(
    hand: Card[],
    discardPile: Card[],
    topCard: Card,
    hasGoneDown: boolean,
    existingMeldsOnTable: Meld[],
    currentRound: number,
    goingDownWithThisPickup: boolean
  ): {
    canPickup: boolean;
    reason?: string;
  } {
    // Must have at least 8 cards
    if (discardPile.length < 8) {
      return { canPickup: false, reason: 'Discard pile must have at least 8 cards' };
    }

    // Cannot be blocked by Black Three
    if (topCard.isBlackThree) {
      return { canPickup: false, reason: 'Discard pile is blocked by Black Three' };
    }

    // Must have 2 matching natural cards in hand
    const matchingCards = hand.filter(
      (card) => card.rank === topCard.rank && card.isNatural()
    );
    if (matchingCards.length < 2) {
      return {
        canPickup: false,
        reason: 'Need 2 matching natural cards in hand',
      };
    }

    // Cannot pickup if there's already a set of 5+ of this rank on table
    const existingMeldOfRank = existingMeldsOnTable.find(
      (meld) => meld.rank === topCard.rank && meld.cards.length >= 5
    );
    if (existingMeldOfRank) {
      return {
        canPickup: false,
        reason: 'Cannot pickup - already have 5+ of this rank on table',
      };
    }

    // If going down with this pickup, check point requirements
    if (goingDownWithThisPickup && !hasGoneDown) {
      const requirement = this.getGoingDownRequirement(currentRound);
      // Player needs to show they can meet requirement with their melds
      // This would be validated when they actually make the melds
      return { canPickup: true };
    }

    // If already gone down, can pickup
    if (hasGoneDown) {
      return { canPickup: true };
    }

    return {
      canPickup: false,
      reason: 'Must go down first before picking up discard pile',
    };
  }

  // Check if team has met going out requirements
  static checkGoingOutRequirements(
    teamMelds: Meld[]
  ): GoingOutRequirements {
    const requirements: GoingOutRequirements = {
      hasSevenCardSequence: false,
      hasSevenOfSevens: false,
      hasWildGroup: false,
      naturalGroups: 0,
      hasDirty: false,
      allCardsPlayed: false, // This is checked separately
    };

    for (const meld of teamMelds) {
      if (!meld.isComplete) continue;

      switch (meld.type) {
        case MeldType.SEQUENCE:
          requirements.hasSevenCardSequence = true;
          break;

        case MeldType.SEVEN_GROUP:
          requirements.hasSevenOfSevens = true;
          break;

        case MeldType.WILD_GROUP:
          requirements.hasWildGroup = true;
          break;

        case MeldType.GROUP:
          requirements.naturalGroups++;
          break;

        case MeldType.DIRTY:
          requirements.hasDirty = true;
          break;
      }
    }

    return requirements;
  }

  // Check if can go out
  static canGoOut(
    teamMelds: Meld[],
    playerHasCardsRemaining: boolean
  ): { canGoOut: boolean; missingRequirements: string[] } {
    const requirements = this.checkGoingOutRequirements(teamMelds);
    const missing: string[] = [];

    if (!requirements.hasSevenCardSequence) {
      missing.push('Need 1 seven-card sequence (Samba)');
    }

    if (!requirements.hasSevenOfSevens) {
      missing.push('Need 1 group of seven 7s');
    }

    if (!requirements.hasWildGroup) {
      missing.push('Need 1 group of 7 wild cards');
    }

    if (requirements.naturalGroups < 5) {
      missing.push(`Need 5 groups of 7 (have ${requirements.naturalGroups})`);
    }

    if (!requirements.hasDirty) {
      missing.push('Need 1 dirty (6 natural + 1 wild)');
    }

    if (playerHasCardsRemaining) {
      missing.push('Must play all cards from hand');
    }

    return {
      canGoOut: missing.length === 0,
      missingRequirements: missing,
    };
  }

  // Count sequences by suit (max 4, one per suit)
  static countSequencesBySuit(melds: Meld[]): Map<Suit, number> {
    const counts = new Map<Suit, number>();

    for (const meld of melds) {
      if (meld.type === MeldType.SEQUENCE && meld.suit) {
        counts.set(meld.suit, (counts.get(meld.suit) || 0) + 1);
      }
    }

    return counts;
  }

  // Validate if can start a new sequence in a suit
  static canStartSequenceInSuit(
    suit: Suit,
    existingMeldsOnTable: Meld[]
  ): boolean {
    const sequenceCounts = this.countSequencesBySuit(existingMeldsOnTable);
    const countInSuit = sequenceCounts.get(suit) || 0;

    // Can only have 1 complete sequence per suit
    const hasCompleteSequenceInSuit = existingMeldsOnTable.some(
      (meld) =>
        meld.type === MeldType.SEQUENCE &&
        meld.suit === suit &&
        meld.isComplete
    );

    return !hasCompleteSequenceInSuit;
  }
}
