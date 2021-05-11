import React from 'react';
import {StyleSheet, View} from 'react-native';

import VideoPlayer from '../components/VideoPlayer';
import Header from '../components/Header';

const Home = () => {
  return (
    <View style={styles.homeContainer}>
      <Header />
      <VideoPlayer
        videoUrl={
          'https://4h2tfsep2xsldc.data.mediastore.eu-central-1.amazonaws.com/Holadeck/main_720p60.m3u8'
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
  },
});

export default Home;
