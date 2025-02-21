import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Video } from '@/store/VideoStore';

const { width, height } = Dimensions.get('window');

interface VideoPlayerProps {
  videoSource: string | null;
  videoDetails: Video | null;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSource, videoDetails, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(videoSource || '', (playerInstance) => {
    playerInstance.loop = true;
    playerInstance.play();
  });

  useEffect(() => {
    if (player) {
      player.play();
      setIsPlaying(true);
    }
    return () => {
      player?.pause();
    };
  }, [player]);

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Modal visible={!!videoSource} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <VideoView
          style={styles.videoPlayer}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
        <View style={styles.videoDetails}>
          <Text style={styles.videoTitle}>{videoDetails?.title}</Text>
          <Text style={styles.videoStats}>{videoDetails?.likes} Likes • {videoDetails?.views} Views</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayPause}>
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
  videoDetails: {
    marginTop: 20,
    alignItems: 'center',
  },
  videoTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoStats: {
    color: '#AAA',
    fontSize: 14,
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