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
import { InfoDrawer } from '../components/InfoDrawer';
import { Card } from '../types';

export const GameScreen: React.FC = () => {
  const [gameManager] = useState(() => new GameManager());
  const [gameState, setGameState] = useState(gameManager.getState());

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
      'Discard ' + card.getDisplayName() + '?',
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
        <InfoDrawer
          playerName={currentPlayer.name}
          teamName={currentTeam?.name || ''}
          teamScore={currentTeam?.score || 0}
          requirement={gameState.goingDownRequirement.toString()}
          hasGoneDown={currentTeam?.hasGoneDown || false}
          gameLogs={gameState.gameLog}
        />

        <View style={styles.stockInfo}>
          <Text style={styles.stockText}>
            Stock: {gameState.stockPile.length} cards
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleDrawFromStock}>
            <Text style={styles.buttonText}>Draw 3 Cards</Text>
          </TouchableOpacity>
        </View>

        {discardPileTop && (
          <View style={styles.discardPile}>
            <Text style={styles.sectionTitle}>
              Discard ({gameState.discardPile.length})
              {gameState.isDiscardPileBlocked && ' 🚫'}
            </Text>
            <CardComponent card={discardPileTop} size="medium" />
          </View>
        )}

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

        {currentTeam && currentTeam.redThrees.length > 0 && (
          <View style={styles.redThreesSection}>
            <Text style={styles.sectionTitle}>
              Red 3s (+{currentTeam.redThrees.length * 100})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {currentTeam.redThrees.map((card) => (
                <CardComponent key={card.id} card={card} size="small" />
              ))}
            </ScrollView>
          </View>
        )}

        <HandComponent
          cards={currentPlayer.hand1}
          title="Your Hand"
          onCardPress={handleDiscard}
        />
      </ScrollView>

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
