import React, { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    // Disable body scroll (so footer can't appear)
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="page-loader">
      <div className="loader">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`bar${i + 1}`}></div>
        ))}
      </div>

      <style>{`
        /* --- Container only covers page content (not header) --- */
        .page-loader {
          position: fixed;
          top: var(--header-height, 64px); /* adjust if header height differs */
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(4px);
          z-index: 5; /* below header but above content */
          pointer-events: all;
        }

        .loader {
          position: relative;
          width: 54px;
          height: 54px;
        }

        .loader div {
          width: 8%;
          height: 24%;
          background: gray;
          position: absolute;
          left: 50%;
          top: 30%;
          opacity: 0;
          border-radius: 50px;
          animation: fade458 1s linear infinite;
        }

        @keyframes fade458 {
          from { opacity: 1; }
          to { opacity: 0.25; }
        }

        .loader .bar1  { transform: rotate(0deg) translate(0, -130%); animation-delay: 0s; }
        .loader .bar2  { transform: rotate(30deg) translate(0, -130%); animation-delay: -1.1s; }
        .loader .bar3  { transform: rotate(60deg) translate(0, -130%); animation-delay: -1s; }
        .loader .bar4  { transform: rotate(90deg) translate(0, -130%); animation-delay: -0.9s; }
        .loader .bar5  { transform: rotate(120deg) translate(0, -130%); animation-delay: -0.8s; }
        .loader .bar6  { transform: rotate(150deg) translate(0, -130%); animation-delay: -0.7s; }
        .loader .bar7  { transform: rotate(180deg) translate(0, -130%); animation-delay: -0.6s; }
        .loader .bar8  { transform: rotate(210deg) translate(0, -130%); animation-delay: -0.5s; }
        .loader .bar9  { transform: rotate(240deg) translate(0, -130%); animation-delay: -0.4s; }
        .loader .bar10 { transform: rotate(270deg) translate(0, -130%); animation-delay: -0.3s; }
        .loader .bar11 { transform: rotate(300deg) translate(0, -130%); animation-delay: -0.2s; }
        .loader .bar12 { transform: rotate(330deg) translate(0, -130%); animation-delay: -0.1s; }
      `}</style>
    </div>
  );
}
