// src/components/AddRecipe.jsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AddRecipe({ onAdded }) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [ingredientsRaw, setIngredientsRaw] = useState('');
  const [youtube, setYoutube] = useState('');
  const [loading, setLoading] = useState(false);

  const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x250?text=No+Image';

  async function handleSubmit(e) {
    e.preventDefault();

    // wait for auth to resolve
    if (authLoading) {
      alert('Checking authentication — try again in a moment.');
      return;
    }

    if (!user) {
      // not signed in
      navigate('/auth');
      return;
    }

    if (!title.trim() || !desc.trim()) {
      alert('Please enter a title and description.');
      return;
    }

    setLoading(true);

    try {
      const ingredients = ingredientsRaw
        .split(/\r?\n|,/)
        .map(i => i.trim())
        .filter(Boolean);

      // IMPORTANT: include author as the authenticated user's uid
      const docRef = await addDoc(collection(db, 'recipes'), {
        title: title.trim(),
        description: desc.trim(),
        image: PLACEHOLDER_IMAGE,
        author: user.uid,                // <--- required by stricter rules
        ingredients,
        youtube: youtube.trim() || '',
        createdAt: serverTimestamp(),
      });

      const newRecipe = {
        id: docRef.id,
        title: title.trim(),
        description: desc.trim(),
        image: PLACEHOLDER_IMAGE,
        author: user.uid,
        ingredients,
        youtube: youtube.trim(),
      };

      // reset form
      setTitle('');
      setDesc('');
      setIngredientsRaw('');
      setYoutube('');

      onAdded && onAdded(newRecipe);

      alert('Recipe added successfully.');
    } catch (err) {
      console.error('Add recipe failed', err);
      // Friendly guidance for permission issues
      if (err?.code === 'permission-denied') {
        alert('Permission denied: your account cannot write to the database. Check Firestore rules and ensure you are signed in.');
      } else {
        alert('Failed to add recipe: ' + (err.message || err));
      }
    } finally {
      setLoading(false);
    }
  }

  // UI: if auth still loading show message, if not signed in show sign-in prompt
  if (authLoading) return <div className="p-4">Checking authentication...</div>;
  if (!user) {
    return (
      <div className="p-4 border rounded">
        <h4 className="font-semibold mb-2">Add Recipe</h4>
        <p className="text-sm text-gray-600">Please <a href="/auth" className="text-blue-600">sign in</a> to add recipes.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <h4 className="font-semibold mb-2">Add Recipe</h4>

      <input
        required
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full px-3 py-2 border rounded mb-2"
      />

      <textarea
        required
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description / instructions"
        className="w-full px-3 py-2 border rounded mb-2"
      />

      <textarea
        value={ingredientsRaw}
        onChange={e => setIngredientsRaw(e.target.value)}
        placeholder="Ingredients (one per line or comma separated)"
        className="w-full px-3 py-2 border rounded mb-2"
      />

      <input
        value={youtube}
        onChange={e => setYoutube(e.target.value)}
        placeholder="YouTube link (optional)"
        className="w-full px-3 py-2 border rounded mb-2"
      />

      <button disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
        {loading ? 'Saving...' : 'Add Recipe'}
      </button>
    </form>
  );
}