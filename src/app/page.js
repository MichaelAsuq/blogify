"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-serif font-bold">Blogify</h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden border border-gray-300 p-2 rounded-md"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 flex flex-col items-center py-6 space-y-5 md:hidden shadow-lg">
            <Link
              href="/login"
              className="text-lg font-medium hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-lg font-medium px-5 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="text-center mt-16 px-6">
        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">
          Discover stories, ideas, and insights.
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg mb-8">
          Read and write thoughtful pieces that matter. Blogify connects writers
          and readers through words that inspire.
        </p>
        <Link
          href="/signup"
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition"
        >
          Start Writing
        </Link>
      </section>

      {/* Example Blog Previews */}
      <section className="mt-20 px-6 md:px-12 lg:px-20">
        <h3 className="text-xl font-semibold mb-8 font-serif">Trending Blogs</h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "The Art of Writing in the Digital Age",
              author: "Sarah James",
              date: "October 2025",
            },
            {
              title: "Why Minimalism Wins in Modern Design",
              author: "John Doe",
              date: "October 2025",
            },
            {
              title: "How AI Is Changing the Future of Creativity",
              author: "Ada Lovelace",
              date: "October 2025",
            },
          ].map((blog, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
            >
              <h4 className="text-lg font-bold mb-2 font-serif">
                {blog.title}
              </h4>
              <p className="text-sm text-gray-500 mb-1">{blog.author}</p>
              <p className="text-sm text-gray-400">{blog.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-6 border-t border-gray-200 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Blogify — Built with ❤️ for readers and writers.
      </footer>
    </div>
  );
}
