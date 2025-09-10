// "use client";
// import Cookies from "js-cookie";
// import Link from "next/link";
// import Image from "next/image";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import {
//   FaArrowLeft,
//   FaBackward,
//   FaChalkboardTeacher,
//   FaComments,
//   FaExpand,
//   FaForward,
//   FaPause,
//   FaPlay,
//   FaSpinner,
//   FaTimes,
//   FaUserCircle,
//   FaVolumeMute,
//   FaVolumeUp,
// } from "react-icons/fa";
// import io from "socket.io-client";

// const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
//   transports: ["websocket", "polling"],
//   withCredentials: true,
//   auth: {
//     token: Cookies.get("accessToken"),
//   },
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// // Add error handling
// socket.on("connect_error", (err) => {
//   console.error("Socket connection error:", err.message);
// });

// socket.on("connect_timeout", (timeout) => {
//   console.error("Socket connection timeout:", timeout);
// });

// socket.on("error", (err) => {
//   console.error("Socket error:", err);
// });

// declare global {
//   interface Window {
//     onYouTubeIframeAPIReady: () => void;
//   }
// }

// const LiveClassPage = () => {
//   const params = useParams();
//   const classId = params?.classId;
//   const [classData, setClassData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();
//   const playerRef = useRef(null);
//   const videoContainerRef = useRef(null);
//   const speedButtonRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [showCustomPlay, setShowCustomPlay] = useState(true);
//   const [skipNotification, setSkipNotification] = useState(null);
//   const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [showPauseOverlay, setShowPauseOverlay] = useState(false);
//   const [showControls, setShowControls] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [bufferedDuration, setBufferedDuration] = useState(0);
//   const [volume, setVolume] = useState(50);
//   const [isMuted, setIsMuted] = useState(false);
//   // const [tooltipTime, setTooltipTime] = useState(null);
//   // const [tooltipPosition, setTooltipPosition] = useState(0);
//   const [showVolumeSlider, setShowVolumeSlider] = useState(false);
//   const [isLiveStream, setIsLiveStream] = useState(false);
//   const [isLiveSynced, setIsLiveSynced] = useState(true);
//   const [isPlayerReady, setIsPlayerReady] = useState(false);
//   const controlTimeoutRef = useRef(null);
//   const timeUpdateIntervalRef = useRef(null);
//   // Chat state
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [showChat, setShowChat] = useState(false);
//   const messagesEndRef = useRef(null);
//   const [currentUser, setCurrentUser] = useState(null);

//   // Default avatar URL
//   const defaultAvatar =
//     "https://res.cloudinary.com/dqj0xg3zv/image/upload/v1698231234/avatars/default-avatar.png";

//   // Fetch current student data
//   useEffect(() => {
//     const fetchCurrentStudent = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/current-student`,
//           { credentials: "include" }
//         );
//         const data = await response.json();
//         if (data.success && data.data.student) {
//           setCurrentUser(data.data.student);
//         } else {
//           setError("Failed to fetch user data");
//         }
//       } catch (err) {
//         setError("Error fetching user data");
//         console.error(err);
//       }
//     };
//     fetchCurrentStudent();
//   }, []);

//   // Chat Socket.IO logic
//   useEffect(() => {
//     if (!classId) return;
//     socket.emit("join class", classId);
//     socket.on("load messages", (loadedMessages) => {
//       setMessages(loadedMessages);
//     });
//     socket.on("receive message", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });
//     socket.on("error", (errorMessage) => {
//       console.error("Socket.IO error:", errorMessage);
//       setError(errorMessage);
//     });
//     return () => {
//       socket.off("load messages");
//       socket.off("receive message");
//       socket.off("error");
//     };
//   }, [classId]);

