"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // For icons

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    Blogify
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-6 font-medium">
                    <Link href="/" className="hover:text-blue-500 transition-colors">
                        Home
                    </Link>
                    <Link href="/create" className="hover:text-blue-500 transition-colors">
                        Write
                    </Link>
                    <Link href="/login" className="hover:text-blue-500 transition-colors">
                        Login
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-700 hover:text-blue-600"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <nav className="flex flex-col items-end pe-6 space-y-4 py-4 font-medium">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-blue-500 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/create"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-blue-500 transition-colors"
                        >
                            Write
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-blue-500 transition-colors"
                        >
                            Login
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
