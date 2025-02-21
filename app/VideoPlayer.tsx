import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface VideoPlayerProps {
  videoSource: string | null;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSource, onClose }) => {
  const player = useVideoPlayer(videoSource || '', (playerInstance) => {
    playerInstance.loop = true;
    playerInstance.play();
  });

  const isPlaying = useSharedValue(player.playing);

  useDerivedValue(() => {
    isPlaying.value = player.playing;
  }, [player.playing]);

  return (
    <Modal visible={!!videoSource} animationType="slide">
      <View style={styles.modalContainer}>
        <VideoView
          style={styles.videoPlayer}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => (isPlaying ? player.pause() : player.play())}>
            <Text style={styles.controlButton}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.controlButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: width * 0.9,
    height: height * 0.5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  controlButton: {
    color: '#BB86FC',
    fontSize: 16,
  },
});

export default VideoPlayer;