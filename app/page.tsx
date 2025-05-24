import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-[#121212] text-amber-50 overflow-hidden">
      <Navbar />
      <div className="mt-10">
        <div className="text-center mb-16 max-w-6xl mx-auto">
          <h1 className="text-[2rem] md:text-6xl font-bold mb-6 tracking-tight">
            Designed for the Way You Work
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum in ipsum eos!
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
