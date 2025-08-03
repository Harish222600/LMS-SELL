import React from "react"
import { FaCheck, FaBook, FaCog, FaRocket } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse"
import EditCourse from './../EditCourse/EditCourse';

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course)
  const { editCourse } = useSelector(state => state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information",
      description: "Basic course details and settings",
      icon: FaBook,
      color: "blue"
    },
    {
      id: 2,
      title: "Course Builder",
      description: "Create sections and lectures",
      icon: FaCog,
      color: "green"
    },
    {
      id: 3,
      title: "Publish",
      description: "Review and publish your course",
      icon: FaRocket,
      color: "purple"
    },
  ]

  const getStepStatus = (stepId) => {
    if (step > stepId) return 'completed'
    if (step === stepId) return 'active'
    return 'pending'
  }

  const getStepColors = (stepId, color) => {
    const status = getStepStatus(stepId)
    
    if (status === 'completed') {
      return {
        bg: 'bg-green-600',
        border: 'border-green-600',
        text: 'text-white',
        icon: 'text-white'
      }
    }
    
    if (status === 'active') {
      return {
        bg: `bg-${color}-600`,
        border: `border-${color}-600`,
        text: 'text-white',
        icon: 'text-white'
      }
    }
    
    return {
      bg: 'bg-gray-200',
      border: 'border-gray-300',
      text: 'text-gray-500',
      icon: 'text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Step Progress Indicator */}
      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="bg-gray-50 border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Course Creation Progress</h2>
          <p className="text-sm text-gray-600">Follow these steps to create your course</p>
        </div>
        
        <div className="p-6">
          {/* Desktop Step Indicator */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-8">
              {steps.map((stepItem, index) => {
                const colors = getStepColors(stepItem.id, stepItem.color)
                const status = getStepStatus(stepItem.id)
                
                return (
                  <React.Fragment key={stepItem.id}>
                    <div className="flex flex-col items-center">
                      {/* Step Circle */}
                      <div className={`w-16 h-16 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center mb-3 transition-all duration-300`}>
                        {status === 'completed' ? (
                          <FaCheck className="text-white text-xl" />
                        ) : (
                          <stepItem.icon className={`${colors.icon} text-xl`} />
                        )}
                      </div>
                      
                      {/* Step Info */}
                      <div className="text-center max-w-[200px]">
                        <h3 className={`font-semibold mb-1 ${status === 'pending' ? 'text-gray-500' : 'text-gray-800'}`}>
                          {stepItem.title}
                        </h3>
                        <p className={`text-sm ${status === 'pending' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stepItem.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-4">
                        <div className={`h-1 ${status === 'completed' ? 'bg-green-600' : 'bg-gray-300'} transition-all duration-300`}></div>
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* Mobile Step Indicator */}
          <div className="md:hidden mb-8">
            <div className="space-y-4">
              {steps.map((stepItem) => {
                const colors = getStepColors(stepItem.id, stepItem.color)
                const status = getStepStatus(stepItem.id)
                
                return (
                  <div key={stepItem.id} className={`flex items-center p-4 border-2 ${colors.border} ${status === 'active' ? 'bg-blue-50' : 'bg-white'} transition-all duration-300`}>
                    <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center mr-4`}>
                      {status === 'completed' ? (
                        <FaCheck className="text-white" />
                      ) : (
                        <stepItem.icon className={colors.icon} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${status === 'pending' ? 'text-gray-500' : 'text-gray-800'}`}>
                        {stepItem.title}
                      </h3>
                      <p className={`text-sm ${status === 'pending' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stepItem.description}
                      </p>
                    </div>
                    {status === 'active' && (
                      <div className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold">
                        CURRENT
                      </div>
                    )}
                    {status === 'completed' && (
                      <div className="bg-green-600 text-white px-3 py-1 text-xs font-semibold">
                        COMPLETED
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current Step Info */}
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              {React.createElement(steps[step - 1]?.icon || FaBook, { className: "text-blue-600 text-xl" })}
              <div>
                <h3 className="font-semibold text-blue-800">
                  Step {step}: {steps[step - 1]?.title}
                </h3>
                <p className="text-sm text-blue-600">
                  {steps[step - 1]?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div>
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </div>
    </div>
  )
}
