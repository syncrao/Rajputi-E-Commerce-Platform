import { useSelector } from "react-redux";
import HomeHero from "../components/HomeHero";
import HomeCategory from "../components/HomeCategory";
import HomeSection from "../components/HomeSection";
import ReelSection from "../components/ReelSection";

export default function HomeScreen() {
  const { products, loading, error } = useSelector((state) => state.products);
  const suits = products.filter((obj) => obj.category == "Suit");
  const lehenga = products.filter((obj) => obj.category == "Lehenga");
  const poshak = products.filter((obj) => obj.category == "Poshak");
  const duppata = products.filter((obj) => obj.category == "Dupatta");

  return (
    <div className="min-h-screen bg-white">
      <HomeHero />
      <HomeCategory />

      
      <div className="p-4">
      

        {products[0].video && (
          <ReelSection
            videoUrl={products[0].video}
            thumbnailUrl={products[0].images[0]?.image} // main image
          />
        )}
      </div>
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
