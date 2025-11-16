import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PLACEHOLDER = 'https://via.placeholder.com/400x250?text=No+image';

export default function RecipeCard({ recipe }) {
  const [src, setSrc] = useState(recipe?.image || PLACEHOLDER);

  useEffect(() => {
    setSrc(recipe?.image || PLACEHOLDER);
  }, [recipe?.image]);

  return (
    <Link to={`/recipe/${recipe.id}`}>
      <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
        <img
          src={src}
          alt={recipe?.title || 'Recipe'}
          loading="lazy"
          className="recipe-image"
          onError={() => setSrc(PLACEHOLDER)}
          style={{ objectFit: 'cover', width: '100%', height: 192 }}
        />

        <div className="p-4">
          <h3 className="font-semibold text-lg">{recipe?.title}</h3>
          <p className="text-sm mt-2 line-clamp-3">
            {recipe?.description ? recipe.description.slice(0, 120) : 'No description.'}
          </p>
        </div>
      </article>
    </Link>
  );
}
