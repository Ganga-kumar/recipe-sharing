import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(''); // api or db
  const [isFav, setIsFav] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchRecipe();
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [id]);

  useEffect(() => {
    if (!authLoading) checkFavorite();
  }, [user, authLoading, recipe]);

  async function fetchRecipe() {
    setLoading(true);
    setRecipe(null);

    try {
      // 1) Try MealDB API first
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await res.json();

      if (data.meals && data.meals.length > 0) {
        const m = data.meals[0];
        setRecipe({
          id: m.idMeal,
          title: m.strMeal,
          image: (m.strMealThumb || '').replace(/^http:/, 'https:'),
          category: m.strCategory,
          area: m.strArea,
          instructions: m.strInstructions,
          youtube: m.strYoutube,
          ingredients: getIngredients(m)
        });
        setSource('api');
        setLoading(false);
        return;
      }

      // 2) Try Firestore
      const docRef = doc(db, 'recipes', id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const d = snap.data();
        setRecipe({
          id: snap.id,
          title: d.title,
          image: d.image || '',
          category: d.category || '',
          area: d.author || '',
          instructions: d.description || '',
          youtube: d.youtube || '',
          ingredients: d.ingredients || []
        });
        setSource('db');
      } else {
        setRecipe(null);
      }
    } catch (err) {
      console.error('Error loading recipe:', err);
      setRecipe(null);
    }

    setLoading(false);
  }

  function getIngredients(meal) {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) list.push(`${ing} - ${measure}`);
    }
    return list;
  }

  async function checkFavorite() {
    if (!user || !recipe) {
      setIsFav(false);
      return;
    }
    try {
      const favsRef = collection(db, 'favorites');
      const q = query(
        favsRef,
        where('uid', '==', user.uid),
        where('recipeId', '==', recipe.id)
      );
      const snap = await getDocs(q);
      setIsFav(!snap.empty);
    } catch (err) {
      console.error('Failed to check favorite', err);
      setIsFav(false);
    }
  }

  async function toggleFavorite() {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const favsRef = collection(db, 'favorites');
      const q = query(
        favsRef,
        where('uid', '==', user.uid),
        where('recipeId', '==', recipe.id)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const idToDelete = snap.docs[0].id;
        await deleteDoc(doc(db, 'favorites', idToDelete));
        setIsFav(false);
      } else {
        await addDoc(favsRef, {
          uid: user.uid,
          recipeId: recipe.id,
          createdAt: serverTimestamp()
        });
        setIsFav(true);
      }
    } catch (err) {
      console.error('Toggle favorite failed', err);
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!recipe) return <div className="p-6 text-center">Recipe not found.</div>;

  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-10 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 border rounded shadow-sm hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Source: {source === 'api' ? 'TheMealDB' : 'Your DB'}
          </span>

          <button
            onClick={toggleFavorite}
            className={`px-3 py-1 rounded ${
              isFav ? 'bg-red-500 text-white' : 'bg-white border'
            }`}
          >
            {isFav ? '♥ Favorited' : '♡ Favorite'}
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

      <img
        src={recipe.image || 'https://via.placeholder.com/800x400?text=No+image'}
        alt={recipe.title}
        className="w-full max-h-[400px] object-cover rounded-lg shadow"
      />

      <div className="mt-6 text-lg">
        {recipe.category && (
          <p>
            <strong>Category:</strong> {recipe.category}
          </p>
        )}
        {recipe.area && (
          <p>
            <strong>Area/Author:</strong> {recipe.area}
          </p>
        )}
      </div>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc ml-6 space-y-1">
            {recipe.ingredients.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
        <p className="leading-relaxed whitespace-pre-line">
          {recipe.instructions}
        </p>
      </div>

      {recipe.youtube && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Video Tutorial</h2>
          <a
            href={recipe.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );
}
