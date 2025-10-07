const axios = require('axios');

// Test script to call the duration fix API
async function testDurationFix() {
    try {
        console.log('🔍 Checking current duration status...');
        
        // First, check the current status
        const statusResponse = await axios.get('http://localhost:5001/api/v1/fix/check-durations', {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJlZWphaW5ub3ZhdGl2ZXZlbnR1cmVzQGdtYWlsLmNvbSIsImlkIjoiNjhkZmMxYmQ1ZTcyYzExNTU5ZGRmYmE4IiwiYWNjb3VudFR5cGUiOiJBZG1pbiIsImlhdCI6MTc1OTg0NTA5NywiZXhwIjoxNzU5OTMxNDk3fQ.v1WdKF7fTl2M_vDaplgFMZ2GSvzbo45LA32RBSjPrTs'
            }
        });
        
        console.log('📊 Current Status:', statusResponse.data);
        
        if (statusResponse.data.data.needingFix > 0) {
            console.log(`\n🔧 Found ${statusResponse.data.data.needingFix} videos that need duration fixes`);
            console.log('🎬 Starting duration extraction...');
            
            // Call the fix API
            const fixResponse = await axios.post('http://localhost:5001/api/v1/fix/fix-durations', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJlZWphaW5ub3ZhdGl2ZXZlbnR1cmVzQGdtYWlsLmNvbSIsImlkIjoiNjhkZmMxYmQ1ZTcyYzExNTU5ZGRmYmE4IiwiYWNjb3VudFR5cGUiOiJBZG1pbiIsImlhdCI6MTc1OTg0NTA5NywiZXhwIjoxNzU5OTMxNDk3fQ.v1WdKF7fTl2M_vDaplgFMZ2GSvzbo45LA32RBSjPrTs'
                },
                timeout: 60000 // 1 minute timeout
            });
            
            console.log('✅ Duration extraction completed!');
            console.log('📊 Results:', fixResponse.data);
            
        } else {
            console.log('✅ No videos need duration fixes');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Run the test
testDurationFix();
