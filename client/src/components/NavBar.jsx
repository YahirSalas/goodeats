import { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { FiUser, FiSettings } from 'react-icons/fi';
import { MdPerson, MdSettings } from 'react-icons/md';


export default function Navbar() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUserInfo(data.user);
    };
    if (user) fetchUserInfo();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // redirect to home after logout
    window.location.reload(); // refresh state/UI
  };

  return (
    <nav className="bg-[linear-gradient(45deg,_#A4D3FF,_#60a5fa)] px-6 py-3 shadow-sm flex items-center justify-between">
      {/* Logo and Navigation Links */}
      <div className="flex items-center space-x-3">
        <div className="relative w-5">
          <div className="absolute -left-12 top-1/2 -translate-y-1/2">
            <img
              src={Logo}
              alt="logo"
              className="h-15 w-auto rotate-90"
            />
          </div>
        </div>
        <span className="text-xl tracking-wide font-josefin font-semibold text-gray-900">GoodEats</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6 ml-8 mr-auto">
        <Link to="/" className="hover:underline underline-offset-2 transition duration-150">
          Home
        </Link>
        <Link to="/map" className="hover:underline underline-offset-2 transition duration-150">
          Map
        </Link>
      </div>      

      <div className="flex items-center space-x-4 text-black">
        <div className="flex items-center bg-[#D6E7EF] rounded-full px-4 py-1 max-w-md flex-grow h-7.5">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="flex-grow bg-transparent outline-none"
          />
        </div>

        <div className="flex items-center bg-[#D6E7EF] rounded-full px-3 py-1 text-sm h-7.5">
          <FiMapPin className="mr-1" />
          123 Main St.
        </div>

        {loading ? null : user ? (
          <>
            <div className="relative group">
              <FiSettings className="cursor-pointer group-hover:hidden" />
              <MdSettings className="cursor-pointer hidden group-hover:block" />
            </div>

            <div className="relative group" ref={dropdownRef}>
              <FiUser
                className="cursor-pointer group-hover:hidden"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              <MdPerson
                className="cursor-pointer hidden group-hover:block"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg z-50 p-4 space-y-3">
                  {/* Avatar and Info */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={userInfo?.user_metadata?.avatar_url || 'https://via.placeholder.com/40'}
                      alt="avatar"
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{userInfo?.user_metadata?.full_name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-600">{userInfo?.email}</p>
                    </div>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-2 border-t flex justify-end">
                    <button
                      onClick={handleLogout}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
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
