import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Meld, MeldType } from '../types';
import { CardComponent } from './CardComponent';

interface MeldComponentProps {
  meld: Meld;
}

export const MeldComponent: React.FC<MeldComponentProps> = ({ meld }) => {
  const getMeldTypeDisplay = (type: MeldType): string => {
    switch (type) {
      case MeldType.GROUP:
        return 'Group';
      case MeldType.SEQUENCE:
        return 'Sequence';
      case MeldType.DIRTY:
        return 'Dirty';
      case MeldType.WILD_GROUP:
        return 'Wild Group';
      case MeldType.SEVEN_GROUP:
        return 'Seven 7s';
      default:
        return type;
    }
  };

  const getMeldBonus = (): number => {
    if (!meld.isComplete) return 0;

    switch (meld.type) {
      case MeldType.SEQUENCE:
      case MeldType.SEVEN_GROUP:
      case MeldType.WILD_GROUP:
        return 2000;
      case MeldType.GROUP:
        return 500;
      case MeldType.DIRTY:
        return 300;
      default:
        return 0;
    }
  };

  const bonus = getMeldBonus();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.type}>{getMeldTypeDisplay(meld.type)}</Text>
        <Text style={styles.count}>
          {meld.cards.length}/7 {meld.isComplete && '✓'}
        </Text>
        {bonus > 0 && <Text style={styles.bonus}>+{bonus}</Text>}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cards}
      >
        {meld.cards.map((card) => (
          <CardComponent key={card.id} card={card} size="small" />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  type: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  count: {
    fontSize: 12,
    color: '#666',
  },
  bonus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cards: {
    flexDirection: 'row',
    padding: 4,
  },
});
