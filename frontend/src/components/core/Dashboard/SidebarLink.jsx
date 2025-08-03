import * as Icons from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { resetCourseState } from "../../../slices/courseSlice"
import { setOpenSideMenu } from "../../../slices/sidebarSlice"

export default function SidebarLink({ link, iconName, isCollapsed }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()
  const { openSideMenu, screenSize } = useSelector(state => state.sidebar)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const handleClick = () => {
    dispatch(resetCourseState())
    if (openSideMenu && screenSize <= 640) dispatch(setOpenSideMenu(false))
  }

  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      className={({ isActive }) => `
        group flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl transition-all duration-300 relative overflow-hidden
        ${isActive 
          ? 'bg-academic-navy-600 text-white shadow-lg transform scale-[1.02]' 
          : 'text-academic-slate-600 hover:text-academic-slate-800 hover:bg-academic-slate-100 hover:shadow-md'
        }
      `}
      title={isCollapsed ? link.name : ""}
    >
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      <div className="relative flex items-center gap-3 w-full">
        {/* Academic Icon Container */}
        <div className={`relative flex items-center justify-center ${
          isCollapsed ? 'w-6 h-6' : 'w-8 h-8'
        } rounded-xl ${
          matchRoute(link.path) 
            ? 'bg-white/20' 
            : 'bg-academic-slate-100 group-hover:bg-white'
        } transition-all duration-300`}>
          <Icon className={`text-lg ${
            matchRoute(link.path)
              ? 'text-white'
              : 'text-academic-slate-600 group-hover:text-academic-slate-800'
          } transition-colors duration-300`} />
        </div>

        {/* Academic Link Text - Hidden when collapsed */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              className="flex-1 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <div className="font-semibold text-sm">{link.name}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Academic Active Indicator */}
      {matchRoute(link.path) && (
        <motion.div 
          className="absolute left-0 w-1 h-8 bg-academic-gold-600 rounded-r-full shadow-lg"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Academic Tooltip for collapsed state */}
      {isCollapsed && (
        <motion.div 
          className="absolute left-full ml-3 px-3 py-2 bg-academic-navy-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
        >
          <div className="font-medium">{link.name}</div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-academic-navy-800 rotate-45"></div>
        </motion.div>
      )}
    </NavLink>
  )
}
