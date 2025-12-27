# Samba Canasta Mobile Game

A mobile card game implementation of Samba Canasta with official rules.

## Features

- 4-player partnership card game
- 6-deck system (324 cards total)
- Two-hand system per player
- Complex melding mechanics (groups, sequences, dirties)
- Progressive going down requirements (50/90/120/150 points)
- Complete going out validation
- Comprehensive scoring system
- Red Three auto-collection
- Black Three blocking mechanics
- Wild card management

## Technology Stack

- React Native 0.73
- TypeScript 5.3
- React Navigation
- React Native Reanimated

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
npm install
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android
```

### Development

```bash
# Start Metro bundler
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Game Rules

See [RULES.md](./RULES.md) for complete game rules and mechanics.

## Project Structure

```
src/
├── models/          # Data models (Card, Player, Team, Meld, GameState)
├── game/            # Game logic (rules, validation, scoring)
├── components/      # React components (Card, Hand, Meld, etc.)
├── screens/         # Screen components (Game, Menu, Rules)
├── utils/           # Utility functions
└── types/           # TypeScript type definitions
```

## License

MIT
