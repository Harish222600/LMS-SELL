import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"

import ImprovedFooter from "../components/common/ImprovedFooter"
import Course_Card from '../components/core/Catalog/Course_Card'
import Course_Slider from "../components/core/Catalog/Course_Slider"
import BundleCourseSection from "../components/core/Catalog/BundleCourseSection"
import Loading from './../components/common/Loading';
import HighlightText from '../components/core/HomePage/HighlightText';

import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import { fetchCourseCategories } from './../services/operations/courseDetailsAPI';

import { FaGraduationCap, FaBookOpen, FaUsers, FaStar, FaClock, FaChevronRight } from "react-icons/fa";

function Catalog() {
    const { catalogName } = useParams()
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [categoryId, setCategoryId] = useState("")
    const [loading, setLoading] = useState(false);

    // Fetch All Categories
    useEffect(() => {
        ; (async () => {
            try {
                const res = await fetchCourseCategories();
                const category_id = res.filter(
                    (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
                )[0]._id
                setCategoryId(category_id)
            } catch (error) {
                console.log("Could not fetch Categories.", error)
            }
        })()
    }, [catalogName])

    useEffect(() => {
        if (categoryId) {
            ; (async () => {
                setLoading(true)
                try {
                    const res = await getCatalogPageData(categoryId)
                    setCatalogPageData(res)
                } catch (error) {
                    console.log(error)
                }
                setLoading(false)
            })()
        }
    }, [categoryId])

    if (loading) {
        return (
            <div className="min-h-screen bg-classic-warmWhite flex items-center justify-center">
                <Loading />
            </div>
        )
    }

    if (!loading && !catalogPageData) {
        return (
            <div className="min-h-screen bg-classic-warmWhite flex flex-col">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 py-20">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-academic-gold-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-academic-navy-200/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="text-6xl mb-6">📚</div>
                            <h1 className="classic-heading text-4xl md:text-5xl mb-6">
                                No Courses Found
                            </h1>
                            <p className="section-subtitle text-xl max-w-2xl mx-auto mb-8">
                                We couldn't find any courses for the selected category. Please try exploring other categories or check back later.
                            </p>
                            <button 
                                onClick={() => window.history.back()} 
                                className="inline-flex items-center gap-2 bg-academic-navy-700 text-white px-8 py-4 rounded-lg font-medium hover:bg-academic-navy-800 transition-colors shadow-elegant"
                            >
                                Go Back <FaChevronRight className="text-sm" />
                            </button>
                        </motion.div>
                    </div>
                </section>
                <ImprovedFooter />
            </div>
        )
    }

    // Check if we have valid data but no courses
    if (!loading && catalogPageData && (!catalogPageData.selectedCategory?.courses || catalogPageData.selectedCategory.courses.length === 0)) {
        return (
            <div className="min-h-screen bg-classic-warmWhite flex flex-col">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 py-20">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-academic-gold-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-academic-navy-200/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Breadcrumb */}
                        <motion.nav
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-2 text-sm text-academic-slate-600 mb-8"
                        >
                            <span>Home</span>
                            <FaChevronRight className="text-xs" />
                            <span>Catalog</span>
                            <FaChevronRight className="text-xs" />
                            <span className="text-academic-gold-600 font-medium">
                                {catalogPageData?.selectedCategory?.name}
                            </span>
                        </motion.nav>

                        <div className="text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="classic-heading text-4xl md:text-5xl lg:text-6xl mb-6">
                                    {catalogPageData?.selectedCategory?.name}
                                    <HighlightText text=" Courses" variant="gold" />
                                </h1>
                                <p className="section-subtitle text-xl max-w-4xl mx-auto mb-8">
                                    {catalogPageData?.selectedCategory?.description}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-elegant p-12 max-w-2xl mx-auto"
                            >
                                <div className="text-6xl mb-6">📚</div>
                                <h2 className="elegant-heading text-2xl mb-4">No Courses Available Yet</h2>
                                <p className="text-academic-slate-600 mb-8">
                                    Courses for this category are coming soon. Please check back later or explore other categories.
                                </p>
                                <button 
                                    onClick={() => window.history.back()} 
                                    className="inline-flex items-center gap-2 bg-academic-navy-700 text-white px-8 py-4 rounded-lg font-medium hover:bg-academic-navy-800 transition-colors shadow-elegant"
                                >
                                    Go Back <FaChevronRight className="text-sm" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <ImprovedFooter />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-classic-warmWhite">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 py-20">
                <div className="absolute top-20 right-10 w-72 h-72 bg-academic-gold-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-academic-navy-200/20 rounded-full blur-3xl"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-2 text-sm text-academic-slate-600 mb-8"
                    >
                        <span>Home</span>
                        <FaChevronRight className="text-xs" />
                        <span>Catalog</span>
                        <FaChevronRight className="text-xs" />
                        <span className="text-academic-gold-600 font-medium">
                            {catalogPageData?.selectedCategory?.name}
                        </span>
                    </motion.nav>

                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="classic-heading text-4xl md:text-5xl lg:text-6xl mb-6">
                                {catalogPageData?.selectedCategory?.name}
                                <HighlightText text=" Courses" variant="gold" />
                            </h1>
                            <p className="section-subtitle text-xl max-w-4xl mx-auto mb-8">
                                {catalogPageData?.selectedCategory?.description}
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-8 mb-12"
                        >
                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-elegant">
                                <div className="w-10 h-10 bg-academic-navy-100 rounded-full flex items-center justify-center">
                                    <FaBookOpen className="text-academic-navy-700" />
                                </div>
                                <div className="text-left">
                                    <div className="text-lg font-bold text-academic-navy-900">
                                        {catalogPageData?.selectedCategory?.courses?.length || 0}
                                    </div>
                                    <div className="text-sm text-academic-slate-600">Courses</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-elegant">
                                <div className="w-10 h-10 bg-academic-gold-100 rounded-full flex items-center justify-center">
                                    <FaGraduationCap className="text-academic-gold-700" />
                                </div>
                                <div className="text-left">
                                    <div className="text-lg font-bold text-academic-navy-900">Expert</div>
                                    <div className="text-sm text-academic-slate-600">Instructors</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-elegant">
                                <div className="w-10 h-10 bg-academic-navy-100 rounded-full flex items-center justify-center">
                                    <FaStar className="text-academic-gold-600" />
                                </div>
                                <div className="text-left">
                                    <div className="text-lg font-bold text-academic-navy-900">4.9★</div>
                                    <div className="text-sm text-academic-slate-600">Rating</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Course Sections */}
            <div className="py-16">
                {/* Section 1 - Courses to get started */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <h2 className="classic-heading text-3xl md:text-4xl mb-4 text-center">
                                Courses to get you
                                <HighlightText text=" started" variant="gold" />
                            </h2>
                            <p className="section-subtitle text-center max-w-3xl mx-auto mb-8">
                                Begin your learning journey with our carefully curated selection of beginner-friendly courses
                            </p>
                        </motion.div>

                        {/* Tab Navigation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="flex justify-center mb-12"
                        >
                            <div className="bg-academic-cream-50 rounded-full p-2 flex gap-2">
                                <button
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                        active === 1
                                            ? "bg-white text-academic-navy-900 shadow-elegant"
                                            : "text-academic-slate-600 hover:text-academic-navy-900"
                                    }`}
                                    onClick={() => setActive(1)}
                                >
                                    Most Popular
                                </button>
                                <button
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                        active === 2
                                            ? "bg-white text-academic-navy-900 shadow-elegant"
                                            : "text-academic-slate-600 hover:text-academic-navy-900"
                                    }`}
                                    onClick={() => setActive(2)}
                                >
                                    New Releases
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Course_Slider
                                Courses={catalogPageData?.selectedCategory?.courses}
                            />
                        </motion.div>
                    </div>
                </section>

                {/* Section 2 - Top courses in different category */}
                {catalogPageData?.differentCategory?.courses && (
                    <section className="py-12 bg-academic-cream-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="mb-12"
                            >
                                <h2 className="classic-heading text-3xl md:text-4xl mb-4 text-center">
                                    Top courses in
                                    <HighlightText text={` ${catalogPageData?.differentCategory?.name}`} variant="gold" />
                                </h2>
                                <p className="section-subtitle text-center max-w-3xl mx-auto mb-8">
                                    Explore our most popular courses in {catalogPageData?.differentCategory?.name}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Course_Slider
                                    Courses={catalogPageData?.differentCategory?.courses}
                                />
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Bundle Course Section */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <h2 className="classic-heading text-3xl md:text-4xl mb-4 text-center">
                                Course
                                <HighlightText text=" Bundles" variant="gold" />
                            </h2>
                            <p className="section-subtitle text-center max-w-3xl mx-auto mb-8">
                                Save more with our specially curated course bundles designed for comprehensive learning
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <BundleCourseSection courses={catalogPageData?.selectedCategory?.courses} />
                        </motion.div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-16 bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h2 className="classic-heading text-white text-3xl md:text-4xl mb-6">
                                Ready to Start Your
                                <HighlightText text=" Learning Journey?" variant="gold" />
                            </h2>
                            <p className="section-subtitle text-academic-slate-200 text-lg max-w-2xl mx-auto">
                                Join thousands of students who are already mastering {catalogPageData?.selectedCategory?.name} with our expert-led courses
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button className="bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-medium hover:bg-academic-gold-400 transition-colors shadow-elegant">
                                    Browse All Courses
                                </button>
                                <button className="border border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-academic-navy-900 transition-colors">
                                    Contact Support
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>

            <ImprovedFooter />
        </div>
    )
}

export default Catalog
