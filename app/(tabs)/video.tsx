import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Alert,
  Share,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useStores } from '@/store/MobxContext';
import { observer } from 'mobx-react-lite';
import VideoPlayer from '@/components/VideoPlayer';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Video } from '@/store/VideoStore';

const { width, height } = Dimensions.get('window');

const Videostream = observer(() => {
  const { videoStore, authStore } = useStores();
  const [showTooltip, setShowTooltip] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Fetch videos on component mount
  useEffect(() => {
    videoStore.fetchVideos();
  }, []);

  // Generate video thumbnails
  useEffect(() => {
    const generateThumbnails = async () => {
      const updatedVideos = await Promise.all(
        videoStore.videos.map(async (video: Video) => {
          if (!video.thumbnail) {
            try {
              const { uri } = await VideoThumbnails.getThumbnailAsync(video.videoSource, {
                time: 15000,
              });
              return { ...video, thumbnail: uri };
            } catch (e) {
              console.warn(e);
            }
          }
          return video;
        })
      );
      videoStore.updateVideosWithThumbnails(updatedVideos);
    };
    generateThumbnails();
  }, [videoStore.videos]);

  const addNewVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      Alert.alert('Info', 'Camera functionality coming soon!');
    } else {
      Alert.alert('Error', 'Camera permission denied');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      await videoStore.uploadVideo(file, "New Video");
    }
  };

  const createPost = () => {
    Alert.alert('Info', 'Post functionality coming soon!');
  };

  const shareVideo = (videoSource: string) => {
    Share.share({
      message: `Check out this video: ${videoSource}`,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search videos..."
          placeholderTextColor="#AAA"
        />
        <Entypo name="menu" size={28} color="#FFF" />
      </View>

       {/* Video List */}
       <ScrollView contentContainerStyle={styles.videoList}>
        {videoStore.videos.map((video: Video) => (
          <View key={video.id} style={styles.videoCard}>
            <TouchableOpacity onPress={() => videoStore.setCurrentVideo(video.videoSource, video)}>
              <Image
                source={{ uri: video.thumbnail || 'https://via.placeholder.com/300' }}
                style={styles.videoThumbnail}
              />
              <Text style={styles.videoTitle}>{video.title}</Text>
            </TouchableOpacity>
            <View style={styles.videoActions}>
              <TouchableOpacity onPress={() => videoStore.likeVideo(video.id)}>
                <Entypo name="heart" size={20} color="#BB86FC" />
                <Text style={styles.actionText}>{video.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => videoStore.addComment(video.id, commentText)}>
                <EvilIcons name="comment" size={24} color="#BB86FC" />
                <Text style={styles.actionText}>{video.comments.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => videoStore.bookmarkVideo(video.id)}>
                <FontAwesome name="bookmark-o" size={20} color="#BB86FC" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => shareVideo(video.videoSource)}>
                <EvilIcons name="share-google" size={24} color="#BB86FC" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Video Player */}
      <VideoPlayer
        videoSource={videoStore.currentVideo}
        videoDetails={videoStore.currentVideoDetails}
        onClose={() => videoStore.setCurrentVideo(null, null)}
      />

      {/* Floating Action Button with Tooltip */}
      <View style={styles.fabContainer}>
        {showTooltip && (
          <View style={styles.tooltip}>
            <TouchableOpacity style={styles.tooltipItem} onPress={addNewVideo}>
              <Ionicons name="videocam" size={24} color="#BB86FC" />
              <Text style={styles.tooltipText}>Go Live</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tooltipItem} onPress={pickImage}>
              <Ionicons name="image" size={24} color="#BB86FC" />
              <Text style={styles.tooltipText}>Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tooltipItem} onPress={createPost}>
              <MaterialCommunityIcons name="leaf" size={24} color="#BB86FC" />
              <Text style={styles.tooltipText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowTooltip(!showTooltip)}
        >
          <Entypo name="plus" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#FFF',
  },
  videoList: {
    padding: 10,
  },
  videoCard: {
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 10,
  },
  videoThumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  videoTitle: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16,
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 50,
  },
  tooltip: {
    position: 'absolute',
    bottom: 70,
    right: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 10,
  },
  tooltipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tooltipText: {
    marginLeft: 10,
    color: '#FFF',
  },
});

export default Videostream;