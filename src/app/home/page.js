"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { BookmarkIcon as OutlineBookmarkIcon } from "@heroicons/react/24/outline";

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = "/login";
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  const handleSaveBlog = async (post) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "library", `${user.uid}_${post.id}`), {
        ...post,
        savedBy: user.uid,
        savedAt: new Date(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
        <p className="text-gray-500 text-lg animate-pulse font-serif">
          Loading stories...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 sm:px-6 md:px-10 lg:px-20 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900">
            Blogify
          </h1>

          {user && (
            <div className="flex items-center gap-3">
              <Link
                href="/create"
                className="px-4 py-1.5 bg-black text-white text-md rounded-md hover:bg-gray-900 transition"
              >
                + New Blog
              </Link>

              <Link
                href="/library"
                className="px-4 py-1.5 border border-black text-black rounded-md hover:bg-black hover:text-white transition"
              >
                Library
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 border border-black text-black rounded-md hover:bg-black hover:text-white transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Intro */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-snug">
            Discover Stories & Ideas
          </h1>
          <p className="text-gray-600 mt-3 sm:mt-4 text-base sm:text-lg font-light max-w-2xl mx-auto px-2">
            Thoughts, ideas, and insights from creative writers around the world.
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 text-base sm:text-lg">
            No posts yet. Be the first to{" "}
            <Link href="/create" className="text-black underline font-medium">
              write one
            </Link>
            !
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative shadow-sm rounded-lg p-6 flex flex-col gap-3 hover:shadow-md transition"
              >
                {/* Author and Date */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                     <span>{post.author || "Anonymous"}</span>
                    <span>·</span>
                    <span>
                      {post.createdAt?.toDate
                        ? post.createdAt.toDate().toLocaleString("en-US", {
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>

                  {/* Bookmark Icon */}
                  <button
                    onClick={() => handleSaveBlog(post)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <OutlineBookmarkIcon className="w-5 h-5 text-black" />
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-gray-900 hover:underline">
                  <Link href={`/post/${post.id}`}>{post.title}</Link>
                </h2>

                {/* Content snippet */}
                <p className="text-gray-700 text-base sm:text-lg line-clamp-4">
                  {post.content.length > 300
                    ? post.content.slice(0, 300) + "..."
                    : post.content}
                </p>

                {/* Read More */}
                <div>
                  <Link
                    href={`/post/${post.id}`}
                    className="text-black font-medium hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
