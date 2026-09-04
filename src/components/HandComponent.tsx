import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from '../types';
import { CardComponent } from './CardComponent';

interface HandComponentProps {
  cards: Card[];
  title: string;
  onCardPress?: (card: Card) => void;
  showCardCount?: boolean;
  allowOrganizing?: boolean;
}

export const HandComponent: React.FC<HandComponentProps> = ({
  cards,
  title,
  onCardPress,
  showCardCount = true,
  allowOrganizing = true,
}) => {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [manualOrder, setManualOrder] = useState<Card[]>([...cards]);

  React.useEffect(() => {
    setManualOrder([...cards]);
  }, [cards]);

  const handleCardPress = (card: Card) => {
    if (allowOrganizing) {
      const newSelected = new Set(selectedCards);
      if (newSelected.has(card.id)) {
        newSelected.delete(card.id);
      } else {
        newSelected.add(card.id);
      }
      setSelectedCards(newSelected);
    } else if (onCardPress) {
      onCardPress(card);
    }
  };

  const moveSelectedLeft = () => {
    if (selectedCards.size === 0) return;
    const newOrder = [...manualOrder];
    const firstSelectedIndex = newOrder.findIndex(c => selectedCards.has(c.id));
    if (firstSelectedIndex > 0) {
      const selected = newOrder.filter(c => selectedCards.has(c.id));
      const others = newOrder.filter(c => !selectedCards.has(c.id));
      const insertIndex = Math.max(0, firstSelectedIndex - 1);
      others.splice(insertIndex, 0, ...selected);
      setManualOrder(others);
    }
  };

  const moveSelectedRight = () => {
    if (selectedCards.size === 0) return;
    const newOrder = [...manualOrder];
    const lastSelectedIndex = [...newOrder].reverse().findIndex(c => selectedCards.has(c.id));
    const actualIndex = newOrder.length - 1 - lastSelectedIndex;
    if (actualIndex < newOrder.length - 1) {
      const selected = newOrder.filter(c => selectedCards.has(c.id));
      const others = newOrder.filter(c => !selectedCards.has(c.id));
      const insertIndex = Math.min(others.length, actualIndex + 2);
      others.splice(insertIndex, 0, ...selected);
      setManualOrder(others);
    }
  };

  const clearSelection = () => {
    setSelectedCards(new Set());
  };

  const discardSelected = () => {
    if (selectedCards.size === 1 && onCardPress) {
      const card = manualOrder.find(c => selectedCards.has(c.id));
      if (card) {
        onCardPress(card);
        setSelectedCards(new Set());
      }
    }
  };

  const renderCardsInRows = () => {
    const rows = [];
    const cardsPerRow = 6;
    
    for (let i = 0; i < manualOrder.length; i += cardsPerRow) {
      const rowCards = manualOrder.slice(i, i + cardsPerRow);
      rows.push(
        <View key={i} style={styles.cardRow}>
          {rowCards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onPress={() => handleCardPress(card)}
              selected={selectedCards.has(card.id)}
              size="medium"
            />
          ))}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showCardCount && (
          <Text style={styles.cardCount}>{cards.length} cards</Text>
        )}
      </View>

      {selectedCards.size > 0 && (
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolButton} onPress={moveSelectedLeft}>
            <Text style={styles.toolButtonText}>⬅️ Move Left</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton} onPress={clearSelection}>
            <Text style={styles.toolButtonText}>Clear ({selectedCards.size})</Text>
          </TouchableOpacity>
          {selectedCards.size === 1 && onCardPress && (
            <TouchableOpacity style={[styles.toolButton, styles.discardButton]} onPress={discardSelected}>
              <Text style={styles.toolButtonText}>Discard</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.toolButton} onPress={moveSelectedRight}>
            <Text style={styles.toolButtonText}>Move Right ➡️</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer}
      >
        {manualOrder.length === 0 ? (
          <Text style={styles.emptyText}>No cards</Text>
        ) : (
          renderCardsInRows()
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
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#1976D2',
  },
  toolButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  discardButton: {
    backgroundColor: '#F44336',
  },
  toolButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  scrollView: {
    backgroundColor: '#E3F2FD',
    maxHeight: 400,
  },
  cardsContainer: {
    padding: 8,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  emptyText: {
    padding: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
