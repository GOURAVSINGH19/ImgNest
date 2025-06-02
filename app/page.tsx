"use client"
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Img from "@/public/home-page.png"
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user } = useUser();
  return (
    <div className="w-screen h-screen bg-[#121212] text-amber-50 overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6">
            <span className="text-orange-400">YOUR</span> <span className="text-white">FILES,</span>
            <br />
            <span className="text-orange-400">YOUR</span> <span className="text-white">AUTHORITY.</span>
          </h1>

          <p className="text-gray-300 text-sm mb-8 max-w-2xl mx-auto">
            Coordinate and access projects from any device
          </p>

          <Link href={user ? "/dashboard" : "/sign-in"}>
            <Button className="text-white px-4 py-2 text-lg rounded-sm bg-[#22c55e] cursor-pointer duration-500 transform ease-in-out">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="rounded-lg p-2 md:p-6 max-w-5xl mx-auto ph-bg">
          <Image
            src={Img}
            alt="img"
            loading="lazy"
            className="w-full h-full"
          />
        </div>
      </main>
    </div>
  );
}
