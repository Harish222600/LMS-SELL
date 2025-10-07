const axios = require('axios');

/**
 * Simple video duration extraction without external dependencies
 * Uses intelligent estimation and API-based methods
 */

/**
 * Extract video metadata from S3/Supabase URLs
 */
async function getVideoMetadata(videoUrl) {
    try {
        console.log('📡 Fetching video metadata for:', videoUrl);
        
        const response = await axios.head(videoUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'video/*'
            }
        });
        
        const contentLength = parseInt(response.headers['content-length']) || 0;
        const contentType = response.headers['content-type'] || '';
        const lastModified = response.headers['last-modified'];
        
        console.log('📊 Video metadata:', {
            size: contentLength ? `${(contentLength / (1024 * 1024)).toFixed(2)}MB` : 'Unknown',
            type: contentType,
            lastModified
        });
        
        return {
            size: contentLength,
            type: contentType,
            lastModified
        };
    } catch (error) {
        console.error('❌ Failed to fetch video metadata:', error.message);
        return null;
    }
}

/**
 * Intelligent duration estimation based on file size and type
 */
function estimateVideoDuration(fileSizeBytes, videoType = '') {
    if (!fileSizeBytes || fileSizeBytes <= 0) {
        console.log('⚠️ No file size available, using default duration');
        return 300; // 5 minutes default
    }
    
    // Different video types have different compression ratios
    let estimatedBitrate = 1000000; // 1 Mbps default
    
    if (videoType.includes('mp4')) {
        estimatedBitrate = 800000; // MP4 is well compressed
    } else if (videoType.includes('webm')) {
        estimatedBitrate = 600000; // WebM is very efficient
    } else if (videoType.includes('avi')) {
        estimatedBitrate = 1500000; // AVI is less compressed
    } else if (videoType.includes('mov')) {
        estimatedBitrate = 1200000; // MOV varies
    }
    
    // Calculate estimated duration: (file size in bits) / (bitrate)
    const estimatedSeconds = (fileSizeBytes * 8) / estimatedBitrate;
    
    // Apply reasonable bounds (30 seconds to 2 hours)
    const boundedDuration = Math.max(30, Math.min(7200, estimatedSeconds));
    
    console.log(`📏 Estimated duration: ${boundedDuration.toFixed(0)} seconds (${(boundedDuration / 60).toFixed(1)} minutes)`);
    
    return Math.round(boundedDuration);
}

/**
 * Smart duration extraction with multiple fallback methods
 */
async function extractSmartVideoDuration(videoUrl) {
    if (!videoUrl || typeof videoUrl !== 'string') {
        console.log('⚠️ Invalid video URL provided');
        return 300; // 5 minutes default
    }
    
    console.log('🎯 Starting smart duration extraction for:', videoUrl);
    
    try {
        // Method 1: Get video metadata
        const metadata = await getVideoMetadata(videoUrl);
        
        if (metadata && metadata.size > 0) {
            // Method 2: Estimate based on file size and type
            const estimatedDuration = estimateVideoDuration(metadata.size, metadata.type);
            
            if (estimatedDuration > 0) {
                console.log('✅ Duration estimated successfully:', estimatedDuration, 'seconds');
                return estimatedDuration;
            }
        }
        
        // Method 3: Fallback based on URL patterns
        const fallbackDuration = getFallbackDurationFromUrl(videoUrl);
        console.log('⚠️ Using fallback duration:', fallbackDuration, 'seconds');
        return fallbackDuration;
        
    } catch (error) {
        console.error('❌ Smart duration extraction failed:', error);
        return 300; // 5 minutes default
    }
}

/**
 * Get fallback duration based on URL patterns or naming conventions
 */
function getFallbackDurationFromUrl(videoUrl) {
    const url = videoUrl.toLowerCase();
    
    // Look for duration hints in filename
    if (url.includes('intro') || url.includes('welcome')) {
        return 120; // 2 minutes for intro videos
    } else if (url.includes('demo') || url.includes('example')) {
        return 600; // 10 minutes for demos
    } else if (url.includes('tutorial') || url.includes('lesson')) {
        return 900; // 15 minutes for tutorials
    } else if (url.includes('overview') || url.includes('summary')) {
        return 300; // 5 minutes for overviews
    } else if (url.includes('deep') || url.includes('advanced')) {
        return 1800; // 30 minutes for advanced content
    }
    
    // Default fallback
    return 420; // 7 minutes (reasonable average)
}

/**
 * Batch process multiple videos
 */
async function extractMultipleSmartDurations(videoData, concurrency = 2) {
    console.log(`🎬 Processing ${videoData.length} videos for duration extraction`);
    
    const results = [];
    
    // Process in small batches to be respectful to servers
    for (let i = 0; i < videoData.length; i += concurrency) {
        const batch = videoData.slice(i, i + concurrency);
        
        const batchPromises = batch.map(async (item) => {
            const { id, title, videoUrl } = item;
            console.log(`📹 Processing: ${title}`);
            
            const duration = await extractSmartVideoDuration(videoUrl);
            return { id, title, videoUrl, duration };
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Delay between batches
        if (i + concurrency < videoData.length) {
            console.log('⏳ Waiting before next batch...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    return results;
}

/**
 * Update subsection durations in database
 */
async function updateSubSectionDurations(subsectionData) {
    const SubSection = require('../models/subSection');
    
    console.log(`💾 Updating ${subsectionData.length} subsections with extracted durations`);
    
    const updatePromises = subsectionData.map(async (item) => {
        try {
            await SubSection.findByIdAndUpdate(
                item.id,
                { timeDuration: item.duration },
                { new: true }
            );
            console.log(`✅ Updated ${item.title}: ${item.duration} seconds`);
            return { success: true, id: item.id, duration: item.duration };
        } catch (error) {
            console.error(`❌ Failed to update ${item.title}:`, error.message);
            return { success: false, id: item.id, error: error.message };
        }
    });
    
    const results = await Promise.all(updatePromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`📊 Update complete: ${successful} successful, ${failed} failed`);
    
    return results;
}

module.exports = {
    extractSmartVideoDuration,
    extractMultipleSmartDurations,
    updateSubSectionDurations,
    getVideoMetadata,
    estimateVideoDuration
};
