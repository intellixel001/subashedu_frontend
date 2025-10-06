"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

interface HlsPlayerProps {
  src: string; // e.g., "https://stream.intelixel.com:8012/live/mystream.m3u8"
}

export default function HlsPlayer({ src }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play();
      });
      return () => hls.destroy();
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari
      videoRef.current.src = src;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current?.play();
      });
    }
  }, [src]);

  return <video ref={videoRef} controls width="100%" />;
}

//   GNU nano 6.2                                                                                                                                                                                                                                                                                                         /etc/nginx/nginx.conf
// user www-data;
// worker_processes auto;
// worker_cpu_affinity auto;
// pid /run/nginx.pid;
// error_log /var/log/nginx/error.log;
// include /etc/nginx/modules-enabled/*.conf;

// events {
//     worker_connections 768;
//     # multi_accept on;
// }

// # -----------------------------
// # RTMP Server for OBS Streaming
// # -----------------------------
// rtmp {
//     server {
//         listen 1935;                  # RTMP port
//         chunk_size 4096;

//         application live {
//             live on;
//             record off;

//             # HLS settings
//             hls on;
//             hls_path /tmp/hls;
//             hls_fragment 2s;
//             hls_playlist_length 10s;

//             allow publish all;         # allow streaming from OBS
//             allow play all;
//         }
//     }
// }

// # -----------------------------
// # HTTP Server for HLS Playback
// # -----------------------------
// http {
//     sendfile on;
//     tcp_nopush on;
//     types_hash_max_size 2048;
//     server_tokens build;

//     include /etc/nginx/mime.types;
//     default_type application/octet-stream;

//     # SSL Settings
//     ssl_protocols TLSv1.2 TLSv1.3;
//     ssl_prefer_server_ciphers off;

//     access_log /var/log/nginx/access.log;

//     gzip on;

//     include /etc/nginx/conf.d/*.conf;
//     include /etc/nginx/sites-enabled/*;

//     # Default server for HTTP
//         # Secure HTTPS server for HLS playback
//     server {
//         listen 443 ssl;
//         server_name stream.intelixel.com;

//         # SSL certs from Let's Encrypt (after running certbot)
//     ssl_certificate /etc/letsencrypt/live/stream.intelixel.com/fullchain.pem; # managed by Certbot
//     ssl_certificate_key /etc/letsencrypt/live/stream.intelixel.com/privkey.pem; # managed by Certbot

//         # Serve static files if needed
//         location / {
//             root /usr/share/nginx/html;
//         }

//         # HLS playback path (HTTPS)
//         location /live/ {
//             types {
//                 application/vnd.apple.mpegurl m3u8;
//                 video/mp2t ts;
//             }

//             alias /tmp/hls/;
//             add_header Cache-Control no-cache;
//             add_header 'Access-Control-Allow-Origin' '*' always;
//             add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
//             add_header 'Access-Control-Allow-Headers' 'Origin, Range' always;
//             add_header 'Access-Control-Expose-Headers' 'Content-Length, Content-Range' always;
//         }

// }

// }

// # -----------------------------
// # Mail module (commented out)
// # -----------------------------
// #mail {
// #       server {
// #               listen     localhost:110;
// #               protocol   pop3;
// #               proxy      on;
// #       }
// #       server {
// #               listen     localhost:143;
// #               protocol   imap;
// #               proxy      on;
// #       }
