import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";

export default function ReelSection({ videoUrl, thumbnailUrl, index, onClick }) {
  const CLOUDINARY_BASE = "https://res.cloudinary.com/dhtj6kwtx/";
  const normalized = videoUrl.startsWith("http") ? videoUrl : CLOUDINARY_BASE + videoUrl;
  const optimizedUrl = normalized.replace("/upload/", "/upload/q_auto,f_auto/");

  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        root: document.querySelector("#reel-scroll-container"),
        rootMargin: "0px",
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // 🔹 Auto-play only first video for 3 seconds
  useEffect(() => {
    if (isVisible && index === 0) {
      setPlaying(true);
      const timer = setTimeout(() => setPlaying(false), 3000); // stop after 3s
      return () => clearTimeout(timer);
    } else {
      setPlaying(false);
    }
  }, [isVisible, index]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="w-24 h-full rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-black cursor-pointer"
    >
      {isVisible ? (
        <ReactPlayer
          src={optimizedUrl}
          playing={playing}
          loop={true}
          muted
          controls={false}
          width="100%"
          height="100%"
          playsinline
        />
      ) : (
        <img
          src={thumbnailUrl}
          alt="reel preview"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}
