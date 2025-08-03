import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'
import Loading from '../components/common/Loading'
import { 
  FaBell, 
  FaSearch, 
  FaUser, 
  FaCog, 
  FaMoon, 
  FaSun,
  FaExpand,
  FaCompress,
  FaWifi,
  FaWifiSlash
} from 'react-icons/fa'

const EnhancedDashboard = () => {
    const { loading: authLoading } = useSelector((state) => state.auth);
    const { loading: profileLoading } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.profile);
    
    // Enhanced state management
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Network status monitoring
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setNotifications(prev => [...prev, {
                id: Date.now(),
                message: 'Connection restored',
                type: 'success',
                timestamp: new Date()
            }]);
        };
        
        const handleOffline = () => {
            setIsOnline(false);
            setNotifications(prev => [...prev, {
                id: Date.now(),
                message: 'Connection lost - Working offline',
                type: 'warning',
                timestamp: new Date()
            }]);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Theme management
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Auto-clear notifications
    useEffect(() => {
        notifications.forEach(notification => {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }, 5000);
        });
    }, [notifications]);

    // Fullscreen functionality
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Welcome message based on time
    const getWelcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (profileLoading || authLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50'>
                <div className="text-center classic-card p-12">
                    <Loading />
                    <p className="text-academic-slate-600 mt-6 animate-pulse font-medium">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    // Scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className={`relative flex min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 ${theme === 'dark' ? 'dark' : ''}`}>
            {/* Enhanced Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-3">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`p-4 rounded-xl shadow-elegant transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border ${
                            notification.type === 'success' 
                                ? 'bg-green-500/90 text-white border-green-400' 
                                : notification.type === 'warning'
                                ? 'bg-academic-gold-500/90 text-white border-academic-gold-400'
                                : 'bg-red-500/90 text-white border-red-400'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <FaBell className="w-4 h-4" />
                            <span className="font-medium">{notification.message}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Enhanced Header Bar */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-academic-slate-200 shadow-classic">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 rounded-xl bg-academic-navy-100 hover:bg-academic-navy-200 transition-colors text-academic-navy-700 shadow-classic"
                        >
                            ☰
                        </button>
                        
                        <div className="hidden md:block">
                            <h1 className="classic-heading text-2xl text-academic-navy-900">
                                {getWelcomeMessage()}, <span className="text-academic-gold-600">{user?.firstName}</span>!
                            </h1>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search courses, users, analytics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="classic-input pl-12"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Network Status */}
                        <div className={`p-3 rounded-xl shadow-classic ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isOnline ? <FaWifi className="w-4 h-4" /> : <FaWifiSlash className="w-4 h-4" />}
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-3 rounded-xl bg-academic-gold-100 hover:bg-academic-gold-200 transition-colors text-academic-gold-700 shadow-classic"
                        >
                            {theme === 'dark' ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
                        </button>

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-3 rounded-xl bg-academic-slate-100 hover:bg-academic-slate-200 transition-colors text-academic-slate-700 shadow-classic"
                        >
                            {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
                        </button>

                        {/* Notifications */}
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-3 rounded-xl bg-academic-navy-100 hover:bg-academic-navy-200 transition-colors text-academic-navy-700 shadow-classic"
                        >
                            <FaBell className="w-4 h-4" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-classic">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-academic-cream-100 border border-academic-cream-200 shadow-classic">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-academic-gold-500 to-academic-gold-600 flex items-center justify-center shadow-classic">
                                {user?.image ? (
                                    <img src={user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <FaUser className="text-white w-4 h-4" />
                                )}
                            </div>
                            <span className="hidden md:block text-academic-navy-900 font-semibold">
                                {user?.firstName}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-30 transition-all duration-300 ${
                sidebarCollapsed ? 'w-16' : 'w-64'
            }`}>
                <Sidebar collapsed={sidebarCollapsed} />
            </div>

            {/* Enhanced Main Content */}
            <div className={`flex-1 mt-16 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
                sidebarCollapsed ? 'ml-16' : 'ml-64'
            }`}>
                <div className='mx-auto w-11/12 max-w-[1400px] py-8 px-4 overflow-x-hidden'>
                    {/* Quick Stats Bar */}
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="classic-card p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-elegant">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-classic"></div>
                                <div>
                                    <p className="text-sm text-academic-slate-600 font-medium">Status</p>
                                    <p className="text-xl font-bold text-green-600 font-playfair">Online</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="classic-card p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-elegant">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-classic"></div>
                                <div>
                                    <p className="text-sm text-academic-slate-600 font-medium">Session</p>
                                    <p className="text-xl font-bold text-blue-600 font-playfair">Active</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="classic-card p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-elegant">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-academic-gold-500 rounded-full animate-pulse shadow-classic"></div>
                                <div>
                                    <p className="text-sm text-academic-slate-600 font-medium">Theme</p>
                                    <p className="text-xl font-bold text-academic-gold-600 capitalize font-playfair">{theme}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="classic-card p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-elegant">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse shadow-classic"></div>
                                <div>
                                    <p className="text-sm text-academic-slate-600 font-medium">Role</p>
                                    <p className="text-xl font-bold text-purple-600 capitalize font-playfair">{user?.accountType}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-academic-gold-500 to-academic-gold-600 rounded-full shadow-elegant hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-white z-40 border-2 border-white">
                <FaCog className="text-xl animate-spin-slow" />
            </button>
        </div>
    )
}

export default EnhancedDashboard
