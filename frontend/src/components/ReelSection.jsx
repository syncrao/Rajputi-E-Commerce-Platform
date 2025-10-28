import ReactPlayer from "react-player";

export default function ReelSection({ videoUrl }) {
  const CLOUDINARY_BASE = "https://res.cloudinary.com/dhtj6kwtx/";
  const normalizedVideoUrl = videoUrl.startsWith("http")
    ? videoUrl
    : CLOUDINARY_BASE + videoUrl;

  // Cloudinary optimized playback
  const optimizedUrl = normalizedVideoUrl.replace(
    "/upload/",
    "/upload/q_auto,f_auto/"
  );

  return (
    <div className="w-40  rounded-2xl overflow-hidden shadow-lg">
      <ReactPlayer
        src={normalizedVideoUrl}
        playing={true}    // auto play
        loop={true}       // allow autoplay
        controls={true}  // hide controls
        width="100%"
        height="auto"
        playsinline
      />
    </div>
  );
}
