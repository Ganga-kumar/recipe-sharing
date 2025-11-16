// src/components/AddRecipe.jsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function AddRecipe({ onAdded }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [ingredientsRaw, setIngredientsRaw] = useState('');
  const [youtube, setYoutube] = useState('');
  const [loading, setLoading] = useState(false);

  const PLACEHOLDER_IMAGE =
    'https://via.placeholder.com/400x250?text=No+Image';

  function ensureSignedIn() {
    const u = auth.currentUser;
    if (!u) {
      navigate('/auth');
      return null;
    }
    return u;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const user = ensureSignedIn();
    if (!user) return;

    if (!title.trim() || !desc.trim()) {
      alert('Title & description required.');
      return;
    }

    setLoading(true);

    try {
      const ingredients = ingredientsRaw
        .split(/\r?\n|,/)
        .map(i => i.trim())
        .filter(Boolean);

      const docRef = await addDoc(collection(db, 'recipes'), {
        title: title.trim(),
        description: desc.trim(),
        image: PLACEHOLDER_IMAGE, // ⭐ default image
        author: user.uid,
        ingredients,
        youtube: youtube.trim(),
        createdAt: serverTimestamp(),
      });

      const newRecipe = {
        id: docRef.id,
        title,
        description: desc,
        image: PLACEHOLDER_IMAGE,
        author: user.uid,
        ingredients,
        youtube,
      };

      setTitle('');
      setDesc('');
      setIngredientsRaw('');
      setYoutube('');

      onAdded && onAdded(newRecipe);
      alert('Recipe added successfully (no image).');
    } catch (err) {
      console.error(err);
      alert('Failed: ' + err.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
      <h4 className="font-semibold mb-2">Add Recipe (No Image)</h4>

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
        placeholder="Ingredients (one per line)"
        className="w-full px-3 py-2 border rounded mb-2"
      />

      <input
        value={youtube}
        onChange={e => setYoutube(e.target.value)}
        placeholder="YouTube link (optional)"
        className="w-full px-3 py-2 border rounded mb-2"
      />

      <button
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? 'Saving...' : 'Add Recipe'}
      </button>
    </form>
  );
}
