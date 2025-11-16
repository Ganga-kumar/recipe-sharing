import React, { useState } from 'react'

export default function SearchBar({onSearch}){
  const [q, setQ] = useState('')
  const handleSubmit = (e)=>{
    e.preventDefault()
    onSearch(q)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search recipes, ingredients..." className="px-3 py-2 border rounded-lg w-full" />
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
    </form>
  )
}