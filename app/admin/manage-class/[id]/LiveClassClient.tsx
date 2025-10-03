"use client";
import { useEffect, useState } from "react";
import { Class } from "../page";

export default function LiveClassClient({ liveClass }: { liveClass: Class }) {
  const [now, setNow] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive] = useState(liveClass.isActiveLive);

  // Countdown for upcoming classes
  useEffect(() => {
    if (liveClass.type !== "live") return;

    const interval = setInterval(() => {
      const startTime = new Date(liveClass.startTime).getTime();
      const current = new Date().getTime();
      const diff = startTime - current;
      setTimeLeft(diff > 0 ? diff : 0);
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [liveClass]);

  const canStart =
    liveClass.type === "live" &&
    now >= new Date(liveClass.startTime) &&
    !isActive;
  const showCountdown =
    liveClass.type === "live" && now < new Date(liveClass.startTime);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const startLiveClass = async () => {
    try {
      navigator.clipboard.writeText(
        `rtmp://stream.intelixel.com/live/${liveClass.videoLink}`
      );
      alert("Stream URL & Key copied! Open OBS and start streaming.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-xl text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        {liveClass.title}
      </h1>

      {showCountdown && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">
            Class starts in
          </h2>
          <div className="text-3xl font-mono">{formatTime(timeLeft)}</div>
        </div>
      )}

      {canStart && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-green-400 mb-2">
            Ready to Start
          </h2>
          <button
            onClick={startLiveClass}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            Start Live
          </button>
        </div>
      )}

      {isActive && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-400 mb-2 text-center">
            🔴 Live Now
          </h2>
          <video
            controls
            autoPlay
            className="w-full h-[60vh] rounded-lg shadow-lg border border-red-500"
          >
            <source
              src={liveClass.hlsUrl}
              type="application/vnd.apple.mpegurl"
            />
            Your browser does not support HLS.
          </video>
        </div>
      )}

      {liveClass.type !== "live" && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-400 mb-2 text-center">
            Recorded Class
          </h2>
          <video
            controls
            className="w-full h-[60vh] rounded-lg shadow-lg border border-blue-500"
            src={liveClass.videoLink}
          />
        </div>
      )}
    </div>
  );
}

//   GNU nano 6.2                                                                                                                                                                                                                                                                                                         /etc/nginx/nginx.conf
// user www-data;
// worker_processes auto;
// pid /run/nginx.pid;
// include /etc/nginx/modules-enabled/*.conf;

// events {
//         worker_connections 768;
//         # multi_accept on;
// }

// http {

//         ##
//         # Basic Settings
//         ##

//         sendfile on;
//         tcp_nopush on;
//         types_hash_max_size 2048;
//         # server_tokens off;

//         # server_names_hash_bucket_size 64;
//         # server_name_in_redirect off;

//         include /etc/nginx/mime.types;
//         default_type application/octet-stream;

//         ##
//         # SSL Settings
//         ##

//         ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
//         ssl_prefer_server_ciphers on;

//         ##
//         # Logging Settings
//         ##

//         access_log /var/log/nginx/access.log;
//         error_log /var/log/nginx/error.log;

//         ##
//         # Gzip Settings
//         ##

//         gzip on;

//         # gzip_vary on;
//         # gzip_proxied any;
//         # gzip_comp_level 6;
//         # gzip_buffers 16 8k;
//         # gzip_http_version 1.1;
//         # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

//         ##
//         # Virtual Host Configs
//         ##

//         include /etc/nginx/conf.d/*.conf;
//         include /etc/nginx/sites-enabled/*;
// }

// #mail {
// #       # See sample authentication script at:
// #       # http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript
// #
// #       # auth_http localhost/auth.php;
// #       # pop3_capabilities "TOP" "USER";
// #       # imap_capabilities "IMAP4rev1" "UIDPLUS";
// #
// #       server {
// #               listen     localhost:110;
// #               protocol   pop3;
// #               proxy      on;
// #       }
// #
// #       server {
// #               listen     localhost:143;
// #               protocol   imap;
// #               proxy      on;
// #       }
// #}
