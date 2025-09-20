/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaComments,
  FaCompress,
  FaExpand,
  FaPause,
  FaPlay,
  FaTimes,
  FaUserCircle,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import io from "socket.io-client";

// Dynamically import ReactPlayer
const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
});

// Socket.io initialization
const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  auth: {
    token: Cookies.get("accessToken"),
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Socket error handling
socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});
socket.on("connect_timeout", (timeout) => {
  console.error("Socket connection timeout:", timeout);
});
socket.on("error", (err) => {
  console.error("Socket error:", err);
});

const LiveClassPage = () => {
  const params = useParams();
  const classId = params?.classId;
  const router = useRouter();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [playerError, setPlayerError] = useState(null);
  const messagesEndRef = useRef(null);
  const playerContainerRef = useRef(null);
  const speedButtonRef = useRef(null);
  const qualityButtonRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  // ReactPlayer states
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(1);
  const [duration, setDuration] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [hasWindow, setHasWindow] = useState(false);
  const [isAtLiveEdge, setIsAtLiveEdge] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);
  const [quality, setQuality] = useState("auto");
  const controlsTimeoutRef = useRef(null);
  const playerRef = useRef(null);
  const volumeContainerRef = useRef(null);
  const volumeSliderTimeoutRef = useRef(null);

  // Default avatar URL
  const defaultAvatar =
    "https://res.cloudinary.com/dqj0xg3zv/image/upload/v1698231234/avatars/default-avatar.png";

  // Check for window object
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  // Fetch current student data
  useEffect(() => {
    const fetchCurrentStudent = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/current-student`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data.success && data.data.student) {
          setCurrentUser(data.data.student);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError("Error fetching user data");
        console.error(err);
      }
    };
    fetchCurrentStudent();
  }, []);

  // Fetch class data
  useEffect(() => {
    const fetchClassData = async () => {
      if (!process.env.NEXT_PUBLIC_SERVER_URL) {
        setError("Server URL is not configured.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/class/${classId}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch class data");
        }
        setClassData(data);
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    if (classId) {
      fetchClassData();
    }
  }, [classId]);

  // Chat Socket.IO logic
  useEffect(() => {
    if (!classId) return;
    socket.emit("join class", classId);
    socket.on("load messages", (loadedMessages) => {
      setMessages(loadedMessages);
    });
    socket.on("receive message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("error", (errorMessage) => {
      console.error("Socket.IO error:", errorMessage);
      setError(errorMessage);
    });
    return () => {
      socket.off("load messages");
      socket.off("receive message");
      socket.off("error");
    };
  }, [classId]);

  // Scroll to bottom of message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update current time dynamically
  useEffect(() => {
    if (isLive && playerRef.current && playing) {
      const interval = setInterval(() => {
        const current = playerRef.current.getCurrentTime();
        if (current >= 0) {
          setCurrentTime(current);
        }
        const duration = playerRef.current.getDuration() || Infinity;
        const isLiveEdge = isLive ? current >= duration - 10 : false;
        setIsAtLiveEdge(isLiveEdge);
        if (isLiveEdge) {
          setPlayed(1);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLive, playing]);

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

  // Close dropdowns on outside click or touch
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        speedButtonRef.current &&
        !speedButtonRef.current.contains(event.target)
      ) {
        setShowSpeedDropdown(false);
      }
      if (
        qualityButtonRef.current &&
        !qualityButtonRef.current.contains(event.target)
      ) {
        setShowQualityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Handle controls visibility cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (volumeSliderTimeoutRef.current) {
        clearTimeout(volumeSliderTimeoutRef.current);
      }
    };
  }, []);

  // Hide controls after playing starts
  useEffect(() => {
    if (
      playing &&
      !showSpeedDropdown &&
      !showVolumeSlider &&
      !showQualityDropdown
    ) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [playing, showSpeedDropdown, showVolumeSlider, showQualityDropdown]);

  const sendMessage = useCallback(() => {
    if (input.trim() && classId) {
      socket.emit("send message", { content: input, classId });
      setInput("");
    }
  }, [input, classId]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    },
    [sendMessage]
  );

  const handleProgress = useCallback(
    (state) => {
      if (!state.seeking && !isAtLiveEdge) {
        setPlayed(state.played);
      }
    },
    [isAtLiveEdge]
  );

  const handleDuration = useCallback((duration) => {
    setDuration(duration);
    setIsLive(true);
  }, []);

  const formatTime = useCallback((seconds) => {
    if (!isFinite(seconds) || seconds <= 0) {
      return "LIVE";
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes().toString().padStart(2, "0");
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    return hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  }, []);

  const jumpToLive = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(1e10);
      setPlayed(1);
      setIsAtLiveEdge(true);
      if (!playing) {
        setPlaying(true);
      }
    }
  }, [playing]);

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => !prev);
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (!playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!showSpeedDropdown && !showVolumeSlider && !showQualityDropdown) {
          setShowControls(false);
        }
      }, 3000);
    }
  }, [playing, showSpeedDropdown, showVolumeSlider, showQualityDropdown]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
    setVolume((prev) => (prev === 0 ? 0.8 : 0));
    setShowVolumeSlider(true);
    if (volumeSliderTimeoutRef.current) {
      clearTimeout(volumeSliderTimeoutRef.current);
    }
    volumeSliderTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  }, []);

  const changeSpeed = useCallback((speed) => {
    setPlaybackRate(speed);
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().setPlaybackRate(speed);
    }
    setShowSpeedDropdown(false);
  }, []);

  const changeQuality = useCallback((quality) => {
    setQuality(quality);
    setShowQualityDropdown(false);
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handlePlayerError = useCallback((err) => {
    console.error("Player error:", err);
    setPlayerError("Failed to load the live stream. Please try again.");
  }, []);

  const handleInteractionStart = useCallback(() => {
    setShowControls(true);
    setShowVolumeSlider(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (volumeSliderTimeoutRef.current) {
      clearTimeout(volumeSliderTimeoutRef.current);
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    volumeSliderTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
    controlsTimeoutRef.current = setTimeout(() => {
      if (
        playing &&
        !showSpeedDropdown &&
        !showVolumeSlider &&
        !showQualityDropdown
      ) {
        setShowControls(false);
      }
    }, 3000);
  }, [playing, showSpeedDropdown, showVolumeSlider, showQualityDropdown]);

  const handlePlayerInteraction = useCallback(
    (e) => {
      e.stopPropagation();
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (
          playing &&
          !showSpeedDropdown &&
          !showVolumeSlider &&
          !showQualityDropdown
        ) {
          setShowControls(false);
        }
      }, 3000);
    },
    [playing, showSpeedDropdown, showVolumeSlider, showQualityDropdown]
  );

  // Loading, error, and class data checks
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="relative">
          <div className="spinner w-16 h-16 border-4 border-[#f7374f] border-t-transparent rounded-full animate-spin"></div>
          <FaChalkboardTeacher className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#f7374f] text-2xl animate-pulse" />
        </div>
        <p className="loading-text mt-4 text-lg font-semibold text-[#f7374f] animate-pulse-text">
          Loading Live Class...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <p className="text-lg font-medium mb-2">Error loading class</p>
        <p className="text-sm">{error}</p>
        <Link href="/dashboard/live-class">
          <button className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2">
            <FaArrowLeft /> Back to Live Classes
          </button>
        </Link>
      </div>
    );
  }

  if (!classData || !classData.data || !classData.data.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg">Class not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Live Classes
        </button>
      </div>
    );
  }

  if (!classData.data.data.isActiveLive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg">Live class ended</p>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Live Classes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 lg:py-6">
      <style jsx global>{`
        /* Ensure YouTube iframe is not touchable when custom controls are active */
        .react-player iframe {
          pointer-events: ${showControls || !playing
            ? "none"
            : "none"} !important;
        }
        .react-player__player {
          pointer-events: auto !important;
        }
        /* Hide YouTube native controls */
        .react-player__html5-player,
        .ytp-chrome-top,
        .ytp-chrome-bottom,
        .ytp-gradient-top,
        .ytp-gradient-bottom,
        .ytp-button:not(.ytp-play-button),
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
        .chat-modal {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 80%;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        .chat-modal.open {
          transform: translateY(0);
        }
        @media (min-width: 640px) {
          .chat-modal {
            position: fixed;
            top: 0;
            right: 0;
            width: 24rem;
            height: 100%;
            transform: translateX(100%);
          }
          .chat-modal.open {
            transform: translateX(0);
          }
        }
        .react-player-container {
          position: relative;
          width: 100%;
          max-width: 896px;
          margin: 0 auto;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
          touch-action: manipulation; /* Prevents double-tap zooming */
        }
        .video-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          background: #000;
        }
        .video-wrapper .react-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100% !important;
          height: 100% !important;
        }
        .loading-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f7374f;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .loading-text {
          color: #f7374f;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          animation: pulse-text 1.5s ease-in-out infinite;
        }
        .player-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: ${showControls || !playing ? "auto" : "auto"};
          opacity: ${showControls || !playing ? 1 : 0};
          transition: opacity 0.3s ease;
        }
        :fullscreen .player-overlay,
        :-webkit-full-screen .player-overlay,
        :-moz-full-screen .player-overlay {
          height: calc(100% - 48px);
          opacity: ${showControls || !playing ? 1 : 0};
          pointer-events: ${showControls || !playing ? "auto" : "auto"};
        }
        .react-player-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          z-index: 20;
          opacity: ${showControls ? 1 : 0};
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: ${showControls ? "auto" : "none"};
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .react-player-controls:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        :fullscreen .react-player-controls,
        :-webkit-full-screen .react-player-controls,
        :-moz-full-screen .react-player-controls {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          opacity: ${showControls ? 1 : 0};
          pointer-events: ${showControls ? "auto" : "none"};
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        @media (max-width: 640px) {
          .react-player-controls {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
          }
          .react-player-controls > div {
            margin: 0;
          }
        }
        .control-button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease,
            box-shadow 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .control-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .control-button:disabled {
          background: rgba(255, 255, 255, 0.05);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .control-button:active {
          transform: scale(0.95);
        }
        .volume-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        .volume-slider {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 120px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          appearance: none;
          outline: none;
          cursor: pointer;
          writing-mode: bt-lr;
          -webkit-appearance: slider-vertical;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: #f7374f;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #f7374f;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .volume-slider::-webkit-slider-runnable-track {
          background: linear-gradient(
            to top,
            #f7374f 0%,
            #f7374f ${volume * 100}%,
            rgba(255, 255, 255, 0.2) ${volume * 100}%,
            rgba(255, 255, 255, 0.2) 100%
          );
        }
        .volume-slider::-moz-range-progress {
          background: #f7374f;
        }
        .speed-dropdown,
        .quality-dropdown {
          position: absolute;
          bottom: 100%;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          z-index: 20;
          padding: 8px 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .speed-dropdown button,
        .quality-dropdown button {
          display: block;
          width: 100%;
          padding: 10px 20px;
          text-align: left;
          color: white;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .speed-dropdown button:hover,
        .quality-dropdown button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .speed-dropdown button.active,
        .quality-dropdown button.active {
          background: #f7374f;
        }
        .live-status {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 15;
          cursor: ${isAtLiveEdge ? "default" : "pointer"};
        }
        .live-status:hover {
          background: ${isAtLiveEdge
            ? "rgba(0, 0, 0, 0.7)"
            : "rgba(0, 0, 0, 0.9)"};
        }
        .live-status:disabled {
          cursor: default;
          opacity: 0.7;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          background: #f7374f;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes pulse-text {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-[#f7374f] p-4 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FaChalkboardTeacher className="text-2xl" />
              <h1 className="text-xl md:text-2xl font-bold">
                {classData?.data?.data?.title || "Live Class"}
              </h1>
            </div>
            <Link
              href="/student-dashboard/live-classes"
              className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors flex items-center gap-1"
            >
              <FaArrowLeft /> All Classes
            </Link>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-6">
            {classData?.data?.data?.videoLink ? (
              playerError ? (
                <div className="bg-gray-100 rounded-lg aspect-[16/9] flex items-center justify-center text-red-500">
                  {playerError}
                </div>
              ) : (
                <div
                  className="react-player-container"
                  ref={playerContainerRef}
                  onMouseMove={handlePlayerInteraction}
                  onTouchStart={handlePlayerInteraction}
                >
                  {isLive && (
                    <button
                      className="live-status"
                      onClick={isAtLiveEdge ? null : jumpToLive}
                      disabled={isAtLiveEdge}
                      aria-label="Go Live"
                      role="button"
                      tabIndex={0}
                    >
                      <span className="live-dot"></span>
                      LIVE
                    </button>
                  )}
                  <div className="video-wrapper">
                    {hasWindow ? (
                      <ReactPlayer
                        ref={playerRef}
                        url={classData.data.data.videoLink}
                        playing={playing}
                        volume={muted ? 0 : volume}
                        playbackRate={playbackRate}
                        width="100%"
                        height="100%"
                        className="react-player"
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        onError={handlePlayerError}
                        config={
                          {
                            youtube: {
                              playerVars: {
                                controls: 0,
                                disablekb: 1,
                                modestbranding: 1,
                                rel: 0,
                                enablejsapi: 1,
                                iv_load_policy: 3,
                                start: 0,
                                autoplay: 0,
                              },
                            },
                          } as any
                        }
                      />
                    ) : (
                      <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading-text">Loading Live Class...</p>
                      </div>
                    )}
                  </div>
                  <div className="player-overlay">
                    <button
                      onClick={handlePlayPause}
                      aria-label={playing ? "Pause" : "Play"}
                      role="button"
                      tabIndex={0}
                    >
                      {playing ? (
                        <FaPause size={40} color="white" />
                      ) : (
                        <FaPlay size={40} color="white" />
                      )}
                    </button>
                  </div>
                  <div className="react-player-controls">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePlayPause}
                        className="control-button"
                        aria-label={playing ? "Pause" : "Play"}
                        role="button"
                        tabIndex={0}
                      >
                        {playing ? <FaPause size={16} /> : <FaPlay size={16} />}
                      </button>
                      <span className="text-white text-sm font-medium">
                        {formatTime(currentTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="volume-container"
                        ref={volumeContainerRef}
                        onMouseEnter={handleInteractionStart}
                        onMouseLeave={handleInteractionEnd}
                        onTouchStart={handleInteractionStart}
                        onTouchEnd={handleInteractionEnd}
                      >
                        <button
                          onClick={toggleMute}
                          className="control-button"
                          aria-label={muted ? "Unmute" : "Mute"}
                          role="button"
                          tabIndex={0}
                        >
                          {muted || volume === 0 ? (
                            <FaVolumeMute size={16} />
                          ) : (
                            <FaVolumeUp size={16} />
                          )}
                        </button>
                        {showVolumeSlider && (
                          <input
                            type="range"
                            className="volume-slider"
                            min={0}
                            max={1}
                            step="any"
                            value={muted ? 0 : volume}
                            onChange={handleVolumeChange}
                            onMouseEnter={handleInteractionStart}
                            onMouseLeave={handleInteractionEnd}
                            onTouchStart={handleInteractionStart}
                            onTouchEnd={handleInteractionEnd}
                            aria-label="Volume control"
                          />
                        )}
                      </div>
                      {!isLive && (
                        <div className="relative">
                          <button
                            ref={speedButtonRef}
                            onClick={() =>
                              setShowSpeedDropdown(!showSpeedDropdown)
                            }
                            className="control-button text-xs px-4 py-2 rounded-full"
                            aria-label="Playback speed"
                            role="button"
                            tabIndex={0}
                          >
                            {playbackRate}x
                          </button>
                          {showSpeedDropdown && (
                            <div className="speed-dropdown">
                              {[0.5, 1, 1.5, 2].map((speed) => (
                                <button
                                  key={speed}
                                  onClick={() => changeSpeed(speed)}
                                  className={`text-xs ${
                                    playbackRate === speed ? "active" : ""
                                  }`}
                                  role="menuitem"
                                  tabIndex={0}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={toggleFullScreen}
                        className="control-button"
                        aria-label={
                          isFullScreen ? "Exit fullscreen" : "Fullscreen"
                        }
                        role="button"
                        tabIndex={0}
                      >
                        {isFullScreen ? (
                          <FaCompress size={16} />
                        ) : (
                          <FaExpand size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-gray-100 rounded-lg aspect-[16/9] flex items-center justify-center text-gray-500">
                No video available for this class
              </div>
            )}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2"
                aria-label="Toggle live chat"
                role="button"
                tabIndex={0}
              >
                <FaComments size={16} />
                Live Chat
              </button>
            </div>
            {showChat && (
              <div
                className={`chat-modal bg-white shadow-xl z-50 p-6 overflow-y-auto ${
                  showChat ? "open" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">📢</span> Live Chat
                  </h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-600 hover:text-[#f7374f] transition-colors"
                    aria-label="Close chat"
                    role="button"
                    tabIndex={0}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="flex flex-col h-[calc(100%-4rem)]">
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex flex-col p-3 rounded-lg max-w-[85%] ${
                          msg.createdBy._id === currentUser?._id
                            ? "ml-auto bg-[#f7374f] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {msg.createdBy.photoUrl ? (
                            <Image
                              src={msg.createdBy.photoUrl}
                              alt={`${msg.createdBy.fullName}'s avatar`}
                              className="w-6 h-6 rounded-full mr-2 object-cover"
                              width={24}
                              height={24}
                              onError={(e) => {
                                (e.target as HTMLImageElement).setAttribute(
                                  "src",
                                  defaultAvatar
                                );
                              }}
                            />
                          ) : (
                            <FaUserCircle
                              size={24}
                              className="text-gray-500 mr-2"
                            />
                          )}
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {msg.createdBy.fullName}
                            </span>
                            <span className="text-xs opacity-75">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7374f] text-sm"
                      aria-label="Chat input"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-3 bg-[#f7374f] text-white rounded-lg hover:bg-[#e12d42] transition-colors font-medium text-sm"
                      disabled={!input.trim()}
                      aria-label="Send message"
                      role="button"
                      tabIndex={0}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                About This Class
              </h2>
              <div className="space-y-4">
                <p>
                  <span className="font-medium">Subject:</span>{" "}
                  {classData?.data?.data?.subject
                    ? classData.data.data.subject.charAt(0).toUpperCase() +
                      classData.data.data.subject.slice(1)
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Instructor:</span>{" "}
                  {classData?.data?.data?.instructor || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Course:</span>{" "}
                  {classData?.data?.data?.course?.title || "N/A"}
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
                  This live class is part of your enrolled course. Use the
                  custom controls below the video to manage playback and access
                  the live chat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassPage;
