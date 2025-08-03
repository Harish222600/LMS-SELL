import { useCallback, useEffect, useState } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../services/operations/authAPI";
import { useProfileImage } from "../../hooks/useProfileImage";

import { NavbarLinks } from "../../../data/navbar-links";
import BeejaLogo from "../../assets/Logo/Logo-Small-Light.png";
import { fetchCourseCategories } from "./../../services/operations/courseDetailsAPI";
import NotificationPanel from "./NotificationPanel";

import { MdKeyboardArrowDown } from "react-icons/md";

const ClassicNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user, imageUrl } = useProfileImage();
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSublinks = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchCourseCategories()
      setSubLinks(res)
    } catch (error) {
      console.log("Could not fetch the category list = ", error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSublinks();
  }, [fetchSublinks]);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const [showNavbar, setShowNavbar] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (window.scrollY > 100) {
      if (window.scrollY > lastScrollY) setShowNavbar("hide");
      else setShowNavbar("show");
    } else setShowNavbar("top");
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [controlNavbar]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLogin = () => {
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleSignup = () => {
    navigate("/signup");
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed z-[1000] w-full transition-all duration-300 ease-in-out ${
        showNavbar === "hide" ? "-translate-y-full" : 
        showNavbar === "show" ? "translate-y-0 shadow-classic-lg" : 
        "translate-y-0"
      }`}
    >
      <div className="w-full bg-white border-b border-academic-slate-200 shadow-classic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 py-2"
            >
              <Link to="/" aria-label="Home" className="flex items-center h-full">
                <img
                  src={BeejaLogo}
                  loading="lazy"
                  alt="BeejaAcademy Logo"
                  className="h-12 w-auto max-w-[140px] object-contain transition-all duration-300 hover:opacity-80"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {NavbarLinks.map((link, index) => (
                  <div key={index} className="relative">
                    {link.title === "Catalog" ? (
                      <div className="group relative">
                        <button className={`classic-nav-link px-3 py-2 text-sm font-medium ${
                          matchRoute("/catalog/:catalogName") ? "active" : ""
                        }`}>
                          <span className="flex items-center gap-1">
                            {link.title}
                            <MdKeyboardArrowDown className="transition-transform duration-200 group-hover:rotate-180" />
                          </span>
                        </button>
                        
                        {/* Dropdown */}
                        <div className="invisible group-hover:visible absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-classic-lg border border-academic-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400" style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#D1D5DB transparent'
                        }}>
                          <div className="py-2">
                            {loading ? (
                              <div className="px-4 py-2 text-sm text-academic-slate-500">Loading...</div>
                            ) : subLinks.length ? (
                              <>
                                {subLinks.map((subLink, i) => (
                                  <Link
                                    key={i}
                                    to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                    className="block px-4 py-2 text-sm text-academic-slate-700 hover:bg-academic-navy-50 hover:text-academic-navy-700 transition-colors duration-200"
                                  >
                                    {subLink.name}
                                  </Link>
                                ))}
                                {/* View All Courses Section */}
                                <div className="border-t border-academic-slate-200 mt-2 pt-2">
                                  <Link
                                    to="/courses"
                                    className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 font-medium"
                                  >
                                    📚 View All Courses
                                  </Link>
                                </div>
                              </>
                            ) : (
                              <div className="px-4 py-2 text-sm text-academic-slate-500">No Courses Found</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={link?.path}
                        className={`classic-nav-link px-3 py-2 text-sm font-medium ${
                          matchRoute(link?.path) ? "active" : ""
                        }`}
                      >
                        {link.title}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Free Courses Link */}
                <Link
                  to="/free-courses"
                  className={`classic-nav-link px-3 py-2 text-sm font-medium ${
                    matchRoute("/free-courses") ? "active" : ""
                  }`}
                >
                  Free Courses
                </Link>

                {/* Services Dropdown */}
                <div className="group relative">
                  <button className="classic-nav-link px-3 py-2 text-sm font-medium">
                    <span className="flex items-center gap-1">
                      Services
                      <MdKeyboardArrowDown className="transition-transform duration-200 group-hover:rotate-180" />
                    </span>
                  </button>
                  
                  <div className="invisible group-hover:visible absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-classic-lg border border-academic-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        to="/services/institute"
                        className="block px-4 py-2 text-sm text-academic-slate-700 hover:bg-academic-navy-50 hover:text-academic-navy-700 transition-colors duration-200"
                      >
                        For Institute
                      </Link>
                      <Link
                        to="/services/student"
                        className="block px-4 py-2 text-sm text-academic-slate-700 hover:bg-academic-navy-50 hover:text-academic-navy-700 transition-colors duration-200"
                      >
                        For Student
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Auth buttons and Profile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!token ? (
                <>
                  <button 
                    onClick={handleLogin}
                    className="hidden sm:block btn-classic-secondary text-sm px-4 py-2"
                  >
                    Log in
                  </button>
                  <button 
                    onClick={handleSignup}
                    className="hidden sm:block btn-classic-gold text-sm px-4 py-2"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  {/* Notification Panel - Always visible */}
                  <NotificationPanel />

                  {/* Profile Dropdown - Hidden on mobile */}
                  <div className="hidden sm:block relative group">
                    <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-academic-slate-50 transition-colors duration-200">
                      <img
                        src={imageUrl || user?.image}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        className="h-8 w-8 rounded-full object-cover border-2 border-academic-slate-200"
                      />
                      <span className="hidden md:block text-sm font-medium text-academic-slate-700">
                        {user?.firstName}
                      </span>
                      <MdKeyboardArrowDown className="text-academic-slate-400" />
                    </button>
                    
                    {/* Profile Dropdown */}
                    <div className="invisible group-hover:visible absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-classic-lg border border-academic-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                      <div className="py-2">
                        <Link 
                          to="/dashboard/my-profile" 
                          className="block px-4 py-2 text-sm text-academic-slate-700 hover:bg-academic-navy-50 hover:text-academic-navy-700 transition-colors duration-200"
                        >
                          Dashboard
                        </Link>
                        {user?.accountType === "Admin" && (
                          <Link 
                            to="/admin" 
                            className="block px-4 py-2 text-sm text-academic-slate-700 hover:bg-academic-navy-50 hover:text-academic-navy-700 transition-colors duration-200"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button 
                          onClick={() => dispatch(logout(navigate))} 
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Mobile menu button - Always visible on mobile */}
              <button
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                className="md:hidden p-3 rounded-lg bg-academic-navy-100 hover:bg-academic-navy-200 transition-colors duration-200 flex-shrink-0 border border-academic-navy-300 hover:border-academic-navy-400"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center mx-auto">
                  <span className={`block h-0.5 w-6 bg-academic-navy-700 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                  <span className={`block h-0.5 w-6 bg-academic-navy-700 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block h-0.5 w-6 bg-academic-navy-700 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden absolute top-20 left-0 right-0 bg-white border-t border-academic-slate-200 shadow-classic-lg z-40"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-6 space-y-4">
                {NavbarLinks.map((link, index) => (
                  <div key={index}>
                    {link.title === "Catalog" ? (
                      <details className="group">
                        <summary className="cursor-pointer p-3 text-academic-slate-700 hover:text-academic-navy-700 font-medium transition-colors duration-200">
                          Catalog
                        </summary>
                        <div className="mt-2 ml-4 space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400" style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#D1D5DB transparent'
                        }}>
                          {loading ? (
                            <div className="text-sm text-academic-slate-500">Loading...</div>
                          ) : subLinks.length ? (
                            <>
                              {subLinks.map((subLink, i) => (
                                <Link
                                  key={i}
                                  to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                  className="block py-2 px-3 text-sm text-academic-slate-600 hover:text-academic-navy-700 transition-colors duration-200"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {subLink.name}
                                </Link>
                              ))}
                              {/* View All Courses for Mobile */}
                              <div className="border-t border-academic-slate-200 mt-2 pt-2">
                                <Link
                                  to="/courses"
                                  className="block py-2 px-3 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  📚 View All Courses
                                </Link>
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-academic-slate-500">No Courses Found</div>
                          )}
                        </div>
                      </details>
                    ) : (
                      <Link
                        to={link?.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block p-3 font-medium transition-colors duration-200 ${
                          matchRoute(link?.path) 
                            ? "text-academic-navy-700 bg-academic-navy-50" 
                            : "text-academic-slate-700 hover:text-academic-navy-700"
                        }`}
                      >
                        {link.title}
                      </Link>
                    )}
                  </div>
                ))}

                <Link
                  to="/free-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block p-3 font-medium transition-colors duration-200 ${
                    matchRoute("/free-courses") 
                      ? "text-academic-navy-700 bg-academic-navy-50" 
                      : "text-academic-slate-700 hover:text-academic-navy-700"
                  }`}
                >
                  Free Courses
                </Link>

                <details className="group">
                  <summary className="cursor-pointer p-3 text-academic-slate-700 hover:text-academic-navy-700 font-medium transition-colors duration-200">
                    Services
                  </summary>
                  <div className="mt-2 ml-4 space-y-2">
                    <Link
                      to="/services/institute"
                      className="block py-2 px-3 text-sm text-academic-slate-600 hover:text-academic-navy-700 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      For Institute
                    </Link>
                    <Link
                      to="/services/student"
                      className="block py-2 px-3 text-sm text-academic-slate-600 hover:text-academic-navy-700 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      For Student
                    </Link>
                  </div>
                </details>

                {/* Mobile user section for logged in users */}
                {token && (
                  <div className="pt-4 border-t border-academic-slate-200 space-y-3">
                    {/* Profile Section */}
                    <div className="flex items-center gap-3 p-3 bg-academic-navy-50 rounded-lg">
                      <img
                        src={imageUrl || user?.image}
                        alt={`${user?.firstName} ${user?.lastName}`}
                        className="h-10 w-10 rounded-full object-cover border-2 border-academic-slate-200"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-academic-navy-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-academic-slate-600">{user?.email}</p>
                      </div>
                    </div>

                    {/* Profile Links */}
                    <Link
                      to="/dashboard/my-profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-3 text-academic-slate-700 hover:text-academic-navy-700 hover:bg-academic-navy-50 transition-colors duration-200 rounded-lg font-medium"
                    >
                      Dashboard
                    </Link>

                    {user?.accountType === "Admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block p-3 text-academic-slate-700 hover:text-academic-navy-700 hover:bg-academic-navy-50 transition-colors duration-200 rounded-lg font-medium"
                      >
                        Admin Dashboard
                      </Link>
                    )}


                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        dispatch(logout(navigate))
                        setMobileMenuOpen(false)
                      }}
                      className="w-full p-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}

                {!token && (
                  <div className="pt-4 border-t border-academic-slate-200 space-y-3">
                    <button 
                      onClick={handleLogin}
                      className="w-full btn-classic-secondary text-sm"
                    >
                      Log in
                    </button>
                    <button 
                      onClick={handleSignup}
                      className="w-full btn-classic-gold text-sm"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default ClassicNavbar;
