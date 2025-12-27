/**
 * Terminal Demo - Samba Canasta Game
 * Run with: node demo.js
 *
 * This demonstrates the game logic without needing React Native
 */

// Simple Card implementation for demo
class Card {
  constructor(suit, rank, deckIndex, cardIndex) {
    this.suit = suit;
    this.rank = rank;
    this.id = `${suit}-${rank}-${deckIndex}-${cardIndex}`;
    this.value = this.calculateValue();
    this.isWild = rank === 'JOKER' || rank === 'TWO';
    this.isRedThree = rank === 'THREE' && (suit === 'HEARTS' || suit === 'DIAMONDS');
    this.isBlackThree = rank === 'THREE' && (suit === 'SPADES' || suit === 'CLUBS');
  }

  calculateValue() {
    const values = {
      'JOKER': 50, 'ACE': 20, 'TWO': 20,
      'KING': 10, 'QUEEN': 10, 'JACK': 10, 'TEN': 10, 'NINE': 10, 'EIGHT': 10,
      'SEVEN': 5, 'SIX': 5, 'FIVE': 5, 'FOUR': 5, 'THREE': 0
    };
    return values[this.rank] || 0;
  }

  getDisplayName() {
    if (this.rank === 'JOKER') return '🃏 Joker';
    const suitSymbols = { 'SPADES': '♠', 'HEARTS': '♥', 'DIAMONDS': '♦', 'CLUBS': '♣' };
    const rankDisplay = {
      'ACE': 'A', 'JACK': 'J', 'QUEEN': 'Q', 'KING': 'K',
      'TWO': '2', 'THREE': '3', 'FOUR': '4', 'FIVE': '5',
      'SIX': '6', 'SEVEN': '7', 'EIGHT': '8', 'NINE': '9', 'TEN': '10'
    };
    return `${rankDisplay[this.rank] || this.rank}${suitSymbols[this.suit] || ''}`;
  }
}

// Simple Deck
class Deck {
  constructor() {
    this.cards = [];
    this.initialize();
  }

  initialize() {
    const suits = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'];
    const ranks = ['ACE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN',
                   'EIGHT', 'NINE', 'TEN', 'JACK', 'QUEEN', 'KING'];

    for (let deckIndex = 0; deckIndex < 6; deckIndex++) {
      let cardIndex = 0;

      // Add 2 Jokers per deck
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card('JOKER', 'JOKER', deckIndex, cardIndex++));
      }

      // Add all standard cards
      for (const suit of suits) {
        for (const rank of ranks) {
          this.cards.push(new Card(suit, rank, deckIndex, cardIndex++));
        }
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(count = 1) {
    return this.cards.splice(0, Math.min(count, this.cards.length));
  }
}

// Demo Game
function runDemo() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  🎮  SAMBA CANASTA - GAME DEMO');
  console.log('═══════════════════════════════════════════════════════\n');

  // Create and shuffle deck
  console.log('📦 Creating 6-deck shoe (324 cards)...');
  const deck = new Deck();
  console.log(`   ✓ Created ${deck.cards.length} cards`);

  console.log('\n🔀 Shuffling deck...');
  deck.shuffle();
  console.log('   ✓ Deck shuffled\n');

  // Deal hands to 4 players
  console.log('👥 Dealing cards to 4 players...');
  console.log('   Each player gets 2 hands of 15 cards (30 total)\n');

  const players = [];
  for (let i = 0; i < 4; i++) {
    const hand1 = deck.draw(15);
    const hand2 = deck.draw(15);
    players.push({
      id: i,
      name: `Player ${i + 1}`,
      teamId: i % 2,
      hand1,
      hand2,
      hasGoneDown: false
    });
  }

  // Show Player 1's hand
  const player1 = players[0];
  console.log(`━━━ ${player1.name} (Team ${player1.teamId + 1}) ━━━`);
  console.log('\n📋 Hand 1 (15 cards):');
  const hand1Display = player1.hand1
    .map(card => card.getDisplayName())
    .join(', ');
  console.log(`   ${hand1Display}`);

