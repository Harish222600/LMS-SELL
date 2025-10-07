const SubSection = require('../models/subSection');
const { extractMultipleSmartDurations, updateSubSectionDurations } = require('../utils/simpleVideoDuration');

// Extract real durations for existing videos
exports.fixExistingDurations = async (req, res) => {
    try {
        console.log('🔧 Starting REAL duration extraction for existing lectures...');
        
        // Find all subsections with videos but zero or null duration
        const subsectionsToFix = await SubSection.find({
            videoUrl: { $exists: true, $ne: null, $ne: '' },
            $or: [
                { timeDuration: { $exists: false } },
                { timeDuration: 0 },
                { timeDuration: null },
                { timeDuration: '' }
            ]
        });

        console.log(`Found ${subsectionsToFix.length} subsections that need duration extraction`);

        if (subsectionsToFix.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No subsections need duration fixes',
                data: { totalFixed: 0, results: [] }
            });
        }

        // Prepare data for batch processing
        const videoData = subsectionsToFix.map(sub => ({
            id: sub._id,
            title: sub.title,
            videoUrl: sub.videoUrl
        }));

        // Extract durations using smart extraction
        console.log('🎬 Extracting real durations from video files...');
        const extractedDurations = await extractMultipleSmartDurations(videoData, 2);

        // Update database with extracted durations
        console.log('💾 Updating database with extracted durations...');
        const updateResults = await updateSubSectionDurations(extractedDurations);

        const successfulUpdates = updateResults.filter(r => r.success);
        const failedUpdates = updateResults.filter(r => !r.success);

        console.log(`\n🎉 Duration extraction complete!`);
        console.log(`✅ Successfully updated: ${successfulUpdates.length}`);
        console.log(`❌ Failed to update: ${failedUpdates.length}`);

        return res.status(200).json({
            success: true,
            message: `Successfully extracted and updated durations for ${successfulUpdates.length} lectures`,
            data: {
                totalProcessed: subsectionsToFix.length,
                totalFixed: successfulUpdates.length,
                totalFailed: failedUpdates.length,
                results: extractedDurations,
                updateResults: updateResults
            }
        });

    } catch (error) {
        console.error('Error extracting durations:', error);
        return res.status(500).json({
            success: false,
            message: 'Error extracting video durations',
            error: error.message
        });
    }
};

// Check current duration status
exports.checkDurationStatus = async (req, res) => {
    try {
        const totalSubSections = await SubSection.countDocuments();
        const withVideos = await SubSection.countDocuments({
            videoUrl: { $exists: true, $ne: null, $ne: '' }
        });
        const withValidDuration = await SubSection.countDocuments({
            timeDuration: { $gt: 0 }
        });
        const needingFix = await SubSection.countDocuments({
            videoUrl: { $exists: true, $ne: null, $ne: '' },
            $or: [
                { timeDuration: { $exists: false } },
                { timeDuration: 0 },
                { timeDuration: null }
            ]
        });

        // Get some sample data
        const sampleSubSections = await SubSection.find({}, 'title timeDuration videoUrl').limit(10);

        return res.status(200).json({
            success: true,
            data: {
                totalSubSections,
                withVideos,
                withValidDuration,
                needingFix,
                samples: sampleSubSections.map(sub => ({
                    title: sub.title,
                    timeDuration: sub.timeDuration,
                    hasVideo: !!sub.videoUrl
                }))
            }
        });

    } catch (error) {
        console.error('Error checking duration status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking duration status',
            error: error.message
        });
    }
};
