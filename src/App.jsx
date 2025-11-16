import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import FavoritesPage from './pages/FavoritesPage'
import RecipeDetail from './pages/RecipeDetail'
import MyRecipes from './pages/MyRecipes'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          {/* optional: add edit route later: <Route path="/edit-recipe/:id" ... /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
