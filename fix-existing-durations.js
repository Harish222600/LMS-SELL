const mongoose = require('mongoose');
const SubSection = require('./backend/models/subSection');
const { extractVideoMetadata } = require('./backend/utils/videoUtils');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/your-database-name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function fixExistingDurations() {
    try {
        console.log('🔍 Checking existing SubSections...');
        
        // Find all subsections with videos but zero duration
        const subsectionsWithVideos = await SubSection.find({
            videoUrl: { $exists: true, $ne: null, $ne: '' },
            $or: [
                { timeDuration: { $exists: false } },
                { timeDuration: 0 },
                { timeDuration: null }
            ]
        });

        console.log(`Found ${subsectionsWithVideos.length} subsections with videos but no duration`);

        for (let subsection of subsectionsWithVideos) {
            console.log(`\n📹 Processing: ${subsection.title}`);
            console.log(`Video URL: ${subsection.videoUrl}`);
            console.log(`Current duration: ${subsection.timeDuration}`);

            // For now, just log what we found
            // In a real scenario, you might want to:
            // 1. Download the video and extract duration
            // 2. Or set a default duration
            // 3. Or prompt user for manual input

            // Example: Set a default duration of 300 seconds (5 minutes) for testing
            // subsection.timeDuration = 300;
            // await subsection.save();
            // console.log('✅ Updated duration to 300 seconds');
        }

        console.log('\n📊 Summary:');
        console.log(`Total subsections checked: ${subsectionsWithVideos.length}`);
        
        // Also check what durations we do have
        const subsectionsWithDuration = await SubSection.find({
            timeDuration: { $gt: 0 }
        });
        
        console.log(`Subsections with valid duration: ${subsectionsWithDuration.length}`);
        
        if (subsectionsWithDuration.length > 0) {
            console.log('Sample durations:');
            subsectionsWithDuration.slice(0, 5).forEach(sub => {
                console.log(`- ${sub.title}: ${sub.timeDuration} seconds`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the check
fixExistingDurations();
