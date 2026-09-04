import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';

interface InfoDrawerProps {
  playerName: string;
  teamName: string;
  teamScore: number;
  requirement: string;
  hasGoneDown: boolean;
  gameLogs: string[];
}

export const InfoDrawer: React.FC<InfoDrawerProps> = ({
  playerName,
  teamName,
  teamScore,
  requirement,
  hasGoneDown,
  gameLogs,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TouchableOpacity 
        style={styles.drawerButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.drawerButtonText}>ℹ️ Info & Log</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.drawerContainer}>
            <View style={styles.handle} />
            
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{playerName}</Text>
              <Text style={styles.teamInfo}>
                {teamName} - Score: {teamScore}
              </Text>
              <Text style={styles.requirement}>
                Going Down: {requirement} pts {hasGoneDown && '✓'}
              </Text>
            </View>

            <View style={styles.logSection}>
              <Text style={styles.logTitle}>Game Log</Text>
              <ScrollView style={styles.logScroll}>
                {gameLogs.slice(-20).reverse().map((log, index) => (
                  <Text key={index} style={styles.logText}>
                    {log}
                  </Text>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  drawerButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  drawerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    backgroundColor: '#2E7D32',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#C8E6C9',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  playerInfo: {
    padding: 16,
    backgroundColor: '#388E3C',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  teamInfo: {
    fontSize: 16,
    color: 'white',
    marginTop: 4,
  },
  requirement: {
    fontSize: 14,
    color: '#C8E6C9',
    marginTop: 4,
  },
  logSection: {
    flex: 1,
    backgroundColor: '#1B5E20',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 12,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  logScroll: {
    maxHeight: 300,
  },
  logText: {
    fontSize: 12,
    color: 'white',
    marginVertical: 2,
  },
  closeButton: {
    backgroundColor: '#FFC107',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