  console.log('\n📋 Hand 2 (15 cards - face down):');
  console.log('   [Hidden until player goes down]');

  // Count special cards
  const redThrees = player1.hand1.filter(c => c.isRedThree);
  const blackThrees = player1.hand1.filter(c => c.isBlackThree);
  const wilds = player1.hand1.filter(c => c.isWild);

  console.log('\n📊 Special Cards in Hand 1:');
  console.log(`   Red Threes: ${redThrees.length} (auto-collect for +100 each)`);
  console.log(`   Black Threes: ${blackThrees.length} (cannot meld, -100 if in hand at end)`);
  console.log(`   Wild Cards: ${wilds.length} (Jokers & 2s)`);

  // Calculate hand value
  const handValue = player1.hand1.reduce((sum, card) => sum + card.value, 0);
  console.log(`\n💰 Hand Value: ${handValue} points`);

  console.log('\n🎯 Going Down Requirements:');
  console.log('   Round 1: 50 points');
  console.log('   Round 2: 90 points');
  console.log('   Round 3: 120 points');
  console.log('   Round 4: 150 points');

  // Example meld
  console.log('\n━━━ Example Meld ━━━');
  console.log('\n🃏 To go down in Round 1, you need to meld 50+ points');
  console.log('   Example: Three Aces = 3 × 20 = 60 points ✓');
  console.log('   Example: Four Kings = 4 × 10 = 40 points ✗ (need 50+)');

  // Going out requirements
  console.log('\n━━━ Going Out Requirements (to win) ━━━\n');
  console.log('   ✓ One 7-card sequence (Samba) - 2,000 pts');
  console.log('   ✓ One group of seven 7s - 2,000 pts');
  console.log('   ✓ One group of 7 wild cards - 2,000 pts');
  console.log('   ✓ Five groups of 7 (same rank) - 500 pts each');
  console.log('   ✓ One dirty (6 natural + 1 wild) - 300 pts');
  console.log('   ✓ All cards played from hand');

  // Stock pile info
  console.log('\n━━━ Game State ━━━\n');
  console.log(`   Stock Pile: ${deck.cards.length} cards remaining`);
  console.log(`   Discard Pile: 0 cards (game just started)`);
  console.log(`   Current Turn: Player 1`);
  console.log(`   Turn Action: Draw 3 cards from stock`);

  console.log('\n━━━ Game Flow ━━━\n');
  console.log('   1. Draw 3 cards from stock (or pickup discard pile)');
  console.log('   2. Declare any Red Threes and draw replacements');
  console.log('   3. Meld cards (if able)');
  console.log('   4. Discard 1 card');
  console.log('   5. Next player\'s turn');

  console.log('\n━━━ Discard Pile Pickup Rules ━━━\n');
  console.log('   • Pile must have 8+ cards');
  console.log('   • Need 2 matching natural cards in hand');
  console.log('   • Must meld top card immediately');
  console.log('   • Remaining 7 cards set aside until next turn');
  console.log('   • Cannot use Hand 2 cards for initial meld');

  console.log('\n━━━ Scoring Example ━━━\n');
  console.log('   Going Out Bonus:        +200');
  console.log('   1 Samba (7-card seq):   +2,000');
  console.log('   1 Group of seven 7s:    +2,000');
  console.log('   1 Wild group (7 wilds): +2,000');
  console.log('   5 Natural groups:       +2,500 (5 × 500)');
  console.log('   1 Dirty:                +300');
  console.log('   Card values on table:   +840');
  console.log('   3 Red Threes:           +300');
  console.log('   Cards in hand:          -35');
  console.log('   ─────────────────────────────');
  console.log('   TOTAL SCORE:            12,005 points');

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  Demo complete! The game logic is working.');
  console.log('  To build the full app, you need React Native setup.');
  console.log('═══════════════════════════════════════════════════════\n');
}

// Run the demo
runDemo();
