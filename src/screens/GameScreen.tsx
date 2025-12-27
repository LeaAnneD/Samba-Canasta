import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { GameManager } from '../game/GameManager';
import { HandComponent } from '../components/HandComponent';
import { MeldComponent } from '../components/MeldComponent';
import { CardComponent } from '../components/CardComponent';
import { Card } from '../types';

export const GameScreen: React.FC = () => {
  const [gameManager] = useState(() => new GameManager());
  const [gameState, setGameState] = useState(gameManager.getState());
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  useEffect(() => {
    gameManager.startNewGame();
    updateGameState();
  }, []);

  const updateGameState = () => {
    setGameState(gameManager.getState());
  };

  const handleDrawFromStock = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    gameManager.drawFromStock(currentPlayer.id);
    updateGameState();
  };

  const handleDiscard = (card: Card) => {
    Alert.alert(
      'Discard Card',
      `Discard ${card.getDisplayName()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          onPress: () => {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            gameManager.discard(currentPlayer.id, card);
            gameManager.nextTurn();
            updateGameState();
          },
        },
      ]
    );
  };

  const handlePickupHand2 = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const team = gameState.teams.find((t) => t.id === currentPlayer.teamId);

    if (!team?.hasGoneDown) {
      Alert.alert('Cannot Pickup', 'Must go down first before picking up Hand 2');
      return;
    }

    gameManager.pickupHand2(currentPlayer.id);
    updateGameState();
  };

  const handleNextTurn = () => {
    gameManager.nextTurn();
    updateGameState();
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentTeam = gameState.teams.find((t) => t.id === currentPlayer.teamId);
  const discardPileTop = gameState.discardPile[gameState.discardPile.length - 1];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Samba Canasta</Text>
        <Text style={styles.roundText}>Round {gameState.round}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Player Info */}
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{currentPlayer.name}</Text>
          <Text style={styles.teamName}>
            {currentTeam?.name} - Score: {currentTeam?.score || 0}
          </Text>
          <Text style={styles.requirement}>
            Going Down: {gameState.goingDownRequirement} pts
            {currentTeam?.hasGoneDown && ' ✓'}
          </Text>
        </View>

        {/* Stock Pile */}
        <View style={styles.stockInfo}>
          <Text style={styles.stockText}>
            Stock Pile: {gameState.stockPile.length} cards
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleDrawFromStock}>
            <Text style={styles.buttonText}>Draw 3 Cards</Text>
          </TouchableOpacity>
        </View>

        {/* Discard Pile */}
        {discardPileTop && (
          <View style={styles.discardPile}>
            <Text style={styles.sectionTitle}>
              Discard Pile ({gameState.discardPile.length})
              {gameState.isDiscardPileBlocked && ' 🚫'}
            </Text>
            <CardComponent card={discardPileTop} size="medium" />
          </View>
        )}

        {/* Team Melds */}
        {currentTeam && currentTeam.melds.length > 0 && (
          <View style={styles.meldsSection}>
            <Text style={styles.sectionTitle}>Team Melds</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {currentTeam.melds.map((meld) => (
                <MeldComponent key={meld.id} meld={meld} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Red Threes */}
        {currentTeam && currentTeam.redThrees.length > 0 && (
          <View style={styles.redThreesSection}>
            <Text style={styles.sectionTitle}>
              Red Threes (+{currentTeam.redThrees.length * 100})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {currentTeam.redThrees.map((card) => (
                <CardComponent key={card.id} card={card} size="small" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Player Hand 1 */}
        <HandComponent
          cards={currentPlayer.hand1}
          title="Hand 1"
          onCardPress={handleDiscard}
        />

        {/* Player Hand 2 */}
        {currentPlayer.hand2 && !currentPlayer.hasPickedHand2 && (
          <View style={styles.hand2Section}>
            <Text style={styles.sectionTitle}>Hand 2 (Face Down)</Text>
            <TouchableOpacity style={styles.button} onPress={handlePickupHand2}>
              <Text style={styles.buttonText}>Pick Up Hand 2</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Set Aside Cards */}
        {currentPlayer.setAsideCards.length > 0 && (
          <HandComponent
            cards={currentPlayer.setAsideCards}
            title="Set Aside (Available Next Turn)"
          />
        )}

        {/* Game Log */}
        <View style={styles.logSection}>
          <Text style={styles.sectionTitle}>Game Log</Text>
          <ScrollView style={styles.log}>
            {gameState.gameLog.slice(-10).map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleNextTurn}>
          <Text style={styles.footerButtonText}>End Turn</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B5E20',
  },
  header: {
    padding: 16,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  roundText: {
    fontSize: 16,
    color: 'white',
  },
  content: {
    flex: 1,
  },
  playerInfo: {
    padding: 16,
    backgroundColor: '#388E3C',
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  teamName: {
    fontSize: 16,
    color: 'white',
    marginTop: 4,
  },
  requirement: {
    fontSize: 14,
    color: '#C8E6C9',
    marginTop: 4,
  },
  stockInfo: {
    padding: 16,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  discardPile: {
    padding: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  meldsSection: {
    padding: 16,
  },
  redThreesSection: {
    padding: 16,
  },
  hand2Section: {
    padding: 16,
    alignItems: 'center',
  },
  logSection: {
    padding: 16,
    backgroundColor: '#2E7D32',
    marginTop: 16,
  },
  log: {
    maxHeight: 150,
  },
  logText: {
    fontSize: 12,
    color: 'white',
    marginVertical: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: '#2E7D32',
  },
  footerButton: {
    backgroundColor: '#FFC107',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
