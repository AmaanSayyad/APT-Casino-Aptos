import HeaderText from "@/components/HeaderText";
import GameCarousel from "@/components/GameCarousel";
import MostPlayed from "@/components/MostPlayed";
import GameStats from "@/components/GameStats";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sharp-black to-[#150012] text-white">
      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16">
        
        <div className="mb-10">
          
          <GameCarousel />
        </div>
        
        <MostPlayed />
      </div>
    </div>
  );
}
