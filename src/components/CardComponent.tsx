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
      case Suit.JOKER:
        return '🃏';
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
      case Rank.JOKER:
        return 'JKR';
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

  const isRed =
    card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS;

  const sizeStyles = {
    small: { width: 40, height: 56 },
    medium: { width: 60, height: 84 },
    large: { width: 80, height: 112 },
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        sizeStyles[size],
        selected && styles.selected,
        card.isRedThree && styles.redThree,
        card.isBlackThree && styles.blackThree,
        card.isWild && styles.wild,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.cardContent}>
        <Text
          style={[
            styles.rank,
            isRed ? styles.redText : styles.blackText,
            size === 'small' && styles.smallText,
          ]}
        >
          {getRankDisplay(card.rank)}
        </Text>
        <Text
          style={[
            styles.suit,
            isRed ? styles.redText : styles.blackText,
            size === 'small' && styles.smallSuit,
          ]}
        >
          {getSuitSymbol(card.suit)}
        </Text>
        {card.isWild && (
          <View style={styles.wildBadge}>
            <Text style={styles.wildText}>W</Text>
          </View>
        )}
        {card.value > 0 && (
          <Text style={styles.value}>{card.value}</Text>
        )}
      </View>
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
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selected: {
    borderColor: '#4CAF50',
    borderWidth: 3,
    backgroundColor: '#E8F5E9',
  },
  redThree: {
    backgroundColor: '#FFEBEE',
    borderColor: '#C62828',
  },
  blackThree: {
    backgroundColor: '#EEEEEE',
    borderColor: '#424242',
  },
  wild: {
    borderColor: '#FF9800',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  suit: {
    fontSize: 24,
  },
  smallText: {
    fontSize: 14,
  },
  smallSuit: {
    fontSize: 16,
  },
  redText: {
    color: '#D32F2F',
  },
  blackText: {
    color: '#000',
  },
  wildBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wildText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  value: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    fontSize: 10,
    color: '#666',
  },
});
