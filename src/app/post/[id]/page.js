"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PostDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPost(docSnap.data());
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
                <p className="text-gray-500 text-lg animate-pulse font-serif">
                    Loading story...
                </p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] text-gray-700">
                <p className="text-lg text-center px-4">
                    This story doesn’t exist or has been removed.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="mt-5 px-6 py-2.5 bg-black text-white rounded-full hover:bg-gray-900 transition"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] px-5 sm:px-6 md:px-10 py-10">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition"
                    >
                        ← Back to posts
                    </Link>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-snug mb-4">
                    {post.title}
                </h1>

                {/* Date */}
                <p className="text-gray-500 text-sm md:text-base mb-10">
                    {post.createdAt?.toDate
                        ? new Date(post.createdAt.toDate()).toLocaleDateString()
                        : "Unknown date"}
                </p>

                {/* Post Content */}
                <div className="prose prose-base sm:prose-lg md:prose-xl text-gray-800 leading-relaxed max-w-none">
                    {post.content.split("\n").map((para, i) => (
                        <p key={i} className="mb-5">
                            {para}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
