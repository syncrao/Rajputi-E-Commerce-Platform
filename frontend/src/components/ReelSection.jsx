import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";

export default function ReelSection({ videoUrl, thumbnailUrl }) {
  const CLOUDINARY_BASE = "https://res.cloudinary.com/dhtj6kwtx/";
  const normalized = videoUrl.startsWith("http") ? videoUrl : CLOUDINARY_BASE + videoUrl;
  const optimizedUrl = normalized.replace("/upload/", "/upload/q_auto,f_auto/");

  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  // Observe horizontal visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        root: document.querySelector("#reel-scroll-container"), // scroll container
        rootMargin: "0px",
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-24 h-full rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-black"
    >
      {isVisible ? (
        <ReactPlayer
          src={optimizedUrl}
          playing
          loop
          muted
          controls={true}
          width="100%"
          height="100%"
          playsinline
        />
      ) : (
        <img
          src={thumbnailUrl}
          alt="reel preview"
          className="w-full h-full object-cover object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}
