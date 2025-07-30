// src/components/DealCard.jsx
import { Link } from 'react-router-dom';

export default function DealCard({ deal }) {
  const imageUrl = deal.restaurants?.image_url || '/images/default.jpg';

  return (
    <Link to={`/restaurant/${deal.restaurant_id}`}>
      <div className="border rounded-lg bg-white shadow hover:shadow-md hover:bg-gray-50 transition-all overflow-hidden">

        {/* Restaurant Image */}
        <img
          src={imageUrl}
          alt={deal.restaurants?.name || 'Restaurant'}
          className="w-full h-48 object-cover"
        />

        <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-800">{deal.title}</h2>
            <div className="flex space-x-2">
              {deal.discount && (
                <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                  {deal.discount}% off
                </span>
              )}
              {deal.price && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full">
                  ${deal.price}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3">{deal.description}</p>

          <div className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <strong>Restaurant:</strong> {deal.restaurants?.name || 'Unknown'}
            </div>
            <div>
              <strong>Address:</strong> {deal.restaurants?.address || '—'}
            </div>
            <div>
              <strong>Food Type:</strong> {deal.food_types || '—'}
            </div>
            <div>
              <strong>Availability:</strong>{' '}
              {deal.availability?.type === 'recurring'
                ? `Every ${deal.availability.days
                    ?.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d])
                    .join(', ')}`
                : `${deal.availability?.startDate} → ${deal.availability?.endDate}`}
              {!deal.availability?.isAllDay &&
                deal.availability?.startTime &&
                ` (${deal.availability.startTime} – ${deal.availability.endTime})`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
