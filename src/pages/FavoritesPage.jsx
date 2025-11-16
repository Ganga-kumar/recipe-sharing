// src/pages/FavoritesPage.jsx
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import RecipeList from '../components/RecipeList'
import { useNavigate } from 'react-router-dom'

export default function FavoritesPage(){
  const { user, loading } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    if(!loading && user){
      loadFavorites()
    } else if(!loading && !user){
      setRecipes([])
    }
  },[user, loading])

  async function loadFavorites(){
    setLoadingRecipes(true)
    try{
      const favsRef = collection(db, 'favorites')
      const q = query(favsRef, where('uid', '==', user.uid))
      const snap = await getDocs(q)
      const favDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }))

      if(favDocs.length === 0){
        setRecipes([])
        setLoadingRecipes(false)
        return
      }

      // For each favorite, try Firestore recipe first; if missing, fetch from TheMealDB API
      const recipePromises = favDocs.map(async fav => {
        const recipeId = fav.recipeId
        // 1) Try Firestore
        try{
          const recipeSnap = await getDoc(doc(db, 'recipes', recipeId))
          if(recipeSnap.exists()){
            return { id: recipeSnap.id, ...(recipeSnap.data()), _favDocId: fav.id }
          }
        }catch(err){
          // continue to try API
          console.warn('Error fetching recipe doc', err)
        }

        // 2) Fallback: try TheMealDB API lookup
        try{
          const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(recipeId)}`)
          const data = await res.json()
          if(data && data.meals && data.meals.length > 0){
            const m = data.meals[0]
            return {
              id: m.idMeal,
              title: m.strMeal,
              description: m.strInstructions,
              image: (m.strMealThumb || '').replace(/^http:/i, 'https:'),
              author: m.strArea || 'TheMealDB',
              _favDocId: fav.id
            }
          }
        }catch(err){
          console.warn('MealDB lookup failed', err)
        }

        // 3) Not found anywhere — return null (will be filtered out)
        return null
      })

      const results = await Promise.all(recipePromises)
      const filtered = results.filter(Boolean)
      setRecipes(filtered)
    }catch(err){
      console.error('Failed to load favorites', err)
      setRecipes([])
    }
    setLoadingRecipes(false)
  }

  // optional: allow removing favorite directly from Favorites page
  async function removeFavorite(favDocId){
    try{
      await deleteDoc(doc(db, 'favorites', favDocId))
      // remove locally
      setRecipes(prev => prev.filter(r => r._favDocId !== favDocId))
    }catch(err){
      console.error('Failed to remove favorite', err)
      alert('Could not remove favorite: ' + err.message)
    }
  }

  if(loading) return <div className="p-6">Loading...</div>
  if(!user) return <div className="p-6">Please sign in to view favorites.</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Your favorites</h2>
        <div className="text-sm text-gray-500">{loadingRecipes ? 'Refreshing...' : `${recipes.length} items`}</div>
      </div>

      {loadingRecipes ? (
        <div className="p-6 text-center">Loading favorites...</div>
      ) : recipes.length === 0 ? (
        <div className="p-6 text-center text-gray-600">No favorites yet.</div>
      ) : (
        <>
          <RecipeList recipes={recipes} />
          <div className="mt-4 space-x-2">
            {/* show remove buttons for each item (optional UI) */}
            {recipes.map(r => (
              r._favDocId ? (
                <button
                  key={r._favDocId}
                  onClick={() => removeFavorite(r._favDocId)}
                  className="px-3 py-1 text-sm border rounded mr-2"
                >
                  Remove {r.title.length>20? `${r.title.slice(0,20)}...` : r.title}
                </button>
              ) : null
            ))}
          </div>
        </>
      )}
    </div>
  )
}
