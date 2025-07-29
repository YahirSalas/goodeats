import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import FilterDropdown from '../components/FilterDropdown.jsx';
import Sidebar from '../components/Sidebar.jsx';
import DealCard from '../components/DealCard';

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('featured'); // NEW
  const [filters, setFilters] = useState(null);
  const [layout, setLayout] = useState('grid'); // or 'list' or 'compact'
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch('http://localhost:5000/api/deals');
        const data = await res.json();
        setDeals(data);
      } catch (err) {
        console.error("Failed to fetch deals:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  const handleSubmitClick = () => {
    if (user) {
      navigate('/submit');
    } else {
      alert("Please log in to submit a deal.");
      navigate('/login');
    }
  };

  const filteredDeals = deals.filter(deal => {
  // First, filter by view
  if (view === 'featured' && !deal.featured) return false;
  if (view === 'user' && !deal.submittedByUser) return false;
  if (view === 'latest') {
    // You could sort later; for now, include all
  }

  // Then, filter using filters from dropdown (if any)
  if (filters) {
    // Price filtering
    if (
      filters.price.length > 0 &&
      !filters.price.some(symbol => {
        if (symbol === '$') return deal.price <= 10;
        if (symbol === '$$') return deal.price > 10 && deal.price <= 20;
        if (symbol === '$$$') return deal.price > 20;
        return false;
      })
    ) return false;

    // Discount
    if (
      filters.discount &&
      Number(deal.discount) < Number(filters.discount)
    ) return false;

    // Food Type
    if (
      filters.foodTypes.length > 0 &&
      !filters.foodTypes.includes(deal.food_types)
    ) return false;

    // Availability
    if (
      filters.availability &&
      filters.availability !== deal.availability?.type
    ) return false;

    // Sort is ignored for now — can apply after filtering
  }

  return true;
});

  return (
    <div className="flex w-full">
      <Sidebar currentView={view} onChangeView={setView} />
      <div className="flex-1 p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🍽️ GoodEats - {view.charAt(0).toUpperCase() + view.slice(1)} Deals</h1>

        {view === 'featured' || view === 'latest' || view === 'user' ? (
          <>
            <FilterDropdown onApply={(filters) => setFilters(filters)} />
            <button
              className="m-auto bg-blue-500 text-white px-4 py-2 rounded mb-4"
              onClick={handleSubmitClick}
            >
              Submit Deal
            </button>
            <div className="flex justify-end space-x-2 mb-4">
              <button
                onClick={() => setLayout('grid')}
                className={`px-3 py-1 rounded ${layout === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`px-3 py-1 rounded ${layout === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                List
              </button>
            </div>
            {loading ? (
              <p>Loading deals...</p>
            ) : filteredDeals.length === 0 ? (
              <p>No deals found for this view.</p>
            ) : (
              <div className={
                layout === 'grid'
                  ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-4"
              }>
                {filteredDeals.map((deal, i) => (
                  <DealCard key={i} deal={deal} layout={layout} />
                ))}
              </div>
            )}
          </>
        ) : view === 'leaderboard' ? (
          <p>🏆 Leaderboard view coming soon...</p>
        ) : view === 'saved' ? (
          <p>📌 Show user's saved deals here...</p>
        ) : view === 'daily' ? (
          <p>🌟 Show Deal of the Day here...</p>
        ) : view === 'alerts' ? (
          <p>🚨 Show local alerts and closures here...</p>
        ) : null}
      </div>
    </div>
  );
}