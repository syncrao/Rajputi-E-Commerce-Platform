import { useSelector } from "react-redux";
import HomeHero from "../components/HomeHero";
import HomeCategory from "../components/HomeCategory";
import HomeSection from "../components/HomeSection";

export default function HomeScreen() {
  const { products, loading, error } = useSelector((state) => state.products);
  const suits = products.filter(obj => obj.category == "Suit")
  const lehenga = products.filter(obj => obj.category == "Lehenga")
  const poshak = products.filter(obj => obj.category == "Poshak")
  const duppata = products.filter(obj => obj.category == "Dupatta")

  return (
    <div className="min-h-screen bg-white">
      <HomeHero/>
      <HomeCategory/>
      <HomeSection title="Latest Suits" items={suits} category="Suit" loading={loading} />
      <HomeSection title="Latest Lehenga" items={lehenga} category="Lehenga" loading={loading} />
      <HomeSection title="Latest Poshak" items={poshak} category="Poshak" loading={loading} />
      <HomeSection title="Latest Dupatta" items={duppata} category="Dupatta" loading={loading} />
    </div>
  );
}
