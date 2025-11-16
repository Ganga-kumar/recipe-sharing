import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import RecipeList from '../components/RecipeList'
import AddRecipe from '../components/AddRecipe'
import useAuth from '../hooks/useAuth'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

// HomePage now shows default recipes from TheMealDB API and allows searching.
// AddRecipe is visible only when signed in.

export default function HomePage(){
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiMode, setApiMode] = useState(true)

  useEffect(()=>{
    fetchDefaultFromAPI()
  },[])

  // Load default recipes from TheMealDB
  async function fetchDefaultFromAPI(){
    setLoading(true)
    try{
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken')
      const data = await res.json()

      const mapped = (data.meals || []).map(m => ({
        id: m.idMeal,
        title: m.strMeal,
        description: m.strInstructions,
        image: (m.strMealThumb || '').replace(/^http:/i, 'https:'), // force HTTPS
        author: m.strArea || 'TheMealDB'
      }))

      setRecipes(mapped)
      console.log('Default recipes:', mapped.slice(0,5))
      setApiMode(true)
    }catch(err){
      console.error('API fetch failed', err)
      setRecipes([])
    }
    setLoading(false)
  }

  // Search recipes (API first, fallback to Firestore)
  async function handleSearch(q){
    if(!q.trim()){
      return fetchDefaultFromAPI()
    }

    setLoading(true)

    try{
      const res = await fetch(
        'https://www.themealdb.com/api/json/v1/1/search.php?s=' + encodeURIComponent(q)
      )
      const data = await res.json()

      const mapped = (data.meals || []).map(m => ({
        id: m.idMeal,
        title: m.strMeal,
        description: m.strInstructions,
        image: (m.strMealThumb || '').replace(/^http:/i, 'https:'), 
        author: m.strArea || 'TheMealDB'
      }))

      console.log('API search results:', mapped.slice(0,5))

      if(mapped.length === 0){
        // Firestore fallback
        const snap = await getDocs(collection(db, 'recipes'))
        const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        const filtered = arr.filter(r =>
          (r.title || '').toLowerCase().includes(q.toLowerCase()) ||
          (r.description || '').toLowerCase().includes(q.toLowerCase())
        )
        setRecipes(filtered)
        setApiMode(false)
      } else {
        setRecipes(mapped)
        setApiMode(true)
      }
    }catch(err){
      console.error('Search failed', err)
      setRecipes([])
    }

    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SearchBar onSearch={handleSearch} />
          <div className="mt-6">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {apiMode && (
                  <div className="mb-4 text-sm text-gray-600">
                    Showing results from TheMealDB (public API)
                  </div>
                )}
                {!apiMode && (
                  <div className="mb-4 text-sm text-gray-600">
                    Showing results from your Firestore recipes
                  </div>
                )}

                <RecipeList recipes={recipes} />
              </>
            )}
          </div>
        </div>

        <aside>
          {user ? (
            <AddRecipe onAdded={(r)=>setRecipes(prev=>[r, ...prev])} />
          ) : (
            <div className="p-4 border rounded">
              <h4 className="font-semibold mb-2">Add a recipe</h4>
              <p className="text-sm text-gray-600">
                Please <a href="/auth" className="text-blue-600">sign in</a> to upload recipes.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
