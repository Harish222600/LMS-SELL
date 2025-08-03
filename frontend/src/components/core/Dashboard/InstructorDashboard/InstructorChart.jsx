import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")

  // Generate academic theme colors
  const generateAcademicColors = (numColors) => {
    const colors = [
      'rgba(30, 58, 138, 0.8)',   // Academic Navy
      'rgba(217, 119, 6, 0.8)',   // Academic Gold
      'rgba(15, 118, 110, 0.8)',  // Teal
      'rgba(101, 163, 13, 0.8)',  // Lime
      'rgba(147, 51, 234, 0.8)',  // Purple
      'rgba(220, 38, 127, 0.8)',  // Pink
      'rgba(37, 99, 235, 0.8)',   // Blue
      'rgba(16, 185, 129, 0.8)',  // Emerald
    ]
    return colors.slice(0, numColors)
  }

  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: generateAcademicColors(courses.length),
        borderColor: generateAcademicColors(courses.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  }

  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: generateAcademicColors(courses.length),
        borderColor: generateAcademicColors(courses.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Playfair Display, Georgia, serif'
          },
          color: '#1e3a8a' // Academic navy
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e3a8a',
        bodyColor: '#475569',
        borderColor: 'rgba(217, 119, 6, 0.5)',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          family: 'Playfair Display, Georgia, serif',
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 12
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${currChart === 'income' ? '₹' : ''}${value} (${percentage}%)`;
          }
        }
      }
    }
  }

  return (
    <div className="classic-card p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="elegant-heading text-xl text-academic-navy-900">Performance Analytics</h3>
        
        <div className="flex gap-3">
          <button
            onClick={() => setCurrChart("students")}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              currChart === "students"
                ? "bg-academic-gold-500 text-white shadow-elegant"
                : "bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200 hover:text-academic-navy-900"
            }`}
          >
            Students
          </button>
          
          <button
            onClick={() => setCurrChart("income")}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              currChart === "income"
                ? "bg-academic-gold-500 text-white shadow-elegant"
                : "bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200 hover:text-academic-navy-900"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="w-full max-w-[400px] h-[400px] relative bg-academic-cream-50 rounded-xl p-6 border border-academic-slate-200">
          <Pie
            data={currChart === "students" ? chartDataStudents : chartIncomeData}
            options={options}
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center p-6 bg-academic-navy-50 rounded-xl border border-academic-navy-200">
          <p className="text-sm font-medium text-academic-slate-600 mb-2">
            Total {currChart === 'students' ? 'Students' : 'Revenue'}
          </p>
          <p className="text-3xl font-bold text-academic-navy-900">
            {currChart === 'students' 
              ? courses.reduce((acc, course) => acc + course.totalStudentsEnrolled, 0).toLocaleString()
              : `₹${courses.reduce((acc, course) => acc + course.totalAmountGenerated, 0).toLocaleString()}`
            }
          </p>
        </div>
        <div className="text-center p-6 bg-academic-gold-50 rounded-xl border border-academic-gold-200">
          <p className="text-sm font-medium text-academic-slate-600 mb-2">Active Courses</p>
          <p className="text-3xl font-bold text-academic-gold-700">{courses.length}</p>
        </div>
      </div>
    </div>
  )
}
