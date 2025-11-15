/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaBackward,
  FaChalkboardTeacher,
  FaExpand,
  FaForward,
  FaPause,
  FaPlay,
  FaSpinner,
  FaTimes,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (id: string, options: unknown) => {
        destroy: () => void;
        getCurrentTime: () => number;
        getDuration: () => number;
        pauseVideo: () => void;
        playVideo: () => void;
        seekTo: (seconds: number, allowSeekAhead: boolean) => void;
        setPlaybackRate: (rate: number) => void;
        getAvailablePlaybackRates: () => number[];
        getPlaybackRate: () => number;
        setVolume: (volume: number) => void;
      };
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
  }
}

interface ClassData {
  _id: string;
  title: string;
  subject: string;
  videoLink: string;
  instructor: string;
  course: string;
  isActiveLive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ClassVideoPlayer = () => {
  const params = useParams();
  const courseId = params?.courseId as string;
  const subjectName = params?.subjectName as string;
  const classId = params?.classId as string;
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<InstanceType<typeof window.YT.Player> | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const volumeSliderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [availablePlaybackRates, setAvailablePlaybackRates] = useState<
    number[]
  >([]);
  const [showCustomPlay, setShowCustomPlay] = useState(true);
  const [skipNotification, setSkipNotification] = useState<string | null>(null);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [tooltipTime, setTooltipTime] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch class data
  useEffect(() => {
    const fetchClass = async () => {
      if (!courseId || !subjectName || !classId) {
        setError("Missing course ID, subject name, or class ID");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/get-course-classes-videos/${courseId}/${subjectName}`,
          { credentials: "include" }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch class");
        }
        const classData = result.data.find(
          (cls: ClassData) => cls._id === classId && !cls.isActiveLive
        );
        if (!classData) {
          throw new Error("Class not found or is a live class");
        }
        setSelectedClass(classData);
      } catch (err) {
        setError((err as Error).message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [courseId, subjectName, classId]);

  // Full-screen state tracking
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Control bar auto-hide logic
  useEffect(() => {
    if (isPlaying && showControls) {
      controlTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
    return () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  // Update current time while playing
  useEffect(() => {
    if (
      isPlaying &&
      isPlayerReady &&
      playerRef.current &&
      typeof playerRef.current.getCurrentTime === "function"
    ) {
      timeUpdateIntervalRef.current = setInterval(() => {
        setCurrentTime(playerRef.current!.getCurrentTime());
      }, 1000);
    } else if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
    }
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [isPlaying, isPlayerReady]);

  // Update volume when changed or muted
  useEffect(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted, isPlayerReady]);

  // Handle click outside to close speed dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSpeedDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize YouTube player
  useEffect(() => {
    if (!selectedClass?.videoLink) return;
    const videoId = getYouTubeId(selectedClass.videoLink);
    if (!videoId) {
      setError("Invalid video URL");
      return;
    }

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initializePlayer = () => {
      if (!window.YT?.Player) {
        console.error("YouTube Player API not loaded");
        setSkipNotification("Failed to load video player");
        setTimeout(() => setSkipNotification(null), 2000);
        return;
      }
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          origin: window.location.origin,
          enablejsapi: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: (event) => {
            console.error("YouTube Player Error:", event.data);
            setSkipNotification("Video player error occurred");
            setTimeout(() => setSkipNotification(null), 2000);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setIsPlayerReady(false);
    };
  }, [selectedClass]);

  const onPlayerReady = () => {
    if (!playerRef.current) return;
    setShowCustomPlay(true);
    setDuration(playerRef.current.getDuration());
    playerRef.current.setVolume(isMuted ? 0 : volume);
    setIsPlayerReady(true);

    try {
      const rates = playerRef.current.getAvailablePlaybackRates();
      if (rates && rates.length > 0 && rates.includes(1)) {
        setAvailablePlaybackRates(rates);
        const currentRate = playerRef.current.getPlaybackRate() || 1;
        setPlaybackRate(currentRate);
      } else {
        console.warn("No valid playback rates available");
        setAvailablePlaybackRates([1]);
        setPlaybackRate(1);
        setSkipNotification("Speed adjustment unavailable");
        setTimeout(() => setSkipNotification(null), 2000);
      }
    } catch (err) {
      console.error("Error fetching playback rates:", err);
      setAvailablePlaybackRates([1]);
      setPlaybackRate(1);
      setSkipNotification("Speed adjustment unavailable");
      setTimeout(() => setSkipNotification(null), 2000);
    }
  };

  const onPlayerStateChange = (event: { data: number }) => {
    const state = event.data;
    setIsPlaying(state === window.YT?.PlayerState.PLAYING);
    if (state === window.YT?.PlayerState.PLAYING) {
      setShowCustomPlay(false);
      setShowPauseOverlay(true);
      setShowControls(true);
      setTimeout(() => setShowPauseOverlay(false), 5000);
    } else if (
      state === window.YT?.PlayerState.PAUSED ||
      state === window.YT?.PlayerState.ENDED
    ) {
      setShowCustomPlay(true);
      setShowPauseOverlay(false);
      setShowControls(true);
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
    }
  };

  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match?.[1] || null;
  };

  const togglePlay = () => {
    if (!playerRef.current || !isPlayerReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const skipForward = () => {
    if (!playerRef.current || !isPlayerReady) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 10, true);
    setSkipNotification("+10s");
    setTimeout(() => setSkipNotification(null), 1000);
    if (isPlaying) {
      setShowCustomPlay(false);
    }
  };

  const skipBackward = () => {
    if (!playerRef.current || !isPlayerReady) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(Math.max(0, currentTime - 10), true);
    setSkipNotification("-10s");
    setTimeout(() => setSkipNotification(null), 1000);
    if (isPlaying) {
      setShowCustomPlay(false);
    }
  };

  const changeSpeed = (speed: number) => {
    if (!playerRef.current || !isPlayerReady) {
      console.warn("Player not ready for speed change");
      setSkipNotification("Player not ready");
      setTimeout(() => setSkipNotification(null), 2000);
      return;
    }

    if (!availablePlaybackRates.includes(speed)) {
      console.warn(`Speed ${speed}x not supported by video`);
      setSkipNotification(`Speed ${speed}x not supported`);
      setTimeout(() => setSkipNotification(null), 2000);
      return;
    }

    if (speed === playbackRate) {
      return;
    }

    try {
      playerRef.current.setPlaybackRate(speed);

      // Poll to confirm rate change (up to 5 attempts, 300ms intervals)
      let attempts = 0;
      const maxAttempts = 5;
      const checkRate = setInterval(() => {
        attempts++;
        const actualRate = playerRef.current!.getPlaybackRate();

        if (actualRate === speed || attempts >= maxAttempts) {
          clearInterval(checkRate);
          if (actualRate === speed) {
            setPlaybackRate(speed);
            setSkipNotification(`Speed set to ${speed}x`);
            setTimeout(() => setSkipNotification(null), 1000);
          } else {
            console.warn(`Failed to set speed to ${speed}, got ${actualRate}`);
            setSkipNotification(`Speed ${speed}x not applied`);
            setTimeout(() => setSkipNotification(null), 2000);
            setAvailablePlaybackRates((prev) =>
              prev.filter((rate) => rate !== speed)
            ); // Remove unsupported rate
          }
        }
      }, 300);
    } catch (err) {
      console.error(`Error setting playback rate to ${speed}:`, err);
      setSkipNotification(`Failed to set speed ${speed}x`);
      setTimeout(() => setSkipNotification(null), 2000);
    } finally {
      setShowSpeedDropdown(false);
    }
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !isPlayerReady || !videoContainerRef.current)
      return;
    const rect = videoContainerRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const third = width / 3;
    if (clickX > 2 * third) {
      skipForward();
    } else if (clickX < third) {
      skipBackward();
    }
  };

  const toggleFullScreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleInteraction = () => {
    setShowControls(true);
    if (isPlaying && controlTimeoutRef.current) {
      clearTimeout(controlTimeoutRef.current);
      controlTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current || !isPlayerReady) return;
    const newTime = parseFloat(event.target.value);
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
    setTooltipTime(formatTime(newTime));
  };

  const handleTimelineHover = (event: React.MouseEvent<HTMLInputElement>) => {
    if (!playerRef.current || !isPlayerReady || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const width = rect.width;
    const newTime = (offsetX / width) * duration;
    setTooltipTime(formatTime(newTime));
    setTooltipPosition(offsetX);
  };

  const handleTimelineLeave = () => {
    setTooltipTime(null);
    setTooltipPosition(0);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-[#f7374f] mb-4" />
        <p className="text-lg text-gray-600">Loading class data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <p className="text-lg font-medium mb-2">Error loading class</p>
        <p className="text-sm">{error}</p>
        <Link href={`/student-dashboard/courses/${courseId}/${subjectName}`}>
          <button className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2">
            <FaArrowLeft /> Back to Classes
          </button>
        </Link>
      </div>
    );
  }

  if (!selectedClass) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600">Class not found</p>
        <Link href={`/student-dashboard/courses/${courseId}/${subjectName}`}>
          <button className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2">
            <FaArrowLeft /> Back to Classes
          </button>
        </Link>
      </div>
    );
  }

  const videoId = selectedClass.videoLink
    ? getYouTubeId(selectedClass.videoLink)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <style jsx global>{`
        .ytp-chrome-top,
        .ytp-chrome-bottom,
        .ytp-gradient-top,
        .ytp-gradient-bottom,
        .ytp-button,
        .ytp-cards-teaser,
        .ytp-card,
        .ytp-ce-element,
        .ytp-pause-overlay,
        .ytp-watermark,
        .ytp-share-button,
        .ytp-watch-later-button,
        .ytp-info-button,
        .ytp-related-videos,
        .ytp-endcard,
        .ytp-show-cards-title,
        .ytp-title,
        .ytp-title-text,
        .ytp-title-channel,
        .ytp-autonav-endscreen,
        .ytp-endscreen-content,
        .ytp-suggestions,
        .ytp-upnext,
        .ytp-upnext-card,
        .ytp-upnext-overlay,
        .ytp-cued-thumbnail-overlay,
        .ytp-large-play-button,
        .ytp-spinner,
        .ytp-error,
        .ytp-impression-link {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        #youtube-player {
          pointer-events: none !important;
          object-fit: contain;
        }
        .custom-controls,
        .custom-play-overlay,
        .pause-overlay {
          pointer-events: auto !important;
        }
        .ytp-iv-video-content,
        .ytp-iv-player-content {
          pointer-events: none !important;
        }
        .skip-notification {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 16px;
          z-index: 1000;
        }
        .pause-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
        }
        .pause-overlay button {
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 50%;
          padding: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
        }
        .custom-play-overlay button {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
        }
        .custom-controls {
          position: absolute;
          bottom: 0;
          width: 100%;
          z-index: 1000;
          transition: opacity 0.3s ease;
          box-sizing: border-box;
        }
        .custom-controls.hidden {
          opacity: 0;
          pointer-events: none;
        }
        .custom-controls.visible {
          opacity: 1;
          pointer-events: auto;
        }
        .video-container {
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }
        .video-container.fullscreen {
          height: calc(
            100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top)
          );
          max-height: calc(
            100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top)
          );
          width: 100vw;
          max-width: 100%;
          margin: 0;
          padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          background: black;
          overflow: hidden;
        }
        .video-wrapper {
          position: relative;
          padding-top: 56.25%;
          overflow: hidden;
          background: black;
        }
        .video-container.fullscreen .video-wrapper {
          padding-top: 0;
          height: 100%;
          max-height: 100%;
          width: 100%;
        }
        #youtube-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .timeline-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 12px;
        }
        .timeline {
          width: 100%;
          height: 6px;
          background: #4b5563;
          border-radius: 3px;
          appearance: none;
          outline: none;
          cursor: pointer;
        }
        .timeline::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #f7374f;
          border-radius: 50%;
          cursor: pointer;
        }
        .timeline::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #f7374f;
          border-radius: 50%;
          cursor: pointer;
        }
        .timeline::-webkit-slider-runnable-track {
          background: linear-gradient(
            to right,
            #f7374f 0%,
            #f7374f ${(currentTime / (duration || 1)) * 100}%,
            #4b5563 ${(currentTime / (duration || 1)) * 100}%,
            #4b5563 100%
          );
        }
        .timeline::-moz-range-progress {
          background: #f7374f;
        }
        .timeline:hover::-webkit-slider-thumb,
        .timeline:active::-webkit-slider-thumb {
          background: #e12d42;
        }
        .timeline:hover::-moz-range-thumb,
        .timeline:active::-moz-range-thumb {
          background: #e12d42;
        }
        .time-display {
          color: white;
          font-size: 12px;
          white-space: nowrap;
        }
        .timeline-tooltip {
          position: absolute;
          bottom: 30px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          transform: translateX(-50%);
          z-index: 1001;
          pointer-events: none;
        }
        .volume-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .volume-slider {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 120px;
          background: #4b5563;
          border-radius: 4px;
          appearance: none;
          outline: none;
          cursor: pointer;
          writing-mode: bt-lr;
          -webkit-appearance: slider-vertical;
          z-index: 1001;
          touch-action: pan-x;
        }
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #f7374f;
          border-radius: 50%;
          cursor: pointer;
        }
        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #f7374f;
          border-radius: 50%;
          cursor: pointer;
        }
        .volume-slider::-webkit-slider-runnable-track {
          background: linear-gradient(
            to top,
            #f7374f 0%,
            #f7374f ${volume}%,
            #4b5563 ${volume}%,
            #4b5563 100%
          );
        }
        .volume-slider::-moz-range-progress {
          background: #f7374f;
        }
        .volume-slider:hover::-webkit-slider-thumb,
        .volume-slider:active::-webkit-slider-thumb {
          background: #e12d42;
          transform: scale(1.2);
        }
        .volume-slider:hover::-moz-range-thumb,
        .volume-slider:active::-moz-range-thumb {
          background: #e12d42;
          transform: scale(1.2);
        }
        .speed-button {
          padding: 4px 8px;
          border-radius: 4px;
          background: #4b5563;
          color: white;
          font-size: 12px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .speed-button.active {
          background: #f7374f;
        }
        .speed-button:hover:not(:disabled) {
          background: #6b7280;
        }
        .speed-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .speed-dropdown {
          position: absolute;
          bottom: 40px;
          right: 0;
          background: #1f2937;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          z-index: 1002;
          min-width: 80px;
          overflow: hidden;
        }
        .speed-dropdown-item {
          padding: 8px 12px;
          color: white;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
          text-align: center;
        }
        .speed-dropdown-item:hover {
          background: #374151;
        }
        .speed-dropdown-item.active {
          background: #f7374f;
        }
        @media (max-width: 640px) {
          .custom-controls {
            padding: 8px;
          }
          .timeline-container {
            margin: 0 8px;
          }
          .time-display {
            font-size: 10px;
          }
          .volume-slider {
            width: 10px;
            height: 100px;
          }
          .volume-slider::-webkit-slider-thumb,
          .volume-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
          }
          .speed-button {
            padding: 3px 6px;
            font-size: 10px;
          }
          .speed-dropdown {
            min-width: 60px;
          }
          .speed-dropdown-item {
            padding: 6px 8px;
            font-size: 10px;
          }
        }
        @media (max-width: 896px) and (orientation: landscape) and (hover: none) {
          .video-container.fullscreen {
            height: calc(
              100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top)
            );
            max-height: calc(
              100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top)
            );
            padding: env(safe-area-inset-top) env(safe-area-inset-right)
              env(safe-area-inset-bottom) env(safe-area-inset-left);
            box-sizing: border-box;
          }
          .video-container.fullscreen .video-wrapper {
            height: 100%;
            max-height: 100%;
            width: 100%;
            padding: 0;
            overflow: hidden;
          }
          #youtube-player {
            width: 100% !important;
            height: 100% !important;
            top: 0 !important;
            left: 0 !important;
            object-fit: contain;
          }
          .custom-controls {
            bottom: env(safe-area-inset-bottom);
            padding: 6px 8px;
            background: rgba(31, 41, 55, 0.9);
            width: calc(
              100% - env(safe-area-inset-left) - env(safe-area-inset-right)
            );
            margin-left: env(safe-area-inset-left);
            margin-right: env(safe-area-inset-right);
            box-sizing: border-box;
          }
          .custom-play-overlay,
          .pause-overlay {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
          .skip-notification {
            font-size: 12px;
            padding: 5px 10px;
          }
          .timeline-container {
            margin: 0 6px;
          }
          .timeline {
            height: 4px;
          }
          .timeline::-webkit-slider-thumb,
          .timeline::-moz-range-thumb {
            width: 10px;
            height: 10px;
          }
          .time-display {
            font-size: 8px;
          }
          .volume-container {
            margin: 0 4px;
          }
          .volume-slider {
            height: 70px;
            width: 8px;
            bottom: 30px;
          }
          .volume-slider::-webkit-slider-thumb,
          .volume-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
          }
          .speed-button {
            font-size: 8px;
            padding: 2px 4px;
          }
          .speed-dropdown {
            bottom: 30px;
            min-width: 50px;
          }
          .speed-dropdown-item {
            font-size: 8px;
            padding: 4px 6px;
          }
          .pause-overlay button,
          .custom-play-overlay button {
            width: 50px;
            height: 50px;
            padding: 10px;
          }
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-[#f7374f] p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FaChalkboardTeacher className="text-2xl" />
              <h1 className="text-xl md:text-2xl font-bold">
                {selectedClass?.title} -{" "}
                {subjectName.charAt(0)?.toUpperCase() ||
                  "" ||
                  "" + subjectName.slice(1)}
              </h1>
            </div>
            <Link
              href={`/student-dashboard/courses/${courseId}/${subjectName}`}
              className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors flex items-center gap-1"
            >
              <FaArrowLeft /> Back to Classes
            </Link>
          </div>
        </div>

        <div className="p-6">
          {/* Video Player */}
          <div className="mb-6">
            {videoId ? (
              <div
                className={`video-container ${
                  isFullScreen ? "fullscreen" : ""
                }`}
                ref={videoContainerRef}
                onMouseMove={handleInteraction}
                onMouseEnter={handleInteraction}
              >
                <div className="video-wrapper rounded-lg shadow-lg bg-black">
                  <div
                    id="youtube-player"
                    className="absolute top-0 left-0 w-full h-full"
                  ></div>
                  {showCustomPlay && (
                    <div
                      className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 cursor-pointer custom-play-overlay"
                      onClick={togglePlay}
                      onDoubleClick={handleDoubleClick}
                    >
                      <button className="text-white" aria-label="Play video">
                        <FaPlay size={40} />
                      </button>
                    </div>
                  )}
                  {!showCustomPlay && (
                    <div
                      className="absolute top-0 left-0 w-full h-full cursor-pointer custom-play-overlay"
                      onClick={togglePlay}
                      onDoubleClick={handleDoubleClick}
                    ></div>
                  )}
                  {showPauseOverlay && isPlaying && (
                    <div className="pause-overlay">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        className="text-white"
                        aria-label="Pause video"
                      >
                        <FaPause size={40} />
                      </button>
                    </div>
                  )}
                  {skipNotification && (
                    <div className="skip-notification">{skipNotification}</div>
                  )}
                  <div
                    className={`bg-gray-800 p-3 flex items-center justify-between custom-controls ${
                      showControls ? "visible" : "hidden"
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-[#f7374f] transition-colors"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <FaPause size={20} />
                        ) : (
                          <FaPlay size={20} />
                        )}
                      </button>
                      <button
                        onClick={skipBackward}
                        className="text-white hover:text-[#f7374f] transition-colors"
                        aria-label="Skip backward 10 seconds"
                      >
                        <FaBackward size={20} />
                      </button>
                      <button
                        onClick={skipForward}
                        className="text-white hover:text-[#f7374f] transition-colors"
                        aria-label="Skip forward 10 seconds"
                      >
                        <FaForward size={20} />
                      </button>
                    </div>
                    <div className="timeline-container flex-1">
                      <span className="time-display">
                        {formatTime(currentTime)}
                      </span>
                      <div className="relative flex-1">
                        <input
                          type="range"
                          className="timeline"
                          min="0"
                          max={duration || 1}
                          step="0.1"
                          value={currentTime}
                          onChange={handleSeek}
                          onMouseMove={handleTimelineHover}
                          onMouseLeave={handleTimelineLeave}
                          aria-label="Video timeline"
                        />
                        {tooltipTime && (
                          <div
                            className="timeline-tooltip"
                            style={{ left: `${tooltipPosition}px` }}
                          >
                            {tooltipTime}
                          </div>
                        )}
                      </div>
                      <span className="time-display">
                        {formatTime(duration)}
                      </span>
                    </div>
                    <div className="relative flex items-center space-x-2 sm:space-x-3">
                      <div
                        className="volume-container"
                        onTouchStart={(e) => {
                          e.preventDefault();
                          setIsVolumeSliderOpen((prev) => !prev);
                        }}
                        onMouseEnter={() => {
                          if (volumeSliderTimeoutRef.current) {
                            clearTimeout(volumeSliderTimeoutRef.current);
                          }
                          setShowVolumeSlider(true);
                        }}
                        onMouseLeave={() => {
                          volumeSliderTimeoutRef.current = setTimeout(() => {
                            setShowVolumeSlider(false);
                          }, 300);
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                          className="text-white hover:text-[#f7374f] transition-colors"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted || volume === 0 ? (
                            <FaVolumeMute size={20} />
                          ) : (
                            <FaVolumeUp size={20} />
                          )}
                        </button>
                        {(showVolumeSlider || isVolumeSliderOpen) && (
                          <input
                            type="range"
                            className="volume-slider"
                            min="0"
                            max="100"
                            step="1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchMove={(e) => {
                              const touch = e.touches[0];
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const newVolume = Math.min(
                                100,
                                Math.max(
                                  0,
                                  ((rect.bottom - touch.clientY) /
                                    rect.height) *
                                    100
                                )
                              );
                              setVolume(Math.round(newVolume));
                              setIsMuted(newVolume === 0);
                            }}
                            onMouseEnter={() => {
                              if (volumeSliderTimeoutRef.current) {
                                clearTimeout(volumeSliderTimeoutRef.current);
                              }
                            }}
                            onMouseLeave={() => {
                              volumeSliderTimeoutRef.current = setTimeout(
                                () => {
                                  setShowVolumeSlider(false);
                                },
                                300
                              );
                            }}
                            aria-label="Volume control"
                          />
                        )}
                      </div>
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={() => setShowSpeedDropdown((prev) => !prev)}
                          className={`speed-button ${
                            showSpeedDropdown ? "active" : ""
                          }`}
                          disabled={!isPlayerReady}
                          aria-label="Toggle playback speed options"
                          aria-expanded={showSpeedDropdown}
                        >
                          {playbackRate}x
                        </button>
                        {showSpeedDropdown && (
                          <div className="speed-dropdown">
                            {availablePlaybackRates.map((speed) => (
                              <div
                                key={speed}
                                className={`speed-dropdown-item ${
                                  playbackRate === speed ? "active" : ""
                                }`}
                                onClick={() => changeSpeed(speed)}
                                role="option"
                                aria-selected={playbackRate === speed}
                              >
                                {speed}x
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={toggleFullScreen}
                        className="text-white hover:text-[#f7374f] transition-colors"
                        aria-label={
                          isFullScreen
                            ? "Exit full screen"
                            : "Enter full screen"
                        }
                      >
                        {isFullScreen ? (
                          <FaTimes size={20} />
                        ) : (
                          <FaExpand size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center text-gray-500">
                Invalid video URL
              </div>
            )}
          </div>

          {/* Class Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                About This Class
              </h2>
              <div className="space-y-4">
                <p>
                  <span className="font-medium">Subject:</span>{" "}
                  {selectedClass.subject.charAt(0)?.toUpperCase() ||
                    "" ||
                    "" + selectedClass.subject.slice(1)}
                </p>
                <p>
                  <span className="font-medium">Instructor:</span>{" "}
                  {selectedClass.instructor}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(selectedClass.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-[#f7374f]/5 p-4 rounded-lg border border-[#f7374f]/10">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <span className="bg-[#f7374f]/10 p-2 rounded-lg text-[#f7374f] mr-3">
                    <FaChalkboardTeacher />
                  </span>
                  Class Information
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  This recorded class is part of your enrolled course. Use the
                  custom controls below the video to manage playback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassVideoPlayer;
