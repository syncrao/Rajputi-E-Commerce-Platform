import { useSelector } from "react-redux";
import HomeHero from "../components/HomeHero";
import HomeCategory from "../components/HomeCategory";
import HomeSection from "../components/HomeSection";
import ReelSection from "../components/ReelSection";
import { useState, useEffect } from "react";

export default function HomeScreen() {
  const { products, loading} = useSelector((state) => state.products);
  const suits = products.filter((obj) => obj.category == "Suit");
  const lehenga = products.filter((obj) => obj.category == "Lehenga");
  const poshak = products.filter((obj) => obj.category == "Poshak");
  const duppata = products.filter((obj) => obj.category == "Dupatta");
  const [visibleCount, setVisibleCount] = useState(2)
  const videoProducts = products.filter((obj) => obj.video);

   useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) {
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
          className="flex gap-4 overflow-x-auto p-4 scrollbar-hide snap-x snap-mandatory"
        >
          {videoProducts.map((product) => (
            <div key={product._id || product.id} className="snap-center">
              <ReelSection
                videoUrl={product.video}
                thumbnailUrl={product.images?.[0]?.image}
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
    </div>
  );
}
