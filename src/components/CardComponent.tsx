import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Suit, Rank } from '../types';

interface CardComponentProps {
  card: Card;
  onPress?: () => void;
  selected?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onPress,
  selected = false,
  size = 'medium',
}) => {
  const getSuitSymbol = (suit: Suit): string => {
    switch (suit) {
      case Suit.SPADES:
        return '♠';
      case Suit.HEARTS:
        return '♥';
      case Suit.DIAMONDS:
        return '♦';
      case Suit.CLUBS:
        return '♣';
      default:
        return '';
    }
  };

  const getRankDisplay = (rank: Rank): string => {
    switch (rank) {
      case Rank.ACE:
        return 'A';
      case Rank.JACK:
        return 'J';
      case Rank.QUEEN:
        return 'Q';
      case Rank.KING:
        return 'K';
      case Rank.TWO:
        return '2';
      case Rank.THREE:
        return '3';
      case Rank.FOUR:
        return '4';
      case Rank.FIVE:
        return '5';
      case Rank.SIX:
        return '6';
      case Rank.SEVEN:
        return '7';
      case Rank.EIGHT:
        return '8';
      case Rank.NINE:
        return '9';
      case Rank.TEN:
        return '10';
      default:
        return '';
    }
  };

  const isRed = card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS;
  const isJoker = card.rank === Rank.JOKER;
  
  const sizeStyles = {
    small: { width: 50, height: 70, fontSize: 14 },
    medium: { width: 60, height: 84, fontSize: 18 },
    large: { width: 80, height: 112, fontSize: 24 },
  };
  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { width: currentSize.width, height: currentSize.height },
        isJoker && styles.jokerCard,
        selected && styles.selected,
        card.isRedThree && styles.redThree,
        card.isBlackThree && styles.blackThree,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {isJoker ? (
        <View style={styles.jokerContainer}>
          <Text style={styles.jesterHat}>🎭</Text>
          <Text style={styles.jokerText}>JOKER</Text>
        </View>
      ) : (
        <View style={styles.cardContent}>
          <Text style={[styles.rank, { fontSize: currentSize.fontSize }, isRed ? styles.redText : styles.blackText]}>
            {getRankDisplay(card.rank)}
          </Text>
          <Text style={[styles.suit, { fontSize: currentSize.fontSize + 4 }, isRed ? styles.redText : styles.blackText]}>
            {getSuitSymbol(card.suit)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    padding: 4,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jokerCard: {
    borderColor: '#FF9800',
    borderWidth: 3,
    backgroundColor: '#FFF3E0',
  },
  jokerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  jesterHat: {
    fontSize: 32,
    marginBottom: 2,
  },
  jokerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  selected: {
    borderColor: '#4CAF50',
    borderWidth: 4,
    backgroundColor: '#E8F5E9',
    transform: [{ translateY: -10 }],
  },
  redThree: {
    backgroundColor: '#FFEBEE',
    borderColor: '#C62828',
  },
  blackThree: {
    backgroundColor: '#EEEEEE',
    borderColor: '#424242',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rank: {
    fontWeight: 'bold',
  },
  suit: {
    marginTop: 2,
  },
  redText: {
    color: '#D32F2F',
  },
  blackText: {
    color: '#000',
  },
});
