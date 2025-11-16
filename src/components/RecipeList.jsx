import React from 'react'
import RecipeCard from './RecipeCard'

export default function RecipeList({recipes = [], onToggleFav}){
  if(!recipes.length) return <div className="p-6 text-center text-gray-500">No recipes found.</div>
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(r => (
        <RecipeCard onToggleFav={onToggleFav} key={r.id || r._id} recipe={r} />
      ))}
    </div>
  )
}