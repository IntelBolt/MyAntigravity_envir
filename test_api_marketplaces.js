
const fetch = require('node-fetch');

async function testMarketplaceApi() {
    try {
        const response = await fetch('http://localhost:3000/api/marketplaces?clientId=10234');
        if (!response.ok) {
            console.log('Local server is likely not running. Checking DB directly instead.');
            return;
        }
        const data = await response.json();
        console.log('--- Summary ---');
        console.table(data.summary);
        console.log('\n--- Platform Breakdown ---');
        console.table(data.platformBreakdown);
        console.log('\n--- Available Platforms ---');
        console.log(data.availablePlatforms);
    } catch (err) {
        console.log('Error connecting to local server. This is expected if "npm run dev" is not active.');
    }
}

testMarketplaceApi();
