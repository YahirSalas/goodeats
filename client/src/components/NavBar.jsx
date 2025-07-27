import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // redirect to home after logout
    window.location.reload(); // refresh state/UI
  };

  return (
    <nav className="bg-gray-100 px-6 py-3 shadow-sm flex justify-between items-center">
      <div className="space-x-4 text-blue-600 font-medium">
        <Link to="/">Home</Link>
        <Link to="/map">Map</Link>
      </div>

      <div>
        {loading ? null : user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
