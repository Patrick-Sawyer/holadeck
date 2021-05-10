import React, {useState, useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../Colors';

const VideoPlayer = ({videoUrl}) => {
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [bufferPostion, setBufferPostion] = useState(0);
  const playerRef = useRef(null);
  const [timelineWidth, setTimelineWidth] = useState(400);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoHeight, setVideoHeight] = useState(
    (Dimensions.get('screen').width * 9) / 16,
  );

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

  const controls = () => {
    return (
      <View style={styles.controls}>
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
      </View>
    );
  };

  const timeToText = seconds => {
    let substringStart = duration >= 3600 ? 11 : 14;
    let substringLength = duration >= 3600 ? 8 : 5;
    return new Date(seconds * 1000)
      .toISOString()
      .substr(substringStart, substringLength);
  };

  const onProgress = test => {
    setLoading(false);
    const {seekableDuration, playableDuration, currentTime} = test;
    setPosition(currentTime);
    setBufferPostion(playableDuration);
    if (seekableDuration !== duration) {
      setDuration(seekableDuration);
    }
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

  const timeline = () => {
    return (
      <TouchableWithoutFeedback
        onPress={evt => {
          const clickPosition = evt.nativeEvent.locationX;
          const newPosition = (clickPosition * duration) / timelineWidth;
          if (duration > 1) {
            setBufferPostion(newPosition);
            setPosition(newPosition);
            playerRef.current.seek(newPosition, 1000);
            setBufferPostion(newPosition);
            setPosition(newPosition);
          }
        }}>
        <View
          onLayout={evt => {
            const width = evt.nativeEvent.layout.width;
            setTimelineWidth(width);
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
      </TouchableWithoutFeedback>
    );
  };

  const loadingIcon = () => {
    if (loading && !paused) {
      return <ActivityIndicator size="large" color={Colors.lab4} />;
    }
  };

  return (
    <View
      style={styles.videoPlayerContainer}
      onLayout={evt => {
        const width = evt.nativeEvent.layout.width;
        setVideoHeight((width * 9) / 16);
      }}>
      <View style={styles.videoPlayerContainer}>
        <Video
          source={{uri: videoUrl}}
          ref={playerRef}
          style={[styles.video, {height: videoHeight}]}
          resizeMode="contain"
          paused={paused}
          onProgress={onProgress}
          muted={muted}
          progressUpdateInterval={1000}
          onEnd={() => {
            setPosition(duration);
            setPaused(true);
          }}
          onLoad={() => {
            setLoading(false);
          }}
          onPlaybackRateChange={() => {
            setLoading(false);
          }}
          onSeek={() => {
            setLoading(false);
          }}
        />
        <View style={styles.loadingIcon}>{loadingIcon()}</View>
      </View>
      {controls()}
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
    borderBottomWidth: 2,
    borderColor: Colors.lab2,
    marginBottom: 10,
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
});

export default VideoPlayer;
