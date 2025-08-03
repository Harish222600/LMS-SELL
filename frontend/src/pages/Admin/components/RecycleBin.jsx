import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTrash, FaUndo, FaUsers, FaBookOpen, FaTag, FaCalendarAlt, FaUser, FaSearch, FaFilter, FaTrashAlt } from 'react-icons/fa';
import { MdDeleteForever, MdRestore } from 'react-icons/md';
import { BiTime } from 'react-icons/bi';
import { 
    getRecycleBinItems, 
    getRecycleBinStats, 
    restoreFromRecycleBin, 
    permanentlyDeleteItem,
    cleanupExpiredItems 
} from '../../../services/operations/recycleBinAPI';
import { formatDate, getRelativeTime } from '../../../utils/dateFormatter';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

const RecycleBin = () => {
    const { token } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('all');
    const [items, setItems] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    const itemsPerPage = 10;

    const tabs = [
        { id: 'all', label: 'All Items', icon: <FaTrash className="w-4 h-4" />, type: null },
        { id: 'users', label: 'Users', icon: <FaUsers className="w-4 h-4" />, type: 'User' },
        { id: 'courses', label: 'Courses', icon: <FaBookOpen className="w-4 h-4" />, type: 'Course' },
        { id: 'categories', label: 'Categories', icon: <FaTag className="w-4 h-4" />, type: 'Category' }
    ];

    useEffect(() => {
        fetchRecycleBinItems();
        fetchStats();
    }, [activeTab, currentPage]);

    const fetchRecycleBinItems = async () => {
        setLoading(true);
        try {
            const currentTab = tabs.find(tab => tab.id === activeTab);
            const result = await getRecycleBinItems(token, currentTab?.type, currentPage, itemsPerPage);
            if (result?.success) {
                setItems(result.data || []);
                setPagination(result.pagination);
            }
        } catch (error) {
            console.error('Error fetching recycle bin items:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const result = await getRecycleBinStats(token);
            if (result) {
                setStats(result);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleRestore = async (recycleBinId, itemType) => {
        setConfirmationModal({
            text1: "Restore Item",
            text2: `Are you sure you want to restore this ${itemType.toLowerCase()}? It will be moved back to its original location.`,
            btn1Text: "Restore",
            btn2Text: "Cancel",
            btn1Handler: async () => {
                const success = await restoreFromRecycleBin(token, recycleBinId);
                if (success) {
                    fetchRecycleBinItems();
                    fetchStats();
                }
                setConfirmationModal(null);
            },
            btn2Handler: () => setConfirmationModal(null),
        });
    };

    const handlePermanentDelete = async (recycleBinId, itemType) => {
        setConfirmationModal({
            text1: "Permanent Delete",
            text2: `Are you sure you want to permanently delete this ${itemType.toLowerCase()}? This action cannot be undone.`,
            btn1Text: "Delete Forever",
            btn2Text: "Cancel",
            btn1Handler: async () => {
                const success = await permanentlyDeleteItem(token, recycleBinId);
                if (success) {
                    fetchRecycleBinItems();
                    fetchStats();
                }
                setConfirmationModal(null);
            },
            btn2Handler: () => setConfirmationModal(null),
        });
    };

    const handleCleanupExpired = async () => {
        setConfirmationModal({
            text1: "Cleanup Expired Items",
            text2: "Are you sure you want to permanently delete all expired items? This action cannot be undone.",
            btn1Text: "Cleanup",
            btn2Text: "Cancel",
            btn1Handler: async () => {
                const success = await cleanupExpiredItems(token);
                if (success) {
                    fetchRecycleBinItems();
                    fetchStats();
                }
                setConfirmationModal(null);
            },
            btn2Handler: () => setConfirmationModal(null),
        });
    };

    const filteredItems = items.filter(item => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        const itemName = getItemName(item);
        return itemName.toLowerCase().includes(searchLower);
    });

    const getItemName = (item) => {
        const data = item.originalData;
        switch (item.itemType) {
            case 'User':
                return `${data.firstName} ${data.lastName}`;
            case 'Course':
                return data.courseName || 'Unnamed Course';
            case 'Category':
                return data.name || 'Unnamed Category';
            default:
                return 'Unknown Item';
        }
    };

    const getItemIcon = (itemType) => {
        switch (itemType) {
            case 'User':
                return <FaUsers className="w-5 h-5 text-blue-600" />;
            case 'Course':
                return <FaBookOpen className="w-5 h-5 text-green-600" />;
            case 'Category':
                return <FaTag className="w-5 h-5 text-purple-600" />;
            default:
                return <FaTrash className="w-5 h-5 text-academic-slate-500" />;
        }
    };

    const getExpiryStatus = (expiresAt) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 0) {
            return { status: 'expired', text: 'Expired', color: 'text-red-700' };
        } else if (daysLeft <= 7) {
            return { status: 'warning', text: `${daysLeft} days left`, color: 'text-orange-700' };
        } else {
            return { status: 'safe', text: `${daysLeft} days left`, color: 'text-green-700' };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="classic-heading text-3xl md:text-4xl mb-2">Recycle Bin</h1>
                        <p className="section-subtitle text-lg">
                            Manage deleted items. Items are automatically deleted after 30 days.
                        </p>
                    </div>
                    <button
                        onClick={handleCleanupExpired}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-classic"
                    >
                        <FaTrashAlt className="w-4 h-4" />
                        Cleanup Expired
                    </button>
                </div>

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="classic-card p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="w-8 h-8 text-red-600" />
                            </div>
                            <p className="text-academic-slate-600 text-sm font-medium mb-1">Total Items</p>
                            <p className="text-3xl font-bold text-academic-navy-900">{stats.totalItems}</p>
                        </div>
                        {stats.itemsByType?.map((item) => (
                            <div key={item._id} className="classic-card p-6 text-center">
                                <div className="w-16 h-16 bg-academic-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    {getItemIcon(item._id)}
                                </div>
                                <p className="text-academic-slate-600 text-sm font-medium mb-1">{item._id}s</p>
                                <p className="text-3xl font-bold text-academic-navy-900">{item.count}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="classic-card p-6">
                    <div className="flex flex-wrap gap-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setCurrentPage(1);
                                }}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-academic-navy-700 text-white shadow-classic'
                                        : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="classic-card p-6">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="classic-input pl-12"
                        />
                    </div>
                </div>

                {/* Items List */}
                <div className="classic-card overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-12 h-12 border-3 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-academic-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <FaTrash className="w-8 h-8 sm:w-10 sm:h-10 text-academic-slate-400" />
                            </div>
                            <h3 className="elegant-heading mb-3 text-lg sm:text-xl">No items in recycle bin</h3>
                            <p className="text-academic-slate-600 text-sm sm:text-base">
                                Deleted items will appear here and can be restored within 30 days
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden lg:block divide-y divide-academic-slate-200">
                                {filteredItems.map((item) => {
                                    const expiryStatus = getExpiryStatus(item.expiresAt);
                                    return (
                                        <div key={item._id} className="p-6 hover:bg-academic-cream-50 transition-colors duration-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 bg-academic-slate-100 rounded-lg flex items-center justify-center">
                                                        {getItemIcon(item.itemType)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-academic-navy-900 font-bold text-lg mb-2 font-playfair">
                                                            {getItemName(item)}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-academic-slate-600">
                                                            <span className="flex items-center gap-2 bg-academic-slate-100 px-3 py-1 rounded-full">
                                                                <FaUser className="w-3 h-3" />
                                                                Deleted by {item.deletedBy?.firstName} {item.deletedBy?.lastName}
                                                            </span>
                                                            <span className="flex items-center gap-2 bg-academic-slate-100 px-3 py-1 rounded-full">
                                                                <FaCalendarAlt className="w-3 h-3" />
                                                                {formatDate(item.deletedAt)}
                                                            </span>
                                                            <span className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium ${
                                                                expiryStatus.status === 'expired' ? 'bg-red-100 text-red-700' :
                                                                expiryStatus.status === 'warning' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-green-100 text-green-700'
                                                            }`}>
                                                                <BiTime className="w-3 h-3" />
                                                                {expiryStatus.text}
                                                            </span>
                                                        </div>
                                                        {item.reason && (
                                                            <div className="mt-3 p-3 bg-academic-cream-50 rounded-lg border border-academic-cream-200">
                                                                <p className="text-academic-slate-700 text-sm">
                                                                    <span className="font-semibold">Reason:</span> {item.reason}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 ml-4">
                                                    <button
                                                        onClick={() => handleRestore(item._id, item.itemType)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-classic"
                                                        title="Restore"
                                                    >
                                                        <MdRestore className="w-4 h-4" />
                                                        Restore
                                                    </button>
                                                    <button
                                                        onClick={() => handlePermanentDelete(item._id, item.itemType)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-classic"
                                                        title="Delete Forever"
                                                    >
                                                        <MdDeleteForever className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile View */}
                            <div className="lg:hidden divide-y divide-academic-slate-200">
                                {filteredItems.map((item) => {
                                    const expiryStatus = getExpiryStatus(item.expiresAt);
                                    return (
                                        <div key={item._id} className="p-4 hover:bg-academic-cream-50 transition-colors duration-200">
                                            <div className="space-y-4">
                                                {/* Header with icon and name */}
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-academic-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        {getItemIcon(item.itemType)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-academic-navy-900 font-bold text-base mb-1 font-playfair">
                                                            {getItemName(item)}
                                                        </h3>
                                                        <p className="text-academic-slate-600 text-sm">
                                                            {item.itemType}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-academic-slate-600">
                                                        <FaUser className="w-3 h-3 flex-shrink-0" />
                                                        <span>Deleted by {item.deletedBy?.firstName} {item.deletedBy?.lastName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-academic-slate-600">
                                                        <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
                                                        <span>{formatDate(item.deletedAt)}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-2 text-sm font-medium ${expiryStatus.color}`}>
                                                        <BiTime className="w-3 h-3 flex-shrink-0" />
                                                        <span>{expiryStatus.text}</span>
                                                    </div>
                                                </div>

                                                {/* Reason */}
                                                {item.reason && (
                                                    <div className="p-3 bg-academic-cream-50 rounded-lg border border-academic-cream-200">
                                                        <p className="text-academic-slate-700 text-sm">
                                                            <span className="font-semibold">Reason:</span> {item.reason}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Action buttons */}
                                                <div className="flex items-center gap-2 pt-2">
                                                    <button
                                                        onClick={() => handleRestore(item._id, item.itemType)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-classic flex-1 justify-center"
                                                        title="Restore"
                                                    >
                                                        <MdRestore className="w-4 h-4" />
                                                        Restore
                                                    </button>
                                                    <button
                                                        onClick={() => handlePermanentDelete(item._id, item.itemType)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-classic flex-1 justify-center"
                                                        title="Delete Forever"
                                                    >
                                                        <MdDeleteForever className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="classic-card p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-academic-slate-600 text-sm font-medium">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} items
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={!pagination.hasPrev}
                                    className="px-4 py-2 bg-academic-slate-100 border border-academic-slate-300 rounded-lg text-academic-slate-700 hover:bg-academic-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                                >
                                    Previous
                                </button>
                                <span className="text-academic-slate-600 text-sm font-medium">
                                    Page {currentPage} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={!pagination.hasNext}
                                    className="px-4 py-2 bg-academic-slate-100 border border-academic-slate-300 rounded-lg text-academic-slate-700 hover:bg-academic-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {confirmationModal && (
                    <ConfirmationModal 
                        modalData={confirmationModal} 
                        closeModal={() => setConfirmationModal(null)} 
                    />
                )}
            </div>
        </div>
    );
};

export default RecycleBin;
