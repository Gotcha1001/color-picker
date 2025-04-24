import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen text-white flex flex-col gradient-bg">
      <Head>
        <title>Color Extractor</title>
      </Head>
      <nav className="bg-black/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <svg
                  className="h-8 w-8 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                <span className="font-bold text-xl">Color Extractor</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/upload"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Upload
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Extract Beautiful Colors From Any Image
              </h1>
              <p className="mt-6 text-xl">
                Upload your images and instantly discover the dominant color
                palette with precise hex codes and percentages.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Link
                  href="/upload"
                  className="inline-block bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-bold shadow-lg"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="inline-block bg-transparent border-2 border-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-bold"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/color.jpg"
                alt="Color Extraction Example"
                width={500}
                height={300}
                className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <div id="features" className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">1. Upload Image</h3>
                <p>
                  Select any image from your device to analyze its color
                  palette.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">2. Extract Colors</h3>
                <p>
                  Our advanced algorithm identifies the dominant colors and
                  their proportions.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">3. Download Palette</h3>
                <p>
                  Get precise hex codes and RGB values for use in your projects.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center my-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Extract Colors?
            </h2>
            <p className="text-xl mb-8">
              Upload your image now and discover its unique color palette.
            </p>
            <Link
              href="/upload"
              className="inline-block bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-200 transition-colors font-bold shadow-lg text-lg"
            >
              Start Extracting Colors
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 bg-black/20 backdrop-blur-md mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>Color Extractor - Find the dominant colors in any image</p>
          <p className="text-sm mt-2 text-white/70">
            © 2025 Color Extractor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
