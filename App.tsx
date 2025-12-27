import React from 'react';
import { StatusBar } from 'react-native';
import { GameScreen } from './src/screens/GameScreen';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <GameScreen />
    </>
  );
};

export default App;
