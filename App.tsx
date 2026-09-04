import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameScreen } from './src/screens/GameScreen';

const App: React.FC = () => {
  return (
    <>
      <StatusBar style="light" />
      <GameScreen />
    </>
  );
};

export default App;
