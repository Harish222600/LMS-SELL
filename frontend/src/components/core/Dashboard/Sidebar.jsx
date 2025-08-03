import { useEffect, useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

import { sidebarLinks } from './../../../../data/dashboard-links';
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"
import SidebarLink from "./SidebarLink"
import Loading from './../../common/Loading';

import { HiMenuAlt1 } from 'react-icons/hi'
import { IoMdClose } from 'react-icons/io'
import { FiSettings } from 'react-icons/fi'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { FaGraduationCap } from 'react-icons/fa'

import { setOpenSideMenu, setScreenSize, toggleSidebarCollapse } from "../../../slices/sidebarSlice";

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [confirmationModal, setConfirmationModal] = useState(null)
  const { openSideMenu, screenSize, isCollapsed } = useSelector((state) => state.sidebar)

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth))
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (screenSize <= 640) {
      dispatch(setOpenSideMenu(false))
    }
    else dispatch(setOpenSideMenu(true))
  }, [screenSize])

  if (profileLoading || authLoading) {
    return (
      <motion.div 
        className="flex h-[calc(100vh-3.5rem)] min-w-[280px] items-center justify-center bg-white border-r border-academic-slate-200 shadow-classic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative">
          <div className="w-8 h-8 border-3 border-academic-slate-200 border-t-academic-navy-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-academic-gold-600 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      {/* Academic Mobile Menu Toggle */}
      <div className="sm:hidden fixed top-20 left-4 z-[60]">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(setOpenSideMenu(!openSideMenu))}
          className="p-3 rounded-xl bg-white border border-academic-slate-200 text-academic-navy-700 hover:bg-academic-navy-50 hover:border-academic-navy-300 transition-all duration-300 shadow-classic"
        >
          <AnimatePresence mode="wait">
            {openSideMenu ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <IoMdClose size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiMenuAlt1 size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Academic Sidebar */}
      <AnimatePresence>
        {openSideMenu && (
          <>
            {/* Academic Mobile Overlay */}
            {screenSize <= 640 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-academic-navy-900/60 backdrop-blur-sm z-[45] sm:hidden"
                onClick={() => dispatch(setOpenSideMenu(false))}
              />
            )}
            
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`fixed sm:relative h-[100vh] ${
                isCollapsed ? 'w-[70px]' : 'w-[280px] xs:w-[260px] sm:w-[240px]'
              } flex flex-col bg-white border-r border-academic-slate-200 transition-all duration-300 z-50 shadow-classic`}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Academic Collapse/Expand Button - Desktop Only */}
              {screenSize > 640 && (
                <div className="absolute -right-3 top-20 z-[1001]">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch(toggleSidebarCollapse())}
                    className="w-8 h-8 bg-academic-navy-600 border border-academic-navy-700 rounded-full flex items-center justify-center text-white hover:bg-academic-navy-700 hover:shadow-lg transition-all duration-300 shadow-md"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    <motion.div
                      animate={{ rotate: isCollapsed ? 0 : 180 }}
                      transition={{ duration: 0.2, ease: "linear" }}
                    >
                      <MdKeyboardArrowLeft size={16} />
                    </motion.div>
                  </motion.button>
                </div>
              )}

              {/* Top Spacer */}
              <div className="h-16 sm:h-0 flex-shrink-0"></div>

              {/* Academic User Profile Section */}
              <motion.div 
                className={`${isCollapsed ? 'p-3' : 'px-4 py-4'} border-b border-academic-slate-200 transition-all duration-300 flex-shrink-0`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
                  <div className="relative">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`}
                      alt="Profile"
                      className={`${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl object-cover ring-3 ring-academic-navy-600 ring-offset-2 ring-offset-white transition-all duration-300`}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div 
                        className="flex-1 min-w-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="mb-1">
                          <h3 className="text-academic-navy-900 font-bold text-sm truncate">
                            {user?.firstName} {user?.lastName}
                          </h3>
                        </div>
                        <div>
                          <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user?.accountType === 'Student' 
                              ? 'bg-academic-navy-600 text-white' 
                              : 'bg-academic-gold-600 text-white'
                          }`}>
                            {user?.accountType}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Academic Navigation Links - Scrollable Container */}
              <div className="flex-1 overflow-hidden">
                <div className={`h-full py-4 ${isCollapsed ? 'px-2' : 'px-4'} overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-academic-slate-300/50 hover:scrollbar-thumb-academic-slate-400/50 scrollbar-thumb-rounded-full`}>
                  <nav className="space-y-2">
                    {sidebarLinks.map((link, index) => {
                      if (link.type && user?.accountType !== link.type) return null
                      return (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <SidebarLink link={link} iconName={link.icon} isCollapsed={isCollapsed} />
                        </motion.div>
                      )
                    })}
                  </nav>

                  {/* Academic Divider */}
                  <div className="my-6 h-px bg-academic-slate-200" />

                  {/* Academic Settings & Logout */}
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <SidebarLink
                        link={{ name: "Settings", path: "/dashboard/settings" }}
                        iconName={"VscSettingsGear"}
                        isCollapsed={isCollapsed}
                      />
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Are you sure?",
                          text2: "You will be logged out of your account.",
                          btn1Text: "Logout",
                          btn2Text: "Cancel",
                          btn1Handler: () => dispatch(logout(navigate)),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} text-academic-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group`}
                      title={isCollapsed ? "Logout" : "Sign out of your account"}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-academic-slate-100 group-hover:bg-red-100 transition-all duration-300">
                        <VscSignOut className="text-lg group-hover:text-red-500 transition-colors duration-300" />
                      </div>
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="flex-1 text-left"
                          >
                            <div className="font-semibold text-sm">Logout</div>
                            <div className="text-xs text-academic-slate-400">Sign out of your account</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>

                  {/* Academic Footer */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div 
                        className="mt-6 pt-4 border-t border-academic-slate-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <FaGraduationCap className="text-academic-navy-600 w-4 h-4" />
                            <span className="text-sm font-bold text-academic-navy-700">
                              Beeja Academy
                            </span>
                          </div>
                          <p className="text-xs text-academic-slate-400">
                            © 2024 Beeja Innovation Ventures
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} closeModal={() => setConfirmationModal(null)} />}
    </>
  )
}
