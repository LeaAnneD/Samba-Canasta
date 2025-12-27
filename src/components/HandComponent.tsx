import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../types';
import { CardComponent } from './CardComponent';

interface HandComponentProps {
  cards: Card[];
  title: string;
  onCardPress?: (card: Card) => void;
  multiSelect?: boolean;
  showCardCount?: boolean;
}

export const HandComponent: React.FC<HandComponentProps> = ({
  cards,
  title,
  onCardPress,
  multiSelect = false,
  showCardCount = true,
}) => {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const handleCardPress = (card: Card) => {
    if (!onCardPress) return;

    if (multiSelect) {
      const newSelected = new Set(selectedCards);
      if (newSelected.has(card.id)) {
        newSelected.delete(card.id);
      } else {
        newSelected.add(card.id);
      }
      setSelectedCards(newSelected);
    }

    onCardPress(card);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showCardCount && (
          <Text style={styles.cardCount}>{cards.length} cards</Text>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer}
      >
        {cards.length === 0 ? (
          <Text style={styles.emptyText}>No cards</Text>
        ) : (
          cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onPress={() => handleCardPress(card)}
              selected={selectedCards.has(card.id)}
              size="medium"
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cardCount: {
    fontSize: 14,
    color: 'white',
  },
  scrollView: {
    backgroundColor: '#E3F2FD',
  },
  cardsContainer: {
    padding: 8,
    flexDirection: 'row',
  },
  emptyText: {
    padding: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
