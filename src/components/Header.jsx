// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <header className="backdrop-blur-xl bg-white/30 shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent tracking-wide"
        >
          RecipeShare
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link className="text-gray-700 hover:text-pink-600 transition font-medium" to="/">
            Home
          </Link>

          <Link className="text-gray-700 hover:text-pink-600 transition font-medium" to="/favorites">
            Favorites
          </Link>

          {user && (
            <Link className="text-gray-700 hover:text-pink-600 transition font-medium" to="/my-recipes">
              My Recipes
            </Link>
          )}

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-gray-200/70 hover:bg-gray-300 transition shadow-sm font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md hover:shadow-lg font-semibold transition"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
