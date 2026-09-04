import { Card, Meld, MeldType, Player, Team } from '../types';

export interface TeamScore {
  goingOutBonus: number;
  completedMeldBonuses: number;
  cardValuesOnTable: number;
  redThreeBonus: number;
  cardsInHandPenalty: number;
  totalScore: number;
}

export class Scoring {
  // Calculate going out bonus (200 points if team went out before stock depleted)
  static calculateGoingOutBonus(
    teamWentOut: boolean,
    stockDepleted: boolean
  ): number {
    if (teamWentOut && !stockDepleted) {
      return 200;
    }
    return 0;
  }

  // Calculate bonuses for completed melds
  static calculateCompletedMeldBonuses(melds: Meld[]): number {
    let total = 0;

    for (const meld of melds) {
      if (!meld.isComplete) continue;

      switch (meld.type) {
        case MeldType.SEQUENCE:
          total += 2000; // Samba
          break;

        case MeldType.SEVEN_GROUP:
          total += 2000; // Seven 7s
          break;

        case MeldType.WILD_GROUP:
          total += 2000; // 7 wild cards
          break;

        case MeldType.GROUP:
          total += 500; // Natural group of 7
          break;

        case MeldType.DIRTY:
          total += 300; // Dirty (6+1)
          break;
      }
    }

    return total;
  }

  // Calculate card values on table (all melds, complete and incomplete)
  static calculateCardValuesOnTable(melds: Meld[]): number {
    let total = 0;

    for (const meld of melds) {
      for (const card of meld.cards) {
        total += card.value;
      }
    }

    return total;
  }

  // Calculate Red Three bonus
  static calculateRedThreeBonus(redThrees: Card[]): number {
    return redThrees.length * 100;
  }

  // Calculate penalty for cards remaining in hand
  static calculateCardsInHandPenalty(players: Player[]): number {
    let total = 0;

    for (const player of players) {
      // Count cards in hand1
      for (const card of player.hand1) {
        if (card.isBlackThree) {
          total += 100; // Black three penalty
        } else {
          total += card.value;
        }
      }

      // Count cards in hand2 if not picked up yet
      if (player.hand2) {
        for (const card of player.hand2) {
          if (card.isBlackThree) {
            total += 100;
          } else {
            total += card.value;
          }
        }
      }

      // Count set-aside cards from discard pile pickup
      for (const card of player.setAsideCards) {
        if (card.isBlackThree) {
          total += 100;
        } else {
          total += card.value;
        }
      }
    }

    return total;
  }

  // Calculate total team score
  static calculateTeamScore(
    team: Team,
    players: Player[],
    teamWentOut: boolean,
    stockDepleted: boolean
  ): TeamScore {
    const goingOutBonus = this.calculateGoingOutBonus(
      teamWentOut,
      stockDepleted
    );
    const completedMeldBonuses = this.calculateCompletedMeldBonuses(
      team.melds
    );
    const cardValuesOnTable = this.calculateCardValuesOnTable(team.melds);
    const redThreeBonus = this.calculateRedThreeBonus(team.redThrees);
    const cardsInHandPenalty = this.calculateCardsInHandPenalty(players);

    const totalScore =
      goingOutBonus +
      completedMeldBonuses +
      cardValuesOnTable +
      redThreeBonus -
      cardsInHandPenalty;

    return {
      goingOutBonus,
      completedMeldBonuses,
      cardValuesOnTable,
      redThreeBonus,
      cardsInHandPenalty,
      totalScore,
    };
  }

  // Format score breakdown for display
  static formatScoreBreakdown(score: TeamScore): string {
    return `
Going Out Bonus: ${score.goingOutBonus}
Completed Meld Bonuses: ${score.completedMeldBonuses}
Card Values on Table: ${score.cardValuesOnTable}
Red Three Bonus: ${score.redThreeBonus}
Cards in Hand Penalty: -${score.cardsInHandPenalty}
─────────────────────
Total Score: ${score.totalScore}
    `.trim();
  }
}
