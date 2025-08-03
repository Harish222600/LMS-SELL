import { useState } from "react";
import { FaPalette, FaFont, FaCog, FaSave } from "react-icons/fa";

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: {
      primaryColor: "#d97706",
      secondaryColor: "#1e3a8a",
      accentColor: "#64748b"
    },
    typography: {
      primaryFont: "Playfair Display",
      fontSize: "16px",
      headingScale: "1.2"
    },
    layout: {
      sidebarWidth: "250px",
      contentMaxWidth: "1200px",
      headerHeight: "60px"
    }
  });

  const [activeTab, setActiveTab] = useState("theme");

  const handleThemeChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: value
      }
    }));
  };

  const handleTypographyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value
      }
    }));
  };

  const handleLayoutChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    // You can also implement API call to save settings in backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="classic-heading text-3xl md:text-4xl mb-2">System Settings</h1>
            <p className="section-subtitle text-lg">Configure your admin panel appearance and behavior</p>
          </div>
          <button
            onClick={handleSave}
            className="btn-elegant flex items-center gap-2"
          >
            <FaSave className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Settings Navigation */}
        <div className="classic-card p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("theme")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "theme"
                  ? "bg-academic-navy-700 text-white shadow-classic"
                  : "bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200"
              }`}
            >
              <FaPalette className="w-4 h-4" />
              <span>Theme</span>
            </button>
            <button
              onClick={() => setActiveTab("typography")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "typography"
                  ? "bg-academic-navy-700 text-white shadow-classic"
                  : "bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200"
              }`}
            >
              <FaFont className="w-4 h-4" />
              <span>Typography</span>
            </button>
            <button
              onClick={() => setActiveTab("layout")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "layout"
                  ? "bg-academic-navy-700 text-white shadow-classic"
                  : "bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200"
              }`}
            >
              <FaCog className="w-4 h-4" />
              <span>Layout</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="classic-card p-8">
          {activeTab === "theme" && (
            <div className="space-y-8">
              <div>
                <h2 className="elegant-heading mb-6">Theme Settings</h2>
                <p className="text-academic-slate-600 mb-8">Customize the color scheme of your admin panel</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="classic-label">Primary Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-academic-slate-300 shadow-classic"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={settings.theme.primaryColor}
                        onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                        className="classic-input"
                        placeholder="#d97706"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="classic-label">Secondary Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-academic-slate-300 shadow-classic"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={settings.theme.secondaryColor}
                        onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                        className="classic-input"
                        placeholder="#1e3a8a"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="classic-label">Accent Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={settings.theme.accentColor}
                      onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-academic-slate-300 shadow-classic"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={settings.theme.accentColor}
                        onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                        className="classic-input"
                        placeholder="#64748b"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-8">
              <div>
                <h2 className="elegant-heading mb-6">Typography Settings</h2>
                <p className="text-academic-slate-600 mb-8">Configure fonts and text styling for your admin panel</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="classic-label">Primary Font</label>
                  <select
                    value={settings.typography.primaryFont}
                    onChange={(e) => handleTypographyChange("primaryFont", e.target.value)}
                    className="classic-input"
                  >
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Crimson Text">Crimson Text</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="classic-label">Base Font Size</label>
                  <select
                    value={settings.typography.fontSize}
                    onChange={(e) => handleTypographyChange("fontSize", e.target.value)}
                    className="classic-input"
                  >
                    <option value="14px">14px - Small</option>
                    <option value="16px">16px - Medium</option>
                    <option value="18px">18px - Large</option>
                    <option value="20px">20px - Extra Large</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="classic-label">Heading Scale</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="2"
                    value={settings.typography.headingScale}
                    onChange={(e) => handleTypographyChange("headingScale", e.target.value)}
                    className="classic-input"
                    placeholder="1.2"
                  />
                  <p className="text-sm text-academic-slate-500">Multiplier for heading sizes (1.0 - 2.0)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "layout" && (
            <div className="space-y-8">
              <div>
                <h2 className="elegant-heading mb-6">Layout Settings</h2>
                <p className="text-academic-slate-600 mb-8">Adjust the layout dimensions and spacing of your admin panel</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="classic-label">Sidebar Width</label>
                  <input
                    type="text"
                    value={settings.layout.sidebarWidth}
                    onChange={(e) => handleLayoutChange("sidebarWidth", e.target.value)}
                    className="classic-input"
                    placeholder="250px"
                  />
                  <p className="text-sm text-academic-slate-500">Width of the navigation sidebar</p>
                </div>
                
                <div className="space-y-3">
                  <label className="classic-label">Content Max Width</label>
                  <input
                    type="text"
                    value={settings.layout.contentMaxWidth}
                    onChange={(e) => handleLayoutChange("contentMaxWidth", e.target.value)}
                    className="classic-input"
                    placeholder="1200px"
                  />
                  <p className="text-sm text-academic-slate-500">Maximum width of main content area</p>
                </div>
                
                <div className="space-y-3">
                  <label className="classic-label">Header Height</label>
                  <input
                    type="text"
                    value={settings.layout.headerHeight}
                    onChange={(e) => handleLayoutChange("headerHeight", e.target.value)}
                    className="classic-input"
                    placeholder="60px"
                  />
                  <p className="text-sm text-academic-slate-500">Height of the top navigation bar</p>
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          <div className="mt-12 p-6 border-2 border-academic-slate-200 rounded-xl bg-academic-cream-50">
            <h3 className="elegant-heading mb-6">Live Preview</h3>
            <div 
              className="p-6 rounded-xl shadow-classic"
              style={{ 
                backgroundColor: settings.theme.secondaryColor,
                color: settings.theme.primaryColor,
                fontFamily: settings.typography.primaryFont,
                fontSize: settings.typography.fontSize
              }}
            >
              <h3 
                className="font-bold mb-4"
                style={{ 
                  fontSize: `calc(${settings.typography.fontSize} * ${settings.typography.headingScale})`,
                  fontFamily: settings.typography.primaryFont === 'Playfair Display' ? 'Playfair Display, serif' : settings.typography.primaryFont
                }}
              >
                Sample Heading
              </h3>
              <p className="mb-6 leading-relaxed">
                This is a preview of how your content will look with the current settings. 
                The typography, colors, and spacing will be applied throughout your admin panel.
              </p>
              <div className="flex gap-4">
                <button
                  className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                  style={{ 
                    backgroundColor: settings.theme.primaryColor,
                    color: settings.theme.secondaryColor
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-6 py-3 rounded-lg font-medium border-2 transition-colors duration-200 hover:opacity-90"
                  style={{ 
                    borderColor: settings.theme.accentColor,
                    color: settings.theme.accentColor,
                    backgroundColor: 'transparent'
                  }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
