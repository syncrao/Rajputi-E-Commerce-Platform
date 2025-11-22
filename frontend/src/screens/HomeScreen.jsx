import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import HomeHero from "../components/HomeHero";
import HomeCategory from "../components/HomeCategory";
import HomeSection from "../components/HomeSection";
import ReelSection from "../components/ReelSection";
import ReelViewer from "../components/ReelViewer";

export default function HomeScreen() {
  const { products, loading } = useSelector((state) => state.products);
  const suits = products.filter((obj) => obj.category === "Suit");
  const lehenga = products.filter((obj) => obj.category === "Lehenga");
  const poshak = products.filter((obj) => obj.category === "Poshak");
  const duppata = products.filter((obj) => obj.category === "Dupatta");
  const videoProducts = products.filter((obj) => obj.video);

  const [visibleCount, setVisibleCount] = useState(5);
  const [showReelViewer, setShowReelViewer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 400
      ) {
        setVisibleCount((prev) => Math.min(prev + 5, videoProducts.length));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [videoProducts.length]);

  return (
    <div className="min-h-screen bg-white">
      <HomeHero />
      <HomeCategory />

      {videoProducts.length > 0 && (
        <div
          id="reel-scroll-container"
          className="flex gap-4 overflow-x-auto p-4 lg:p-8 scrollbar-hide snap-x snap-mandatory"
        >
          {videoProducts.slice(0, visibleCount).map((product, index) => (
            <div key={product._id || product.id} className="snap-center">
              <ReelSection
                videoUrl={product.video}
                thumbnailUrl={product.images?.[0]?.image}
                index={index}
                onClick={() => {
                  setSelectedIndex(index);
                  setShowReelViewer(true);
                }}
              />
            </div>
          ))}
        </div>
      )}

      <HomeSection
        title="Latest Suits"
        items={suits}
        category="suit"
        loading={loading}
      />
      <HomeSection
        title="Latest Lehenga"
        items={lehenga}
        category="lehenga"
        loading={loading}
      />
      <HomeSection
        title="Latest Poshak"
        items={poshak}
        category="poshak"
        loading={loading}
      />
      <HomeSection
        title="Latest Dupatta"
        items={duppata}
        category="dupatta"
        loading={loading}
      />

      {showReelViewer && (
        <ReelViewer
          reels={videoProducts}
          initialIndex={selectedIndex}
          onClose={() => setShowReelViewer(false)}
        />
      )}
    </div>
  );
}
