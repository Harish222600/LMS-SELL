const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const axios = require('axios');

/**
 * Extract video duration from various sources
 * Supports: S3 URLs, Supabase URLs, direct video URLs
 */

/**
 * Extract duration using ffprobe (for direct video URLs)
 */
async function extractDurationWithFFprobe(videoUrl) {
    try {
        console.log('🎬 Extracting duration using ffprobe for:', videoUrl);
        
        const info = await ffprobe(videoUrl, { path: ffprobeStatic.path });
        const duration = info.streams[0]?.duration || info.format?.duration;
        
        if (duration) {
            const durationInSeconds = parseFloat(duration);
            console.log('✅ Duration extracted:', durationInSeconds, 'seconds');
            return durationInSeconds;
        }
        
        console.log('⚠️ No duration found in video metadata');
        return null;
    } catch (error) {
        console.error('❌ FFprobe extraction failed:', error.message);
        return null;
    }
}

/**
 * Extract duration by downloading video headers (for HTTP URLs)
 */
async function extractDurationFromHeaders(videoUrl) {
    try {
        console.log('📡 Attempting to extract duration from video headers:', videoUrl);
        
        // Make a HEAD request to get content info
        const response = await axios.head(videoUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        // Check if we can get duration from headers (some services provide this)
        const contentLength = response.headers['content-length'];
        const contentType = response.headers['content-type'];
        
        console.log('📊 Video info from headers:', {
            contentLength,
            contentType,
            size: contentLength ? `${(contentLength / (1024 * 1024)).toFixed(2)}MB` : 'Unknown'
        });
        
        // For now, we can't reliably extract duration from headers alone
        // This would need additional metadata or partial download
        return null;
    } catch (error) {
        console.error('❌ Header extraction failed:', error.message);
        return null;
    }
}

/**
 * Estimate duration based on file size (fallback method)
 */
function estimateDurationFromSize(fileSizeBytes, videoBitrate = 1000000) {
    if (!fileSizeBytes) return null;
    
    // Rough estimation: assuming average bitrate
    // This is very approximate and should only be used as last resort
    const estimatedSeconds = (fileSizeBytes * 8) / videoBitrate;
    console.log(`📏 Estimated duration from file size: ${estimatedSeconds.toFixed(0)} seconds`);
    
    return Math.max(60, Math.min(3600, estimatedSeconds)); // Clamp between 1 minute and 1 hour
}

/**
 * Main function to extract video duration
 */
async function extractVideoDuration(videoUrl, fallbackDuration = 300) {
    if (!videoUrl || typeof videoUrl !== 'string') {
        console.log('⚠️ Invalid video URL provided');
        return fallbackDuration;
    }
    
    console.log('🎯 Starting duration extraction for:', videoUrl);
    
    try {
        // Method 1: Try ffprobe (works for most direct video URLs)
        let duration = await extractDurationWithFFprobe(videoUrl);
        if (duration && duration > 0) {
            return Math.round(duration);
        }
        
        // Method 2: Try extracting from headers
        duration = await extractDurationFromHeaders(videoUrl);
        if (duration && duration > 0) {
            return Math.round(duration);
        }
        
        // Method 3: Estimate based on content (if available)
        // This would require additional API calls to get file info
        
        console.log('⚠️ Could not extract duration, using fallback:', fallbackDuration);
        return fallbackDuration;
        
    } catch (error) {
        console.error('❌ Duration extraction failed:', error);
        return fallbackDuration;
    }
}

/**
 * Extract duration for multiple videos in batch
 */
async function extractMultipleVideoDurations(videoUrls, concurrency = 3) {
    console.log(`🎬 Extracting durations for ${videoUrls.length} videos (concurrency: ${concurrency})`);
    
    const results = [];
    
    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < videoUrls.length; i += concurrency) {
        const batch = videoUrls.slice(i, i + concurrency);
        
        const batchPromises = batch.map(async (videoUrl, index) => {
            const globalIndex = i + index;
            console.log(`📹 Processing video ${globalIndex + 1}/${videoUrls.length}`);
            
            const duration = await extractVideoDuration(videoUrl);
            return { videoUrl, duration };
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Small delay between batches
        if (i + concurrency < videoUrls.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return results;
}

/**
 * Smart duration extraction with caching
 */
const durationCache = new Map();

async function extractVideoDurationWithCache(videoUrl, fallbackDuration = 300) {
    // Check cache first
    if (durationCache.has(videoUrl)) {
        console.log('📋 Using cached duration for:', videoUrl);
        return durationCache.get(videoUrl);
    }
    
    // Extract duration
    const duration = await extractVideoDuration(videoUrl, fallbackDuration);
    
    // Cache the result
    durationCache.set(videoUrl, duration);
    
    return duration;
}

module.exports = {
    extractVideoDuration,
    extractMultipleVideoDurations,
    extractVideoDurationWithCache,
    estimateDurationFromSize
};