//   // Scroll to bottom of message list
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (input.trim() && classId) {
//       socket.emit("send message", { content: input, classId });
//       setInput("");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   // Full-screen state tracking
//   useEffect(() => {
//     const handleFullScreenChange = () => {
//       setIsFullScreen(!!document.fullscreenElement);
//     };
//     document.addEventListener("fullscreenchange", handleFullScreenChange);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullScreenChange);
//     };
//   }, []);

//   // Control bar auto-hide logic
//   useEffect(() => {
//     if (isPlaying && showControls) {
//       controlTimeoutRef.current = setTimeout(() => {
//         setShowControls(false);
//       }, 5000);
//     }
//     return () => {
//       if (controlTimeoutRef.current) {
//         clearTimeout(controlTimeoutRef.current);
//       }
//     };
//   }, [isPlaying, showControls]);

//   // Update current time and buffered duration
//   useEffect(() => {
//     if (isPlaying && playerRef.current && isPlayerReady) {
//       timeUpdateIntervalRef.current = setInterval(() => {
//         const current = playerRef.current.getCurrentTime();
//         if (isLiveStream) {
//           // For live streams, bufferedDuration is the current time at the live edge
//           setBufferedDuration(current);
//           if (isLiveSynced) {
//             setCurrentTime(current); // Keep currentTime at live edge
//           } else {
//             setCurrentTime(playerRef.current.getCurrentTime()); // Reflect seeked position
//           }
//         } else {
//           setCurrentTime(current);
//           setBufferedDuration(playerRef.current.getDuration());
//         }
//       }, 1000);
//     } else {
//       clearInterval(timeUpdateIntervalRef.current);
//     }
//     return () => {
//       clearInterval(timeUpdateIntervalRef.current);
//     };
//   }, [isPlaying, isLiveStream, isLiveSynced, isPlayerReady]);

//   // Update volume when changed or muted
//   useEffect(() => {
//     if (playerRef.current && isPlayerReady) {
//       playerRef.current.setVolume(isMuted ? 0 : volume);
//     }
//   }, [volume, isMuted, isPlayerReady]);

//   // Fetch class data
//   useEffect(() => {
//     const fetchClassData = async () => {
//       if (!process.env.NEXT_PUBLIC_SERVER_URL) {
//         setError("Server URL is not configured.");
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/class/${classId}`,
//           { credentials: "include" }
//         );
//         const data = await response.json();
//         if (!response.ok) {
//           throw new Error(data.message || "Failed to fetch class data");
//         }
//         setClassData(data.data);
//       } catch (err) {
//         setError(err.message || "An unexpected error occurred.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (classId) {
//       fetchClassData();
//     }
//   }, [classId]);

//   const getYouTubeId = (url) => {
//     if (!url) return null;
//     const regex =
//       /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live\/?)|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
//     const match = url.match(regex);
//     return match && match[1] ? match[1] : null;
//   };

//   useEffect(() => {
//     if (!classData?.data?.videoLink) return;
//     const videoId = getYouTubeId(classData.data.videoLink);
//     if (!videoId) {
//       console.error("Invalid YouTube URL:", classData.data.videoLink);
//       setError("Invalid YouTube URL");
//       setLoading(false);
//       return;
//     }
//     const tag = document.createElement("script");
//     tag.src = "https://www.youtube.com/iframe_api";
//     const firstScriptTag = document.getElementsByTagName("script")[0];
//     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//     window.onYouTubeIframeAPIReady = () => {
//       playerRef.current = new window.YT.Player("youtube-player", {
//         videoId: videoId,
//         playerVars: {
//           autoplay: 0,
//           controls: 0,
//           disablekb: 1,
//           fs: 0,
//           modestbranding: 1,
//           rel: 0,
//           showinfo: 0,
//           iv_load_policy: 3,
//           playsinline: 1,
//           origin: window.location.origin,
//           enablejsapi: 1,
//         },
//         events: {
//           onReady: () => {
//             setIsPlayerReady(true);
//             onPlayerReady();
//           },
//           onStateChange: onPlayerStateChange,
//           onError: (event) => {
//             console.error("YouTube player error:", event.data);
//             setError(`YouTube player error: ${event.data}`);
//             setLoading(false);
//           },
//         },
//       });
//     };
//     return () => {
//       if (playerRef.current) {
//         playerRef.current.destroy();
//         setIsPlayerReady(false);
//       }
//     };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [classData]);

//   const onPlayerReady = () => {
//     setIsPlayerReady(true);

//     // Hardcode isLive to true
//     const isLive = true;
//     setIsLiveStream(isLive);

//     if (playerRef.current) {
//       if (isLive) {
//         const currentTime = playerRef.current.getCurrentTime();
//         setBufferedDuration(currentTime || 0);
//         setCurrentTime(currentTime || 0);
//         setIsLiveSynced(true);
//         // Start at live edge
//         playerRef.current.seekTo(Infinity, true);
//       } else {
//         setBufferedDuration(playerRef.current.getDuration());
//         setCurrentTime(0);
//       }
//       playerRef.current.setVolume(isMuted ? 0 : volume);
//     }
//   };

//   const onPlayerStateChange = (event) => {
//     const state = event.data;
//     setIsPlaying(state === window.YT.PlayerState.PLAYING);
//     if (state === window.YT.PlayerState.PLAYING) {
//       setShowCustomPlay(false);
//       setShowPauseOverlay(true);
//       setShowControls(true);
//       setTimeout(() => setShowPauseOverlay(false), 5000);
//     } else if (
//       state === window.YT.PlayerState.PAUSED ||
//       state === window.YT.PlayerState.ENDED
//     ) {
//       setShowCustomPlay(true);
//       setShowPauseOverlay(false);
//       setShowControls(true);
//       if (controlTimeoutRef.current) {
//         clearTimeout(controlTimeoutRef.current);
//       }
//     }
//   };

//   const togglePlay = () => {
//     if (!playerRef.current || !isPlayerReady) {
//       console.warn("Player not initialized or not ready");
//       return;
//     }
//     if (isPlaying) {
//       playerRef.current.pauseVideo();
//     } else {
//       playerRef.current.playVideo();
//     }
//   };

//   const skipForward = () => {
//     if (!playerRef.current || !isPlayerReady) {
//       console.warn("Player not initialized or not ready");
//       return;
//     }
//     const current = playerRef.current.getCurrentTime();
//     const newTime = Math.min(current + 10, bufferedDuration);
//     playerRef.current.seekTo(newTime, true);
//     setCurrentTime(newTime);
//     setIsLiveSynced(newTime >= bufferedDuration - 1);
//     setSkipNotification("+10s");
//     setTimeout(() => setSkipNotification(null), 1000);
//     if (isPlaying) {
//       setShowCustomPlay(false);
//     }
//   };

//   const skipBackward = () => {
//     if (!playerRef.current || !isPlayerReady) {
//       console.warn("Player not initialized or not ready");
//       return;
//     }
//     const current = playerRef.current.getCurrentTime();
//     const newTime = Math.max(0, current - 10);
//     playerRef.current.seekTo(newTime, true);
//     setCurrentTime(newTime);
//     setIsLiveSynced(newTime >= bufferedDuration - 1);
//     setSkipNotification("-10s");
//     setTimeout(() => setSkipNotification(null), 1000);
//     if (isPlaying) {
//       setShowCustomPlay(false);
//     }
//   };

//   const syncToLive = () => {
//     if (!playerRef.current || !isPlayerReady || !isLiveStream) {
//       console.warn("Player not initialized, not ready, or not a live stream");
//       return;
//     }
//     const liveTime = bufferedDuration; // Sync to the live edge
//     playerRef.current.seekTo(liveTime, true);
//     setCurrentTime(liveTime);
//     setIsLiveSynced(true);
//   };

//   const changeSpeed = (speed) => {
//     if (!playerRef.current || !isPlayerReady) {
//       console.warn("Player not initialized or not ready");
//       return;
//     }
//     playerRef.current.setPlaybackRate(speed);
//     setPlaybackRate(speed);
//     setShowSpeedDropdown(false);
//   };

//   const handleDoubleClick = (event) => {
//     if (!playerRef.current || !videoContainerRef.current || !isPlayerReady) {
//       console.warn("Player not initialized, not ready, or container missing");
//       return;
//     }
//     const rect = videoContainerRef.current.getBoundingClientRect();
//     const clickX = event.clientX - rect.left;
//     const width = rect.width;
//     const third = width / 3;
//     if (clickX > 2 * third) {
//       skipForward();
//     } else if (clickX < third) {
//       skipBackward();
//     }
//   };

//   const toggleFullScreen = () => {
//     if (!videoContainerRef.current) return;
//     if (!document.fullscreenElement) {
//       videoContainerRef.current.requestFullscreen().catch((err) => {
//         console.error(`Error attempting to enable fullscreen: ${err.message}`);
//       });
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   const handleInteraction = () => {
//     setShowControls(true);
//     if (isPlaying && controlTimeoutRef.current) {
//       clearTimeout(controlTimeoutRef.current);
//       controlTimeoutRef.current = setTimeout(() => {
//         setShowControls(false);
//       }, 5000);
//     }
//   };

//   // const handleSeek = (event) => {
//   //   if (!playerRef.current || !isPlayerReady) {
//   //     console.warn("Player not initialized or not ready");
//   //     return;
//   //   }
//   //   const newTime = parseFloat(event.target.value);
//   //   playerRef.current.seekTo(newTime, true);
//   //   setCurrentTime(newTime);
//   //   setIsLiveSynced(newTime >= bufferedDuration - 1);
//   // };

//   // const handleTimelineHover = (event) => {
//   //   if (!playerRef.current || !isPlayerReady) {
//   //     console.warn("Player not initialized or not ready");
//   //     return;
//   //   }
//   //   const rect = event.target.getBoundingClientRect();
//   //   const offsetX = event.clientX - rect.left;
//   //   const width = rect.width;
//   //   const newTime = (offsetX / width) * bufferedDuration;
//   //   setTooltipTime(formatTime(newTime));
//   //   setTooltipPosition(offsetX);
//   // };

//   // const handleTimelineLeave = () => {
//   //   setTooltipTime(null);
//   //   setTooltipPosition(0);
//   // };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//   };

//   const handleVolumeChange = (event) => {
//     const newVolume = parseInt(event.target.value);
//     setVolume(newVolume);
//     setIsMuted(newVolume === 0);
//   };

//   // const formatTime = (seconds) => {
//   //   const hours = Math.floor(seconds / 3600);
//   //   const minutes = Math.floor((seconds % 3600) / 60);
//   //   const secs = Math.floor(seconds % 60);
//   //   return hours > 0
//   //     ? `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
//   //         secs < 10 ? "0" : ""
//   //       }${secs}`
//   //     : `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//   // };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         speedButtonRef.current &&
//         !speedButtonRef.current.contains(event.target)
//       ) {
//         setShowSpeedDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <FaSpinner className="animate-spin text-4xl text-[#f7374f] mb-4" />
//         <p className="text-lg text-gray-600">Loading class data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
//         <p className="text-lg font-medium mb-2">Error loading class</p>
//         <p className="text-sm">{error}</p>
//         <Link href="/dashboard/live-class">
//           <button className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2">
//             <FaArrowLeft /> Back to Live Classes
//           </button>
//         </Link>
//       </div>
//     );
//   }

//   if (!classData || !classData.data) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <p className="time-display">Class not found</p>
//         <button
//           onClick={() => router.back()}
//           className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2"
//         >
//           <FaArrowLeft /> Back to Live Classes
//         </button>
//       </div>
//     );
//   }

//   if (!classData.data.isActiveLive) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <p className="time-display">Live class ended</p>
//         <button
//           onClick={() => router.back()}
//           className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2"
//         >
//           <FaArrowLeft /> Back to Live Classes
//         </button>
//       </div>
//     );
//   }

//   const videoId = classData.data.videoLink
//     ? getYouTubeId(classData.data.videoLink)
//     : null;

//   return (
//     <div className="container mx-auto px-2 md:px-4 py-4 py-6">
//       <style jsx global>{`
//         .ytp-chrome-top,
//         .ytp-chrome-bottom,
//         .ytp-gradient-top,
//         .ytp-gradient-bottom,
//         .ytp-button,
//         .ytp-cards-teaser,
//         .ytp-card,
//         .ytp-ce-element,
//         .ytp-pause-overlay,
//         .ytp-watermark,
//         .ytp-share-button,
//         .ytp-watch-later-button,
//         .ytp-info-button,
//         .ytp-related-videos,
//         .ytp-endcard,
//         .ytp-show-cards-title,
//         .ytp-title,
//         .ytp-title-text,
//         .ytp-title-channel,
//         .ytp-autonav-endscreen,
//         .ytp-endscreen-content,
//         .ytp-suggestions,
//         .ytp-upnext,
//         .ytp-upnext-card,
//         .ytp-upnext-overlay,
//         .ytp-cued-thumbnail-overlay,
//         .ytp-large-play-button,
//         .ytp-spinner,
//         .ytp-error,
//         .ytp-impression-link {
//           display: none !important;
//           visibility: hidden !important;
//           pointer-events: none !important;
//         }
//         #youtube-player {
//           pointer-events: none !important;
//         }
//         .custom-controls,
//         .custom-play-overlay,
//         .pause-overlay,
//         .live-status,
//         .live-sync-button {
//           pointer-events: auto !important;
//         }
//         .ytp-iv-video-content,
//         .ytp-iv-player-content {
//           pointer-events: none !important;
//         }
//         .skip-notification {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//           background: rgba(0, 0, 0, 0.7);
//           color: white;
//           padding: 8px 16px;
//           border-radius: 4px;
//           font-size: 16px;
//           z-index: 1000;
//         }
//         .pause-overlay {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//           background: rgba(0, 0, 0, 0.5);
//           border-radius: 50%;
//           padding: 10px;
//           z-index: 1000;
//           pointer-events: none;
//         }
//         .custom-play-overlay button {
//           background: rgba(0, 0, 0, 0.5);
//           border-radius: 50%;
//           padding: 10px;
//         }
//         .speed-dropdown {
//           position: absolute;
//           bottom: 100%;
//           right: 0;
//           background: #1f2937;
//           border-radius: 4px;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
//           z-index: 1001;
//           padding: 8px 0;
//         }
//         .custom-controls {
//           position: absolute;
//           bottom: 0;
//           width: 100%;
//           z-index: 1000;
//           transition: opacity 0.3s ease;
//         }
//         .custom-controls.hidden {
//           opacity: 0;
//           pointer-events: none;
//         }
//         .custom-controls.visible {
//           opacity: 1;
//           pointer-events: auto;
//         }
//         .timeline-container {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           margin: 0 12px;
//         }
//         .timeline {
//           width: 100%;
//           height: 6px;
//           background: #4b5563;
//           border-radius: 3px;
//           appearance: none;
//           outline: none;
//           cursor: pointer;
//         }
//         .timeline::-webkit-slider-thumb {
//           appearance: none;
//           width: 12px;
//           height: 12px;
//           background: #f7374f;
//           border-radius: 50%;
//           cursor: pointer;
//         }
//         .timeline::-moz-range-thumb {
//           width: 12px;
//           height: 12px;
//           background: #f7374f;
//           border-radius: 50%;
//           cursor: pointer;
//         }
//         .timeline::-webkit-slider-runnable-track {
//           background: linear-gradient(
//             to right,
//             #f7374f 0%,
//             #f7374f ${(currentTime / bufferedDuration) * 100}%,
//             #4b5563 ${(currentTime / bufferedDuration) * 100}%,
//             #4b5563 100%
//           );
//         }
//         .timeline::-moz-range-progress {
//           background: #f7374f;
//         }
//         .timeline:hover::-webkit-slider-thumb,
//         .timeline:active::-webkit-slider-thumb {
//           background: #e12d42;
//         }
//         .timeline:hover::-moz-range-thumb,
//         .timeline:active::-moz-range-thumb {
//           background: #e12d42;
//         }
//         .time-display {
//           color: white;
//           font-size: 12px;
//           white-space: nowrap;
//         }
//         .live-status {
//           position: absolute;
//           top: 10px;
//           left: 10px; /* Move to top-left corner */
//           background: rgba(0, 0, 0, 0.7);
//           color: white;
//           padding: 4px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           cursor: pointer;
//           z-index: 1001;
//         }
//         .live-status:hover {
//           background: rgba(0, 0, 0, 0.9);
//         }
//         .live-dot {
//           width: 8px;
//           height: 8px;
//           background: #f7374f;
//           border-radius: 50%;
//           animation: pulse 1.5s infinite;
//         }
//         .live-sync-button {
//           background: rgba(0, 0, 0, 0.7);
//           color: white;
//           padding: 4px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           cursor: pointer;
//           z-index: 1001;
//         }
//         .live-sync-button:hover {
//           background: rgba(0, 0, 0, 0.9);
//         }
//         @keyframes pulse {
//           0% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//           100% {
//             opacity: 1;
//           }
//         }
//         .timeline-tooltip {
//           position: absolute;
//           bottom: 30px;
//           background: rgba(0, 0, 0, 0.8);
//           color: white;
//           padding: 4px 8px;
//           border-radius: 4px;
//           font-size: 12px;
//           transform: translateX(-50%);
//           z-index: 1001;
//           pointer-events: none;
//         }
//         .volume-container {
//           position: relative;
//           display: flex;
//           align-items: center;
//         }
//         .volume-slider {
//           position: absolute;
//           bottom: 40px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 4px;
//           height: 100px;
//           background: #4b5563;
//           border-radius: 2px;
//           appearance: none;
//           outline: none;
//           cursor: pointer;
//           writing-mode: bt-lr;
//           -webkit-appearance: slider-vertical;
//         }
//         .volume-slider::-webkit-slider-thumb {
//           appearance: none;
//           width: 10px;
//           height: 10px;
//           background: #f7374f;
//           border-radius: 50%;
//           cursor: pointer;
//         }
//         .volume-slider::-moz-range-thumb {
//           width: 10px;
//           height: 10px;
//           background: #f7374f;
//           border-radius: 50%;
//           cursor: pointer;
//         }
//         .volume-slider::-webkit-slider-runnable-track {
//           background: linear-gradient(
//             to top,
//             #f7374f 0%,
//             #f7374f ${volume}%,
//             #4b5563 ${volume}%,
//             #4b5563 100%
//           );
//         }
//         .volume-slider::-moz-range-progress {
//           background: #f7374f;
//         }
//         .volume-slider:hover::-webkit-slider-thumb,
//         .volume-slider:active::-webkit-slider-thumb {
//           background: #e12d42;
//         }
//         .volume-slider:hover::-moz-range-thumb,
//         .volume-slider:active::-moz-range-thumb {
//           background: #e12d42;
//         }
//         .disabled-button {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }
//         @media (max-width: 640px) {
//           .custom-controls {
//             padding: 8px;
//           }
//           .timeline-container {
//             margin: 0 8px;
//           }
//           .time-display {
//             font-size: 10px;
//           }
//           .live-status,
//           .live-sync-button {
//             top: 5px;
//             left: 5px;
//             font-size: 10px;
//             padding: 3px 6px;
//           }
//           .chat-modal {
//             position: fixed;
//             bottom: 0;
//             left: 0;
//             width: 100%;
//             height: 80%;
//             transform: translateY(100%);
//             transition: transform 0.3s ease;
//           }
//           .chat-modal.open {
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//       <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
//         <div className="bg-[#f7374f] p-4 text-white">
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div className="flex items-center gap-3">
//               <FaChalkboardTeacher className="text-2xl" />
//               <h1 className="text-xl md:text-2xl font-bold">
//                 {classData.data.title} - Live Class
//               </h1>
//             </div>
//             <Link
//               href="/student-dashboard/live-classes"
//               className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors flex items-center gap-1"
//             >
//               <FaArrowLeft /> All Classes
//             </Link>
//           </div>
//         </div>

//         <div className="p-4">
//           <div className="mb-6 relative">
//             {videoId ? (
//               <div
//                 className="relative w-full"
//                 ref={videoContainerRef}
//                 onMouseMove={handleInteraction}
//                 onMouseEnter={handleInteraction}
//               >
//                 <div className="relative pt-[56.25%] overflow-hidden rounded-lg shadow-lg bg-black">
//                   <div
//                     id="youtube-player"
//                     className="absolute top-0 left-0 w-full h-full"
//                   ></div>
//                   <div
//                     className="absolute top-0 left-0 w-full h-full"
//                     style={{ pointerEvents: "none" }}
//                   ></div>
//                   {isLiveStream && (
//                     <div
//                       className="live-status"
//                       onClick={syncToLive}
//                       aria-label="Sync to live"
//                     >
//                       <span className="live-dot"></span>
//                       LIVE
//                     </div>
//                   )}
//                   {showCustomPlay && (
//                     <div
//                       className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black cursor-pointer custom-play-overlay"
//                       onClick={isPlayerReady ? togglePlay : null}
//                       onDoubleClick={isPlayerReady ? handleDoubleClick : null}
//                       onMouseEnter={handleInteraction}
//                       onTouchStart={handleInteraction}
//                     >
//                       <button
//                         className={`text-white ${
//                           !isPlayerReady ? "disabled-button" : ""
//                         }`}
//                         aria-label="Play video"
//                         disabled={!isPlayerReady}
//                       >
//                         <FaPlay size={40} />
//                       </button>
//                     </div>
//                   )}
//                   {!showCustomPlay && (
//                     <div
//                       className="absolute top-0 left-0 w-full h-full cursor-pointer custom-play-overlay"
//                       onClick={isPlayerReady ? togglePlay : null}
//                       onDoubleClick={isPlayerReady ? handleDoubleClick : null}
//                       onMouseEnter={handleInteraction}
//                       onTouchStart={handleInteraction}
//                     ></div>
//                   )}
//                   {showPauseOverlay && isPlaying && (
//                     <div className="pause-overlay">
//                       <FaPause size={40} className="text-white" />
//                     </div>
//                   )}
//                   {skipNotification && (
//                     <div className="skip-notification">{skipNotification}</div>
//                   )}
//                   <div
//                     className={`bg-gray-800 p-3 flex items-center justify-between custom-controls ${
//                       showControls ? "visible" : "hidden"
//                     }`}
//                   >
//                     <div className="flex items-center space-x-2 sm:space-x-4">
//                       <button
//                         onClick={togglePlay}
//                         className={`text-white hover:text-[#f7374f] transition-colors ${
//                           !isPlayerReady ? "disabled-button" : ""
//                         }`}
//                         aria-label={isPlaying ? "Pause" : "Play"}
//                         disabled={!isPlayerReady}
//                       >
//                         {isPlaying ? (
//                           <FaPause size={20} />
//                         ) : (
//                           <FaPlay size={20} />
//                         )}
//                       </button>
//                       <button
//                         onClick={skipBackward}
//                         className={`text-white hover:text-[#f7374f] transition-colors ${
//                           !isPlayerReady ? "disabled-button" : ""
//                         }`}
//                         aria-label="Skip backward 10 seconds"
//                         disabled={!isPlayerReady}
//                       >
//                         <FaBackward size={20} />
//                       </button>
//                       <button
//                         onClick={skipForward}
//                         className={`text-white hover:text-[#f7374f] transition-colors ${
//                           !isPlayerReady ? "disabled-button" : ""
//                         }`}
//                         aria-label="Skip forward 10 seconds"
//                         disabled={!isPlayerReady}
//                       >
//                         <FaForward size={20} />
//                       </button>
//                     </div>
//                     {/* timeline container */}
//                     {/* <div className="timeline-container flex-1">
//                       <span className="time-display">
//                         {formatTime(currentTime)}
//                       </span>
//                       <div className="relative flex-1">
//                         <input
//                           type="range"
//                           className="timeline"
//                           min="0"
//                           max={bufferedDuration || 1}
//                           step="0.1"
//                           value={currentTime}
//                           onChange={handleSeek}
//                           onInput={handleSeek}
//                           onMouseMove={handleTimelineHover}
//                           onMouseLeave={handleTimelineLeave}
//                           onClick={handleTimelineHover}
//                           aria-label="Video timeline"
//                           disabled={!isPlayerReady}
//                         />
//                         {tooltipTime && (
//                           <div
//                             className="timeline-tooltip"
//                             style={{ left: `${tooltipPosition}px` }}
//                           >
//                             {tooltipTime}
//                           </div>
//                         )}
//                       </div>
//                       <button
//                         className="live-sync-button"
//                         onClick={syncToLive}
//                         aria-label="Sync to live"
//                       >
//                         <span className="live-dot"></span>
//                         Live
//                       </button>
//                     </div> */}
//                     <div className="relative flex items-center space-x-2 sm:space-x-3">
//                       <div className="volume-container">
//                         <button
//                           onClick={() => {
//                             setShowVolumeSlider(!showVolumeSlider);
//                             if (!showVolumeSlider) toggleMute();
//                           }}
//                           className="text-white hover:text-[#f7374f] transition-colors"
//                           aria-label={isMuted ? "Unmute" : "Mute"}
//                         >
//                           {isMuted || volume === 0 ? (
//                             <FaVolumeMute size={20} />
//                           ) : (
//                             <FaVolumeUp size={20} />
//                           )}
//                         </button>
//                         {showVolumeSlider && (
//                           <input
//                             type="range"
//                             className="volume-slider"
//                             min="0"
//                             max="100"
//                             step="1"
//                             value={isMuted ? 0 : volume}
//                             onChange={handleVolumeChange}
//                             aria-label="Volume control"
//                           />
//                         )}
//                       </div>
//                       <button
//                         onClick={() => setShowChat(!showChat)}
//                         className="text-white hover:text-[#f7374f] transition-colors flex items-center gap-2"
//                         aria-label="Toggle live chat"
//                       >
//                         <FaComments size={20} />
//                         <span className="text-sm hidden sm:inline">
//                           Live Chat
//                         </span>
//                       </button>
//                       <button
//                         ref={speedButtonRef}
//                         onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
//                         className="px-2 py-1 rounded text-xs bg-gray-600 text-white hover:bg-gray-500"
//                         aria-label="Toggle speed dropdown"
//                       >
//                         {playbackRate}x
//                       </button>
//                       {showSpeedDropdown && (
//                         <div className="speed-dropdown">
//                           {[0.5, 1, 1.5, 2].map((speed) => (
//                             <button
//                               key={speed}
//                               onClick={() => changeSpeed(speed)}
//                               className={`block px-4 py-2 text-xs text-white w-full text-left hover:bg-gray-600 ${
//                                 playbackRate === speed ? "bg-[#f7374f]" : ""
//                               }`}
//                               aria-label={`Play at ${speed}x speed`}
//                               disabled={!isPlayerReady}
//                             >
//                               {speed}x
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                       <button
//                         onClick={toggleFullScreen}
//                         className="text-white hover:text-[#f7374f] transition-colors"
//                         aria-label={
//                           isFullScreen
//                             ? "Exit full screen"
//                             : "Enter full screen"
//                         }
//                       >
//                         {isFullScreen ? (
//                           <FaTimes size={20} />
//                         ) : (
//                           <FaExpand size={20} />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center text-gray-500">
//                 {classData.data.videoLink
//                   ? "Invalid video URL"
//                   : "No video available for this class"}
//               </div>
//             )}
//             {/* Chat Modal */}
//             {showChat && (
//               <div
//                 className={`chat-modal bg-white shadow-xl z-2000 p-6 overflow-y-auto sm:fixed sm:top-0 sm:right-0 sm:h-full sm:w-80 md:w-96 ${
//                   showChat ? "open" : ""
//                 }`}
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                     <span className="mr-2">📢</span> Live Chat
//                   </h3>
//                   <button
//                     onClick={() => setShowChat(false)}
//                     className="text-gray-600 hover:text-[#f7374f] transition-colors"
//                     aria-label="Close chat"
//                   >
//                     <FaTimes size={20} />
//                   </button>
//                 </div>
//                 <div className="flex flex-col h-[calc(100%-4rem)]">
//                   <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
//                     {messages.map((msg) => (
//                       <div
//                         key={msg._id}
//                         className={`flex flex-col p-3 rounded-lg max-w-[85%] ${
//                           msg.createdBy._id === currentUser?._id
//                             ? "ml-auto bg-[#f7374f] text-white"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         <div className="flex items-center mb-1">
//                           {msg.createdBy.photoUrl ? (
//                             <Image
//                               src={msg.createdBy.photoUrl}
//                               alt={`${msg.createdBy.fullName}'s avatar`}
//                               className="w-6 h-6 rounded-full mr-2 object-cover"
//                               width={24}
//                               height={24}
//                               onError={(e) => {
//                                 (e.target as HTMLImageElement).src = defaultAvatar;
//                               }}
//                             />
//                           ) : (
//                             <FaUserCircle
//                               size={24}
//                               className="text-gray-500 mr-2"
//                             />
//                           )}
//                           <div className="flex-1 flex items-center justify-between">
//                             <span className="font-medium text-sm">
//                               {msg.createdBy.fullName}
//                             </span>
//                             <span className="text-xs opacity-75">
//                               {new Date(msg.createdAt).toLocaleTimeString([], {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               })}
//                             </span>
//                           </div>
//                         </div>
//                         <p className="text-sm">{msg.content}</p>
//                       </div>
//                     ))}
//                     <div ref={messagesEndRef} />
//                   </div>
//                   <div className="flex gap-3 mt-4">
//                     <input
//                       type="text"
//                       value={input}
//                       onChange={(e) => setInput(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Type your message..."
//                       className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7374f] text-sm"
//                     />
//                     <button
//                       onClick={sendMessage}
//                       className="px-4 py-3 bg-[#f7374f] text-white rounded-lg hover:bg-[#e12d42] transition-colors font-medium text-sm"
//                       disabled={!input.trim()}
//                     >
//                       Send
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2">
//               <h2 className="text-xl font-bold text-gray-800 mb-2">
//                 About This Class
//               </h2>
//               <div className="space-y-4">
//                 <p>
//                   <span className="font-medium">Subject:</span>{" "}
//                   {classData.data.subject
//                     ? classData.data.subject.charAt(0).toUpperCase() +
//                       classData.data.subject.slice(1)
//                     : "N/A"}
//                 </p>
//                 <p>
//                   <span className="font-medium">Instructor:</span>{" "}
//                   {classData.data.instructor || "N/A"}
//                 </p>
//                 <p>
//                   <span className="font-medium">Course:</span>{" "}
//                   {classData.data.course?.title || "N/A"}
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               <div className="bg-[#f7374f]/5 p-4 rounded-lg border border-[#f7374f]/10">
//                 <h3 className="font-medium text-gray-800 mb-3 flex items-center">
//                   <span className="bg-[#f7374f]/10 p-2 rounded-lg text-[#f7374f] mr-3">
//                     <FaChalkboardTeacher />
//                   </span>
//                   Class Information
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-3">
//                   This live class is part of your enrolled course. Use the
//                   custom controls below the video to manage playback and access
//                   the live chat.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveClassPage;
