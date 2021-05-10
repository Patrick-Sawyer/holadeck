import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {NativeRouter, Route} from 'react-router-native';

import Home from './src/pages/Home';
import Colors from './src/Colors';

const App = () => {
  // const [isLoaded] = useFonts({
  //   BringThaNoize: require('./assets/fonts/bring-tha-noize/bringthanoize.ttf'),
  //   Neuropol: require('./assets/fonts/neuropol/neuropol.ttf'),
  //   Projects: require('./assets/fonts/projects/projects.ttf'),
  //   Verela: require('./assets/fonts/varela-round/VarelaRound-Regular.ttf'),
  //   Zekton: require('./assets/fonts/zekton-free/zektonrg.ttf'),
  //   Zorque: require('./assets/fonts/zorque/zorque.ttf'),
  // });
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.darkGrey} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}>
        <NativeRouter>
          <Route exact path="/" component={Home} />
        </NativeRouter>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.darkGrey,
    flexGrow: 1,
  },
  scroll: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});

export default App;
