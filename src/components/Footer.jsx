import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-br from-pink-50 via-orange-50 to-pink-50 border-t border-white/40 backdrop-blur-xl py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
            RecipeShare
          </h2>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            Discover delicious recipes from around the world.  
            Share your own creations and save your favorites.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a className="text-gray-600 hover:text-pink-500 transition" href="#">
              <Facebook size={22} />
            </a>
            <a className="text-gray-600 hover:text-pink-500 transition" href="#">
              <Instagram size={22} />
            </a>
            <a className="text-gray-600 hover:text-pink-500 transition" href="#">
              <Youtube size={22} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-gray-800 text-lg">Quick Links</h3>

          <Link to="/" className="text-gray-600 text-sm hover:text-pink-500">
            Home
          </Link>
          <Link to="/favorites" className="text-gray-600 text-sm hover:text-pink-500">
            Favorites
          </Link>
          <Link to="/my-recipes" className="text-gray-600 text-sm hover:text-pink-500">
            My Recipes
          </Link>
          <Link to="/auth" className="text-gray-600 text-sm hover:text-pink-500">
            Sign In
          </Link>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">Stay Updated</h3>
          <p className="text-gray-600 text-sm mt-2">
            Subscribe to get new recipes delivered to your inbox ✨
          </p>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm"
            />
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-xl shadow hover:shadow-md transition">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center mt-12 text-gray-500 text-xs">
        © {new Date().getFullYear()} RecipeShare — Made with ❤️  
      </div>
    </footer>
  );
}
