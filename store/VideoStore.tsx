import { makeAutoObservable, runInAction } from "mobx";
import { apiService } from "@/utils/api";
import { authStore } from "./AuthStore";
import Toast from "react-native-toast-message";

export interface Video {
  id: string;
  title: string;
  likes: number;
  views: number;
  thumbnail: string;
  videoSource: string;
  userId: string;
  comments: Comment[];
  isBookmarked: boolean;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  videoId: string;
}

class VideoStore {
  videos: Video[] = [];
  loading: boolean = false;
  currentVideo: string | null = null;
  currentVideoDetails: Video | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Set the current video for playback
  setCurrentVideo(videoSource: string | null, videoDetails: Video | null) {
    runInAction(() => {
      this.currentVideo = videoSource;
      this.currentVideoDetails = videoDetails;
    });
  }

  // Fetch all videos
  async fetchVideos() {
    this.loading = true;
    try {
      const videos = await apiService.getAllVideos();
      runInAction(() => {
        this.videos = videos;
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to fetch videos." });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Action to update videos with thumbnails
  updateVideosWithThumbnails(updatedVideos: Video[]) {
    this.videos = updatedVideos;
  }

  // // Set the current video for playback
  // setCurrentVideo(videoSource: string | null) {
  //   runInAction(() => {
  //     this.currentVideo = videoSource;
  //   });
  // }

  // Like a video
  async likeVideo(videoId: string) {
    try {
      const updatedVideo = await apiService.likeVideo(videoId);
      runInAction(() => {
        this.videos = this.videos.map((video) =>
          video.id === videoId ? { ...video, likes: updatedVideo.likes } : video
        );
      });
      Toast.show({ type: "success", text1: "Success", text2: "Video liked!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to like video." });
    }
  }

  // Add a comment to a video
  async addComment(videoId: string, text: string) {
    try {
      const newComment = await apiService.addComment(videoId, text);
      runInAction(() => {
        const video = this.videos.find((video) => video.id === videoId);
        if (video) {
          video.comments.push(newComment);
        }
      });
      Toast.show({ type: "success", text1: "Success", text2: "Comment added!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to add comment." });
    }
  }

  // Bookmark a video
  async bookmarkVideo(videoId: string) {
    try {
      const updatedVideo = await apiService.bookmarkVideo(videoId);
      runInAction(() => {
        this.videos = this.videos.map((video) =>
          video.id === videoId ? { ...video, isBookmarked: updatedVideo.isBookmarked } : video
        );
      });
      Toast.show({ type: "success", text1: "Success", text2: "Video bookmarked!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to bookmark video." });
    }
  }

  // Upload a new video
  async uploadVideo(file: any, title: string) {
    const userId = authStore.user?.id;
    if (!userId) {
      Toast.show({ type: "error", text1: "Error", text2: "You must be logged in to upload a video." });
      return;
    }

    this.loading = true;
    try {
      const videoData = await apiService.uploadVideo(file, title, userId);
      runInAction(() => {
        this.videos.unshift(videoData); // Add the new video to the top of the list
      });
      Toast.show({ type: "success", text1: "Success", text2: "Video uploaded successfully!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to upload video." });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const videoStore = new VideoStore();