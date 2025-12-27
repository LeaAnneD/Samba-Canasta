# Samba Canasta - Development Guide

## Project Structure

```
Samba-Canasta/
├── src/
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Card, Meld, Player, Team, GameState types
│   ├── models/             # Data models
│   │   ├── Card.ts         # Card model with value calculations
│   │   ├── Deck.ts         # Deck management (6 decks, 324 cards)
│   │   └── Meld.ts         # Meld validation and management
│   ├── game/               # Game logic
│   │   ├── GameRules.ts    # Rule validation (going down, discard pile, going out)
│   │   ├── Scoring.ts      # Score calculation
│   │   └── GameManager.ts  # Main game state management
│   ├── components/         # React components
│   │   ├── CardComponent.tsx
│   │   ├── HandComponent.tsx
│   │   └── MeldComponent.tsx
│   └── screens/            # Screen components
│       └── GameScreen.tsx  # Main game screen
├── App.tsx                 # Root app component
├── index.js                # Entry point
└── package.json            # Dependencies

```

## Key Features Implemented

### ✅ Core Game Logic
- [x] 6-deck system (324 cards)
- [x] Two-hand system per player
- [x] Card dealing and exchange simulation
- [x] Turn sequence management
- [x] Going down validation (50/90/120/150 points)
- [x] Discard pile pickup (8-card minimum)
- [x] Meld validation (Groups, Sequences, Dirties)
- [x] Going out requirements (all 6 required melds)
- [x] Complete scoring system

### ✅ Special Card Handling
- [x] Red Three auto-collection (+100 pts)
- [x] Black Three blocking mechanics (-100 pts in hand)
- [x] Wild card management (Jokers & 2s)
- [x] Set-aside cards from discard pile pickup

### ✅ Meld Types
- [x] Groups (3+ same rank)
- [x] Sequences (3+ consecutive, same suit)
- [x] Dirties (6 natural + 1 wild)
- [x] Wild Groups (7 wild cards)
- [x] Seven Groups (7 cards of rank 7)

### ✅ UI Components
- [x] Card component with suit colors and wild indicators
- [x] Hand component with scrolling
- [x] Meld display with bonuses
- [x] Game screen with player info
- [x] Game log

## Architecture

### Models Layer
**Card.ts** - Handles individual cards
- Value calculation
- Wild card detection
- Red/Black Three detection
- Rank ordering for sequences

**Deck.ts** - Manages the 6-deck system
- Generates 324 cards
- Shuffle algorithm
- Deal initial hands (2 piles of 15 per player)
- Draw cards

**Meld.ts** - Meld validation and management
- Add cards to melds
- Validate meld rules
- Calculate meld points
- Track completion (7 cards)

### Game Logic Layer
**GameRules.ts** - Validates game rules
- Going down requirements by round
- Can create meld validation
- Discard pile pickup validation
- Going out requirements checking
- Sequence limit enforcement (max 4)

**Scoring.ts** - Calculates scores
- Going out bonus (200 pts)
- Completed meld bonuses
- Card values on table
- Red Three bonuses
- Cards in hand penalties
- Score breakdown formatting

**GameManager.ts** - Manages game state
- Initialize game
- Deal cards
- Turn sequence
- Player actions (draw, meld, discard)
- Red Three auto-collection
- Hand 2 pickup
- Game log

### UI Layer
**Components** - Reusable UI elements
- CardComponent: Visual card representation
- HandComponent: Scrollable hand display
- MeldComponent: Meld display with bonuses

**Screens** - Game screens
- GameScreen: Main game interface

## Validation Points

### Critical Validations Implemented

1. ✅ **Going Down:** Check minimum points (50/90/120/150)
2. ✅ **Discard Pile Pickup:** 8-card minimum, matching cards, not blocked
3. ✅ **Hand 2 Restriction:** Cannot use Hand 2 cards for initial discard pile meld
4. ✅ **Set-Aside Cards:** 7 cards unavailable until next turn
5. ✅ **Meld Validation:** Groups, sequences, dirties follow rules
6. ✅ **Going Out:** All 6 required melds present
7. ✅ **Wild Cards:** Cannot be used in sequences
8. ✅ **Dirties:** Must have more naturals than wilds (6+1 when complete)
9. ✅ **Red Threes:** Auto-collected when drawn
10. ✅ **Black Three Blocking:** Blocks discard pile pickup

## Future Enhancements

### Planned Features
- [ ] AI opponents (simple strategy)
- [ ] Multiplayer support (local or online)
- [ ] Tutorial mode
- [ ] Meld creation UI (drag & drop)
- [ ] Animation for card movements
- [ ] Sound effects
- [ ] Settings (rules variations)
- [ ] Statistics tracking
- [ ] Save/load game state

### UI/UX Improvements
- [ ] Drag-and-drop card selection
- [ ] Visual meld creation wizard
- [ ] Better discard pile visualization
- [ ] Going out requirements checklist
- [ ] Point calculator for going down
- [ ] Animated card dealing
- [ ] Highlight valid moves
- [ ] Undo functionality

### Multiplayer Features
- [ ] Local pass-and-play
- [ ] Online multiplayer (WebSocket)
- [ ] Room creation/joining
- [ ] Chat functionality
- [ ] Player profiles
- [ ] Leaderboards

## Testing

### Test Cases to Implement
- [ ] Card deck generation (324 cards)
- [ ] Going down validation
- [ ] Discard pile pickup rules
- [ ] Meld validation (all types)
- [ ] Going out requirements
- [ ] Scoring calculations
- [ ] Red Three auto-collection
- [ ] Black Three blocking
- [ ] Hand 2 pickup restrictions
- [ ] Set-aside cards timing

## Running the App

### Prerequisites
```bash
# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..
```

### Development
```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Type Checking
```bash
npm run type-check
```

## Code Style

- TypeScript with strict mode
- Functional components with hooks
- Immutable state updates
- Clear separation of concerns
- Comprehensive type definitions
- Descriptive variable names

## Contributing

When adding features:
1. Follow existing code structure
2. Add TypeScript types
3. Update this documentation
4. Test thoroughly
5. Update RULES.md if rules change

## License

MIT
