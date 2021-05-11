import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {NativeRouter, Route} from 'react-router-native';

import Home from './src/pages/Home';
import Colors from './src/Colors';

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={'light-content'}
        showHideTransition={'none'}
        translucent={false}
        backgroundColor={Colors.lab7}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scroll}>
        <NativeRouter>
          <Route exact path="/" component={props => <Home {...props} />} />
        </NativeRouter>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.lab7,
    flexGrow: 1,
  },
  scroll: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});

export default App;
