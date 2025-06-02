import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page youare looking for doesnot exist.</p>
        <Link href="/" className="text-orange-400 hover:text-orange-500 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
} 