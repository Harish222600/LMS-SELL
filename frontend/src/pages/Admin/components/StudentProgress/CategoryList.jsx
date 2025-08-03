import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner, FaSearch, FaGraduationCap, FaTimes, FaBook, FaArrowRight } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { showAllCategories } from '../../../../services/operations/categoryAPI';

const CategoryList = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await showAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="classic-card">
        <div className="flex justify-center items-center py-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
            <span className="text-academic-slate-700 font-medium font-inter">Loading categories...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Academic Statistics Panel */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
          <h2 className="elegant-heading text-academic-navy-900">Category Overview</h2>
          <p className="text-sm text-academic-slate-600 font-inter">Academic category statistics and tracking</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <MdCategory className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{categories.length}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Categories</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                Available for tracking
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaBook className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                  {categories.reduce((acc, cat) => acc + (cat.courses?.length || 0), 0)}
                </div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Courses</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                Across all categories
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaGraduationCap className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                  {categories.filter(cat => cat.courses?.length > 0).length}
                </div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Active Categories</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                With enrolled students
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaSearch className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{filteredCategories.length}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Filtered Results</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                {searchTerm ? 'Matching search' : 'All categories'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Search Panel */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
          <h2 className="elegant-heading text-academic-navy-900">Search Categories</h2>
          <p className="text-sm text-academic-slate-600 font-inter">Find academic categories by name or description</p>
        </div>
        <div className="p-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by category name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="classic-input w-full pl-12"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400" size={16} />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 hover:text-academic-slate-600 transition-colors duration-200"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="btn-classic-secondary"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Academic Search Results Info */}
      {searchTerm && (
        <div className="classic-card">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <FaSearch className="text-academic-gold-600" size={16} />
              <div className="text-sm text-academic-slate-700 font-inter">
                Showing <span className="font-bold text-academic-navy-900">{filteredCategories.length}</span> of <span className="font-bold text-academic-navy-900">{categories.length}</span> categories
                <span className="text-academic-gold-700 font-semibold"> matching "{searchTerm}"</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Categories Grid */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="elegant-heading text-academic-navy-900">Category Directory</h2>
              <p className="text-sm text-academic-slate-600 font-inter">Academic categories for progress tracking</p>
            </div>
            <div className="text-sm text-academic-slate-700 font-inter">
              <span className="font-bold text-academic-navy-900">{filteredCategories.length}</span> categor{filteredCategories.length !== 1 ? 'ies' : 'y'} available
            </div>
          </div>
        </div>

        {/* Academic Empty State */}
        {filteredCategories.length === 0 && (
          <div className="p-16 text-center">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
              <MdCategory className="text-5xl text-academic-gold-700" />
            </div>
            <h3 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Categories Found</h3>
            <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search criteria to find the categories you\'re looking for.' : 'No academic categories are available for progress tracking.'}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="btn-elegant flex items-center gap-3 mx-auto"
              >
                <FaTimes size={16} />
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Academic Categories Grid */}
        {filteredCategories.length > 0 && (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="classic-card bg-academic-cream-50 hover:shadow-elegant group transition-all duration-300 p-6 cursor-pointer"
                  onClick={() => onCategorySelect(category)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-white border-2 border-academic-gold-300 p-3 rounded-xl group-hover:border-academic-gold-400 transition-colors duration-300 flex-shrink-0">
                        <MdCategory className="text-academic-gold-700 text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-academic-navy-900 mb-1 font-playfair group-hover:text-academic-navy-800 transition-colors duration-300 line-clamp-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-academic-slate-600 font-inter font-medium">
                          {category.courses?.length || 0} Course{category.courses?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="bg-academic-navy-100 hover:bg-academic-navy-200 text-academic-navy-700 p-2 border border-academic-navy-200 transition-all duration-200 rounded-lg hover:shadow-classic flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCategorySelect(category);
                      }}
                      title="View Courses"
                    >
                      <FaArrowRight size={12} />
                    </button>
                  </div>

                  <p className="text-sm text-academic-slate-700 line-clamp-3 mb-4 font-inter leading-relaxed">
                    {category.description}
                  </p>

                  <div className="pt-4 border-t border-academic-slate-200">
                    <div className="flex items-center justify-between text-xs text-academic-slate-500 font-inter">
                      <span className="font-medium">ID: {category._id.slice(-8).toUpperCase()}</span>
                      <span className="font-medium">Academic Category</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
