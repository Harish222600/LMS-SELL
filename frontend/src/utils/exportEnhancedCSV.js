/**
 * Enhanced CSV Export Utility
 * Generates comprehensive analytics reports with real-time data
 */

export const exportEnhancedCSV = (analytics, systemHealth) => {
  if (!analytics) {
    console.error('No analytics data available for export');
    return;
  }

  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleString();
  
  // Build comprehensive CSV content with multiple sections
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // ==================== HEADER SECTION ====================
  csvContent += "LMS ANALYTICS REPORT\n";
  csvContent += `Generated On,${dateStr}\n`;
  csvContent += `Report Timestamp,${timestamp}\n`;
  csvContent += `Report Type,Comprehensive Analytics\n`;
  csvContent += "\n";
  
  // ==================== SYSTEM HEALTH SECTION ====================
  if (systemHealth) {
    csvContent += "=== SYSTEM HEALTH & PERFORMANCE ===\n";
    csvContent += "Metric,Value,Status,Details\n";
    csvContent += `System Status,${systemHealth.systemStatus},${systemHealth.systemStatus === 'operational' ? 'Healthy' : 'Needs Attention'},All systems monitored\n`;
    csvContent += `Uptime,${systemHealth.uptime.percentage}%,Excellent,${systemHealth.uptime.hours} hours continuous\n`;
    csvContent += `Average Response Time,${systemHealth.responseTime.average}ms,${systemHealth.responseTime.average < 500 ? 'Fast' : systemHealth.responseTime.average < 1000 ? 'Good' : 'Slow'},Based on ${systemHealth.responseTime.samples} API calls\n`;
    csvContent += `Active Users (30min),${systemHealth.activeUsers},Real-time,Currently online users\n`;
    csvContent += `Pending Requests,${systemHealth.pendingRequests},${systemHealth.pendingRequests > 5 ? 'High Priority' : 'Normal'},Requires attention\n`;
    csvContent += `Total Registered Users,${systemHealth.totalUsers},Active,System-wide\n`;
    csvContent += `Last Health Check,${new Date(systemHealth.timestamp).toLocaleString()},Current,Auto-refreshed\n`;
    csvContent += "\n";
  }
  
  // ==================== USER STATISTICS SECTION ====================
  csvContent += "=== USER STATISTICS ===\n";
  csvContent += "Category,Count,Percentage,Growth Indicator\n";
  const totalUsers = analytics.users.total || 1;
  csvContent += `Total Users,${analytics.users.total},100%,Base metric\n`;
  csvContent += `Students,${analytics.users.students},${((analytics.users.students / totalUsers) * 100).toFixed(1)}%,Primary user base\n`;
  csvContent += `Instructors,${analytics.users.instructors},${((analytics.users.instructors / totalUsers) * 100).toFixed(1)}%,Content creators\n`;
  csvContent += `Admins,${analytics.users.admins},${((analytics.users.admins / totalUsers) * 100).toFixed(1)}%,System administrators\n`;
  csvContent += `Recent Registrations,${analytics.users.recentRegistrations},${((analytics.users.recentRegistrations / totalUsers) * 100).toFixed(1)}%,New sign-ups\n`;
  csvContent += "\n";
  
  // ==================== COURSE STATISTICS SECTION ====================
  csvContent += "=== COURSE STATISTICS ===\n";
  csvContent += "Category,Count,Percentage,Status\n";
  const totalCourses = analytics.courses.total || 1;
  csvContent += `Total Courses,${analytics.courses.total},100%,All courses\n`;
  csvContent += `Published Courses,${analytics.courses.published},${((analytics.courses.published / totalCourses) * 100).toFixed(1)}%,Live and accessible\n`;
  csvContent += `Draft Courses,${analytics.courses.draft},${((analytics.courses.draft / totalCourses) * 100).toFixed(1)}%,In development\n`;
  csvContent += `Free Courses,${analytics.courses.free},${((analytics.courses.free / totalCourses) * 100).toFixed(1)}%,No payment required\n`;
  csvContent += `Paid Courses,${analytics.courses.paid},${((analytics.courses.paid / totalCourses) * 100).toFixed(1)}%,Premium content\n`;
  csvContent += `Publication Rate,${((analytics.courses.published / totalCourses) * 100).toFixed(1)}%,,Course completion metric\n`;
  csvContent += "\n";
  
  // ==================== REVENUE ANALYTICS SECTION ====================
  if (analytics.revenue) {
    csvContent += "=== REVENUE ANALYTICS ===\n";
    csvContent += "Metric,Amount (₹),Growth %,Period\n";
    csvContent += `Total Revenue,₹${analytics.revenue.totalRevenue?.toLocaleString() || 0},,All-time\n`;
    csvContent += `Monthly Revenue,₹${analytics.revenue.monthlyRevenue?.toLocaleString() || 0},${analytics.revenue.growthPercentage || 0}%,Current month\n`;
    csvContent += `Average Course Price,₹${analytics.revenue.averageCoursePrice?.toLocaleString() || 0},,Per course\n`;
    csvContent += `Revenue per User,₹${Math.round((analytics.revenue.totalRevenue || 0) / totalUsers).toLocaleString()},,Average\n`;
    csvContent += "\n";
  }
  
  // ==================== RECENT COURSES SECTION ====================
  if (analytics.recentCourses && analytics.recentCourses.length > 0) {
    csvContent += "=== RECENT COURSES (Latest 10) ===\n";
    csvContent += "Course Name,Instructor,Status,Price (₹),Created Date,Category\n";
    analytics.recentCourses.slice(0, 10).forEach(course => {
      const instructorName = `${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.trim();
      const createdDate = new Date(course.createdAt).toLocaleDateString();
      const category = course.category?.name || 'Uncategorized';
      csvContent += `"${course.courseName}",${instructorName},${course.status},₹${course.price},${createdDate},${category}\n`;
    });
    csvContent += "\n";
  }
  
  // ==================== RECENT USER ACTIVITY SECTION ====================
  if (analytics.recentLogins && analytics.recentLogins.length > 0) {
    csvContent += "=== RECENT USER ACTIVITY (Latest 10) ===\n";
    csvContent += "Name,Email,Account Type,Activity Date,Activity Time,Status\n";
    analytics.recentLogins.slice(0, 10).forEach(user => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const activityDate = new Date(user.createdAt).toLocaleDateString();
      const activityTime = new Date(user.createdAt).toLocaleTimeString();
      const status = user.active ? 'Active' : 'Inactive';
      csvContent += `"${fullName}","${user.email}",${user.accountType},${activityDate},${activityTime},${status}\n`;
    });
    csvContent += "\n";
  }
  
  // ==================== ENGAGEMENT METRICS SECTION ====================
  csvContent += "=== ENGAGEMENT METRICS ===\n";
  csvContent += "Metric,Value,Benchmark,Performance\n";
  const engagementRate = systemHealth ? ((systemHealth.activeUsers / totalUsers) * 100).toFixed(1) : 'N/A';
  const instructorRatio = ((analytics.users.instructors / totalUsers) * 100).toFixed(1);
  const coursePerInstructor = (analytics.courses.total / (analytics.users.instructors || 1)).toFixed(1);
  csvContent += `User Engagement Rate,${engagementRate}%,>10%,${parseFloat(engagementRate) > 10 ? 'Good' : 'Needs Improvement'}\n`;
  csvContent += `Instructor Ratio,${instructorRatio}%,5-15%,${parseFloat(instructorRatio) >= 5 && parseFloat(instructorRatio) <= 15 ? 'Optimal' : 'Review'}\n`;
  csvContent += `Courses per Instructor,${coursePerInstructor},>2,${parseFloat(coursePerInstructor) > 2 ? 'Productive' : 'Low'}\n`;
  csvContent += `Student to Instructor Ratio,${(analytics.users.students / (analytics.users.instructors || 1)).toFixed(1)}:1,<50:1,${(analytics.users.students / (analytics.users.instructors || 1)) < 50 ? 'Good' : 'High'}\n`;
  csvContent += "\n";
  
  // ==================== PENDING ACTIONS SECTION ====================
  csvContent += "=== PENDING ACTIONS & ALERTS ===\n";
  csvContent += "Item,Count,Priority,Action Required\n";
  csvContent += `Access Requests,${analytics.requests?.pendingAccessRequests || 0},${(analytics.requests?.pendingAccessRequests || 0) > 5 ? 'High' : 'Normal'},Review and approve/reject\n`;
  csvContent += `Draft Courses,${analytics.courses.draft},${analytics.courses.draft > 10 ? 'High' : 'Normal'},${analytics.courses.draft > 10 ? 'Review and publish' : 'Monitor progress'}\n`;
  csvContent += `Inactive Instructors,${analytics.users.instructors - (analytics.recentLogins?.filter(u => u.accountType === 'Instructor').length || 0)},Low,Follow up for engagement\n`;
  csvContent += "\n";
  
  // ==================== PERFORMANCE SUMMARY SECTION ====================
  csvContent += "=== PERFORMANCE SUMMARY ===\n";
  csvContent += "Key Performance Indicator,Value,Target,Status\n";
  csvContent += `Overall System Health,${systemHealth?.systemStatus || 'Unknown'},Operational,${systemHealth?.systemStatus === 'operational' ? '✓ Met' : '✗ Below Target'}\n`;
  csvContent += `API Response Time,${systemHealth?.responseTime.average || 'N/A'}ms,<1000ms,${(systemHealth?.responseTime.average || 999999) < 1000 ? '✓ Met' : '✗ Needs Optimization'}\n`;
  csvContent += `User Growth,${analytics.users.recentRegistrations},>50/month,${analytics.users.recentRegistrations > 50 ? '✓ Met' : '○ Monitor'}\n`;
  csvContent += `Course Publication Rate,${((analytics.courses.published / totalCourses) * 100).toFixed(1)}%,>80%,${((analytics.courses.published / totalCourses) * 100) > 80 ? '✓ Met' : '○ Improve'}\n`;
  csvContent += `Active User Ratio,${engagementRate}%,>15%,${parseFloat(engagementRate) > 15 ? '✓ Met' : '○ Boost Engagement'}\n`;
  csvContent += "\n";
  
  // ==================== RECOMMENDATIONS SECTION ====================
  csvContent += "=== AUTOMATED RECOMMENDATIONS ===\n";
  csvContent += "Area,Recommendation,Priority\n";
  
  // Generate dynamic recommendations
  if ((analytics.requests?.pendingAccessRequests || 0) > 5) {
    csvContent += `Access Requests,Review ${analytics.requests.pendingAccessRequests} pending access requests,High\n`;
  }
  if (analytics.courses.draft > 10) {
    csvContent += `Course Management,${analytics.courses.draft} courses in draft - encourage instructors to publish,Medium\n`;
  }
  if (systemHealth && systemHealth.responseTime.average > 1000) {
    csvContent += `System Performance,API response time is ${systemHealth.responseTime.average}ms - consider optimization,High\n`;
  }
  if (systemHealth && ((systemHealth.activeUsers / totalUsers) * 100) < 10) {
    csvContent += `User Engagement,Only ${((systemHealth.activeUsers / totalUsers) * 100).toFixed(1)}% users active - boost engagement campaigns,Medium\n`;
  }
  if ((analytics.courses.free / totalCourses * 100) < 20) {
    csvContent += `Course Strategy,Consider adding more free courses to attract new users,Low\n`;
  }
  csvContent += "\n";
  
  // ==================== FOOTER SECTION ====================
  csvContent += "=== REPORT METADATA ===\n";
  csvContent += `Report Generated By,LMS Admin Dashboard\n`;
  csvContent += `Export Date,${dateStr}\n`;
  csvContent += `Data Freshness,Real-time (auto-refreshed every 30s)\n`;
  csvContent += `Report Version,2.0 - Enhanced\n`;
  csvContent += "\n";
  csvContent += "END OF REPORT\n";

  // Create and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `lms-analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
};
