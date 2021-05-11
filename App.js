import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import {NativeRouter, Route} from 'react-router-native';

import Home from './src/pages/Home';
import Colors from './src/Colors';

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        // hidden={isFullScreen}
        barStyle={'light-content'}
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
