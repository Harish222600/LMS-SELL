const User = require('../models/user');
const Profile = require('../models/profile');

// Track server start time for uptime calculation
const serverStartTime = Date.now();

// Store response times for calculating average
let responseTimes = [];
const MAX_RESPONSE_TIMES = 100; // Keep last 100 response times

// Middleware to track response times
const trackResponseTime = (req, res, next) => {
    const startTime = Date.now();
    
    // Override res.end to capture when response is sent
    const originalEnd = res.end;
    res.end = function(...args) {
        const responseTime = Date.now() - startTime;
        
        // Add to response times array
        responseTimes.push(responseTime);
        
        // Keep only last MAX_RESPONSE_TIMES entries
        if (responseTimes.length > MAX_RESPONSE_TIMES) {
            responseTimes.shift();
        }
        
        // Call original end
        originalEnd.apply(res, args);
    };
    
    next();
};

// Get system health metrics
const getSystemHealth = async (req, res) => {
    try {
        // Calculate uptime
        const uptimeMs = Date.now() - serverStartTime;
        const uptimeHours = uptimeMs / (1000 * 60 * 60);
        const uptimePercentage = 99.9; // You can implement more sophisticated uptime tracking
        
        // Calculate average response time
        const avgResponseTime = responseTimes.length > 0
            ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
            : 0;
        
        // Get active users count (users who have been active in last 30 minutes)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const activeUsersCount = await User.countDocuments({
            lastActive: { $gte: thirtyMinutesAgo }
        });
        
        // Get pending access requests count
        const pendingAccessRequests = await Profile.countDocuments({
            accessRequestStatus: 'Pending'
        });
        
        // Get total users for system status
        const totalUsers = await User.countDocuments({});
        
        // Determine system status
        const systemStatus = avgResponseTime < 1000 && uptimePercentage > 95
            ? 'operational'
            : avgResponseTime < 2000
            ? 'degraded'
            : 'down';
        
        res.status(200).json({
            success: true,
            data: {
                uptime: {
                    percentage: uptimePercentage,
                    hours: Math.round(uptimeHours),
                    milliseconds: uptimeMs
                },
                responseTime: {
                    average: avgResponseTime,
                    samples: responseTimes.length
                },
                activeUsers: activeUsersCount,
                pendingRequests: pendingAccessRequests,
                systemStatus: systemStatus,
                totalUsers: totalUsers,
                timestamp: new Date().toISOString()
            },
            message: 'System health metrics retrieved successfully'
        });
    } catch (error) {
        console.error('Error fetching system health metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch system health metrics',
            error: error.message
        });
    }
};

module.exports = {
    getSystemHealth,
    trackResponseTime
};
