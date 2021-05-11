import React, {useState, useRef, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  Animated,
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../Colors';

const VideoPlayer = ({videoUrl}) => {
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [bufferPostion, setBufferPostion] = useState(0);
  const playerRef = useRef(null);
  const [timelineWidth, setTimelineWidth] = useState(400);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullScreen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [touchInProgress, setTouchInProgress] = useState(false);
  const controlsOffset = useRef(new Animated.Value(0)).current;

  const playOrPauseIcon = () => {
    let icon = paused ? 'play-circle-outline' : 'pause-circle-outline';
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setPaused(!paused);
        }}>
        <Icon name={icon} size={40} color={Colors.lab7} />
      </TouchableWithoutFeedback>
    );
  };

  const skipBackButton = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          playerRef.current.seek(0, 0);
          setPosition(0);
          setPaused(false);
        }}>
        <Icon name={'skip-backward'} size={40} color={Colors.lab7} />
      </TouchableWithoutFeedback>
    );
  };

  const animateControlsOffset = (toValue, time) => {
    Animated.timing(controlsOffset, {
      toValue: toValue,
      duration: time,
      useNativeDriver: true,
    }).start();
  };

  const controls = () => {
    return (
      <Animated.View
        style={[
          styles.controls,
          fullscreen && styles.absolute,
          fullscreen && {
            transform: [{translateY: controlsOffset}],
          },
        ]}>
        {skipBackButton()}
        {playOrPauseIcon()}
        <Text style={[styles.positionText, duration >= 3600 && styles.wider]}>
          {timeToText(position)}
        </Text>
        {timeline()}
        <Text style={[styles.positionText, duration >= 3600 && styles.wider]}>
          {timeToText(duration)}
        </Text>
        {muteButton()}
        {fullScreenButton()}
      </Animated.View>
    );
  };

  const timeToText = seconds => {
    let substringStart = duration >= 3600 ? 11 : 14;
    let substringLength = duration >= 3600 ? 8 : 5;
    return new Date(seconds * 1000)
      .toISOString()
      .substr(substringStart, substringLength);
  };

  const onProgress = data => {
    if (!touchInProgress) {
      const {playableDuration, currentTime} = data;
      setPosition(currentTime);
      setBufferPostion(playableDuration);
    }
  };

  const fullScreenButton = () => {
    let icon = fullscreen ? 'fullscreen-exit' : 'fullscreen';
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          hideControlsInAFewSeconds(true);
          setFullScreen(!fullscreen);
          setModalVisible(!fullscreen);
        }}>
        <Icon name={icon} size={40} color={Colors.lab7} />
      </TouchableWithoutFeedback>
    );
  };

  const muteButton = () => {
    let icon = muted ? 'volume-mute' : 'volume-high';
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setMuted(!muted);
        }}>
        <Icon name={icon} size={40} color={Colors.lab7} />
      </TouchableWithoutFeedback>
    );
  };

  const handleTouch = (evt, bool) => {
    if (bool) {
      setTouchInProgress(true);
    } else {
      setTimeout(() => {
        setTouchInProgress(false);
      }, 500);
    }
    const {locationX, pageX} = evt.nativeEvent;
    const newPosition =
      locationX < pageX ? (locationX * duration) / timelineWidth : position;
    if (!bool) {
      setBufferPostion(newPosition);
      setPosition(newPosition);
      playerRef.current.seek(newPosition, 1000);
      setBufferPostion(newPosition);
    }
    if (locationX < pageX) {
      setPosition(newPosition);
    }
  };

  const timeline = () => {
    return (
      <View
        onLayout={evt => {
          const width = evt.nativeEvent.layout.width;
          setTimelineWidth(width);
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        accessibilityRole={'adjustable'}
        onResponderGrant={evt => {
          handleTouch(evt, true);
        }}
        onResponderMove={evt => {
          handleTouch(evt, true);
        }}
        onResponderRelease={evt => {
          handleTouch(evt, false);
          setLoading(true);
        }}
        style={styles.grow}>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineInnerContainer}>
            <View style={[styles.timeline, styles.timelineBase]} />
            <View
              style={[
                styles.timeline,
                {
                  width: (bufferPostion * 100) / duration + '%',
                  backgroundColor: Colors.lab5,
                },
              ]}
            />
            <View
              style={[
                styles.timeline,
                {
                  width: (position * 100) / duration + '%',
                  backgroundColor: Colors.lab3,
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  const loadingIcon = () => {
    if (loading && !paused) {
      return <ActivityIndicator size="large" color={Colors.lab4} />;
    }
  };

  const handleClickOnVideo = () => {
    setPaused(!paused);
    hideControlsInAFewSeconds();
  };

  const hideControlsInAFewSeconds = bool => {
    animateControlsOffset(0, 0);
    if (fullscreen || bool) {
      setTimeout(() => {
        if (fullscreen) {
          animateControlsOffset(60, 3000);
        }
      }, 5000);
    }
  };

  const videoObject = (
    <View style={styles.fullSize}>
      <TouchableWithoutFeedback onPress={handleClickOnVideo}>
        <View style={styles.videoPlayerContainer}>
          <Video
            source={{uri: videoUrl}}
            ref={playerRef}
            style={[
              styles.video,
              {
                height:
                  (Math.min(
                    Dimensions.get('screen').width,
                    Dimensions.get('screen').height,
                  ) *
                    9) /
                  16,
              },
              fullscreen && styles.fullSize,
            ]}
            resizeMode="contain"
            paused={paused}
            onProgress={onProgress}
            onSeek={() => {
              setLoading(false);
              hideControlsInAFewSeconds();
            }}
            useTextureView={false}
            muted={muted}
            progressUpdateInterval={40}
            onEnd={() => {
              setPosition(duration);
              setPaused(true);
              animateControlsOffset(0, 0);
            }}
            bufferConfig={{
              minBufferMs: paused ? 1000 : 1000,
              maxBufferMs: paused ? 5000 : 50000,
              bufferForPlaybackMs: 1000,
              bufferForPlaybackAfterRebufferMs: 1000,
            }}
            onLoad={data => {
              setDuration(data.duration);
              if (position !== 0) {
                playerRef.current.seek(position, 1000);
              }
              setLoading(false);
              hideControlsInAFewSeconds();
            }}
          />
          <View style={styles.loadingIcon}>{loadingIcon()}</View>
        </View>
      </TouchableWithoutFeedback>
      {controls()}
    </View>
  );

  return (
    <View style={styles.videoPlayerContainer}>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType={'fade'}
        statusBarTranslucent={true}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setFullScreen(false);
        }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalInner}>{videoObject}</View>
        </SafeAreaView>
      </Modal>

      {!fullscreen && videoObject}
    </View>
  );
};

const styles = StyleSheet.create({
  videoPlayerContainer: {
    flex: 1,
  },
  video: {
    width: '100%',
    backgroundColor: 'black',
  },
  controls: {
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  positionText: {
    marginHorizontal: 5,
    color: Colors.lab4,
    width: 40,
    textAlign: 'center',
  },
  timelineContainer: {
    flexGrow: 1,
    alignItems: 'center',
    height: 6,
    overflow: 'hidden',
    marginHorizontal: 5,
    borderRadius: 3,
  },
  timeline: {
    height: 6,
    position: 'absolute',
    left: 0,
    borderRadius: 3,
    overflow: 'hidden',
  },
  timelineBase: {
    backgroundColor: Colors.lab2,
    width: '100%',
  },
  timelineInnerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  wider: {
    width: 60,
  },
  grow: {
    flexGrow: 1,
  },
  loadingIcon: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  modalInner: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fullSize: {width: '100%', height: '100%'},
  absolute: {position: 'absolute', bottom: 0},
  safeArea: {flex: 1, backgroundColor: 'black'},
});

export default VideoPlayer;
