import { useSelector } from "react-redux";
import HomeHero from "../components/HomeHero";
import HomeCategory from "../components/HomeCategory";
import HomeSection from "../components/HomeSection";

export default function HomeScreen() {
  const { products, loading, error } = useSelector((state) => state.products);
  const suits = products.filter(obj => obj.category == "Suit")
  const lehenga = products.filter(obj => obj.category == "Lehenga")

  return (
    <div className="min-h-screen bg-white">
      <HomeHero/>
      <HomeCategory/>
      <HomeSection title="Latest Suits" items={suits} loading={loading} />
      <HomeSection title="Latest Lehenga" items={lehenga} loading={loading} />
    </div>
  );
}
