// src/components/Sidebar.jsx
import { useState } from 'react';

const sections = [
  { label: 'Featured', key: 'featured' },
  { label: 'Latest', key: 'latest' },
  { label: 'User-Submitted', key: 'user' },
  { label: 'Top Contributors', key: 'leaderboard' },
  { label: 'Saved Deals', key: 'saved' },
  { label: 'My Deals', key: 'my' },
];

export default function Sidebar({ currentView, onChangeView }) {
  return (
    <div className="w-64 px-4 py-6 border-r bg-white h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Explore</h2>
      <ul className="space-y-2">
        {sections.map(({ label, key }) => (
          <li key={key}>
            <button
              onClick={() => onChangeView(key)}
              className={`w-full text-left px-3 py-2 rounded transition ${
                currentView === key
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}