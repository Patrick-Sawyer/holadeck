import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Colors from '../Colors';

const Header = () => {
  return (
    <View>
      <View style={styles.title}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.titleText}>
          holadeck
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.lab3,
  },
  titleText: {
    fontSize: 50,
    color: Colors.white,
    fontFamily: 'neuropol',
  },
  border: {
    height: 10,
  },
});

export default Header;
