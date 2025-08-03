import { useEffect } from "react";
import { FaBook, FaLightbulb, FaImage, FaVideo, FaCog, FaPlus, FaBullhorn, FaStickyNote, FaRupeeSign } from "react-icons/fa";
import RenderSteps from "./RenderSteps"



export default function AddCourse() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Add Course</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
              <FaBook className="text-academic-gold-700 text-2xl" />
            </div>
            <div>
              <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                Create New Course
              </h1>
              <p className="section-subtitle text-lg">
                Build and publish your academic course content
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-start gap-x-8 px-8 py-6">
        <div className="flex flex-1 flex-col">
          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>

        {/* Academic Course Upload Tips */}
        <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1">
          <div className="classic-card bg-white">
            <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <FaLightbulb className="text-academic-gold-700 text-xl" />
                <h2 className="elegant-heading text-academic-navy-900">Course Creation Tips</h2>
              </div>
              <p className="text-sm text-academic-slate-600 font-inter mt-1">Best practices for academic courses</p>
            </div>

            <div className="p-6">
              <ul className="space-y-4 text-sm text-academic-slate-700 font-inter">
                <li className="flex items-start gap-3">
                  <FaRupeeSign className="text-academic-gold-600 mt-1 flex-shrink-0" size={12} />
                  <span>Set the Course Price option or make it free for wider accessibility.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaImage className="text-academic-gold-600 mt-1 flex-shrink-0" size={12} />
                  <span>Standard size for the course thumbnail is 1024x576 pixels for optimal display.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaVideo className="text-academic-gold-600 mt-1 flex-shrink-0" size={12} />
                  <span>Video section controls the course overview video that students see first.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCog className="text-academic-gold-600 mt-1 flex-shrink-0" size={12} />
                  <span>Course Builder is where you create & organize your academic content structure.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaPlus className="text-academic-gold-600 mt-1 flex-shrink-0" size={12} />
                  <span>Add Topics in the Course Builder section to create lessons and assignments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaBook className="text-academic-gold-600 mt-1 flex-shrink-0" size={12} />
                  <span>Information from the Additional Data section shows up on the course single page.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaBullhorn className="text-academic-gold-600 mt-1 flex-shrink-0" size={12} />
                  <span>Make Announcements to notify important updates to all enrolled students.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaStickyNote className="text-academic-gold-600 mt-1 flex-shrink-0" size={12} />
                  <span>Use Notes feature to share additional resources and study materials.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
