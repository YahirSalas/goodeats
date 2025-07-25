import { useEffect, useState } from 'react';

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🍽️ GoodEats - Nearby Food Deals</h1>

      {loading ? (
        <p>Loading deals...</p>
      ) : deals.length === 0 ? (
        <p>No deals yet. Be the first to submit one!</p>
      ) : (
        <div className="space-y-4">
          {deals.map((deal, i) => (
            <div key={i} className="border rounded p-4 bg-white shadow-sm">
              <h2 className="text-xl font-semibold">{deal.title}</h2>
              <p className="text-gray-700 mb-2">{deal.description}</p>

              <div className="text-sm text-gray-600 mb-2">
                <strong>Restaurant:</strong> {deal.restaurants?.name || "Unknown"}
                <br />
                <strong>Address:</strong> {deal.restaurants?.address || "—"}
              </div>

              <div className="text-sm">
                {deal.discount && <span className="font-medium text-green-700">Discount: {deal.discount}%</span>}
                {deal.price && <span className="font-medium text-green-700">Price: ${deal.price}</span>}
              </div>

              <div className="text-sm mt-1">
                <strong>Food Type:</strong> {deal.food_types || '—'}
              </div>

              <div className="text-sm mt-1">
                <strong>Availability:</strong>{' '}
                {deal.availability?.type === 'recurring'
                  ? `Every ${deal.availability.days?.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')}`
                  : `${deal.availability.startDate} → ${deal.availability.endDate}`}
                {' '}
                {!deal.availability?.isAllDay &&
                  deal.availability?.startTime &&
                  `(${deal.availability.startTime} – ${deal.availability.endTime})`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
