import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { X } from "lucide-react";

export default function ReelViewer({ reels, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const containerRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, clientHeight } = containerRef.current;
    const newIndex = Math.round(scrollTop / clientHeight);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: initialIndex * window.innerHeight, behavior: "instant" });
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full"
      >
        <X size={24} />
      </button>
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory"
      >
        {reels.map((reel, i) => {
          const active = i === currentIndex;
          const videoUrl = reel.video.startsWith("http")
            ? reel.video
            : `https://res.cloudinary.com/dhtj6kwtx/${reel.video}`;
          const optimizedUrl = videoUrl.replace("/upload/", "/upload/q_auto,f_auto/");

          return (
            <div
              key={reel._id || reel.id}
              className="h-screen w-full snap-start flex items-center justify-center bg-black"
            >
              <ReactPlayer
                src={optimizedUrl}
                playing={active}
                loop
                muted={false}
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
