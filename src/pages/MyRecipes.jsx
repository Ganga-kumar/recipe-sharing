// src/pages/MyRecipes.jsx
import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import RecipeList from '../components/RecipeList';
import { useNavigate } from 'react-router-dom';

export default function MyRecipes() {
  const { user, loading } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) loadMyRecipes();
      else setRecipes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  async function loadMyRecipes() {
    setLoadingRecipes(true);
    try {
      const recipesRef = collection(db, 'recipes');
      const q = query(recipesRef, where('author', '==', user.uid));
      const snap = await getDocs(q);
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecipes(arr);
    } catch (err) {
      console.error('Failed to load user recipes', err);
      setRecipes([]);
    }
    setLoadingRecipes(false);
  }

  async function handleDelete(recipeId) {
    if (!confirm('Delete this recipe? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
      alert('Recipe deleted.');
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete recipe: ' + (err.message || err));
    }
  }

  if (loading) return <div className="p-6">Checking auth...</div>;
  if (!user) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <p className="text-center text-gray-600">Please <a href="/auth" className="text-blue-600">sign in</a> to view your recipes.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">My Recipes</h2>
        <div className="text-sm text-gray-500">{loadingRecipes ? 'Loading...' : `${recipes.length} recipe(s)`}</div>
      </div>

      {loadingRecipes ? (
        <div className="p-6 text-center">Loading your recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="p-6 text-center text-gray-600">
          You haven't added any recipes yet.
          <div className="mt-3">
            <button onClick={() => navigate('/')} className="px-3 py-1 border rounded">Browse recipes</button>
          </div>
        </div>
      ) : (
        <>
          {/* RecipeList shows the cards */}
          <RecipeList recipes={recipes} />

          {/* management buttons below each card — simple list of actions */}
          <div className="mt-6 space-y-2">
            {recipes.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-gray-500">{r.description ? (r.description.slice(0, 90) + (r.description.length>90? '...' : '')) : 'No description'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(`/recipe/${r.id}`)} className="px-3 py-1 border rounded text-sm">View</button>
                  <button onClick={() => navigate(`/edit-recipe/${r.id}`)} className="px-3 py-1 border rounded text-sm">Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="px-3 py-1 border rounded text-sm text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
