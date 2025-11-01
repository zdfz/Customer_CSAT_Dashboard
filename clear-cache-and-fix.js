// JavaScript snippet to clear cache and verify UTF-8 encoding
// Run this in the browser console after fixing the sanitizeString function

console.log('🔧 Starting UTF-8 encoding fix and cache clear...');

// Step 1: Clear all caches
try {
    // Clear data cache if available
    if (window.dataCache) {
        window.dataCache.data = null;
        window.dataCache.timestamp = null;
        window.dataCache.isLoading = false;
        window.dataCache.retryCount = 0;
        console.log('✅ Cleared window.dataCache');
    }
    
    // Clear DashboardAPI cache if available
    if (window.DashboardAPI && window.DashboardAPI.clearCache) {
        window.DashboardAPI.clearCache();
        console.log('✅ Cleared DashboardAPI cache');
    }
    
    // Clear any other caches
    if (window.cacheManager && window.cacheManager.clearCache) {
        window.cacheManager.clearCache();
        console.log('✅ Cleared cacheManager cache');
    }
    
    console.log('✅ All caches cleared');
} catch (error) {
    console.log('⚠️ Cache clearing error (may be normal):', error.message);
}

// Step 2: Force fresh data fetch
console.log('🔄 Forcing fresh data fetch...');

async function testUTF8Encoding() {
    try {
        // Force fresh fetch
        const freshData = await window.DashboardAPI.getData(true);
        
        console.log('📊 Fresh data received, checking encoding...');
        
        // Check for Arabic text in the data
        const arabicSamples = [];
        freshData.slice(0, 10).forEach((item, index) => {
            if (item.companyName && /[\u0600-\u06FF]/.test(item.companyName)) {
                arabicSamples.push({
                    index,
                    companyName: item.companyName,
                    isProperArabic: !/[ÃØÙ]/.test(item.companyName) // Check for mojibake patterns
                });
            }
        });
        
        console.log('🔍 Arabic text samples found:', arabicSamples);
        
        if (arabicSamples.length > 0) {
            const properArabic = arabicSamples.filter(s => s.isProperArabic);
            const mojibake = arabicSamples.filter(s => !s.isProperArabic);
            
            console.log(`✅ Proper Arabic text: ${properArabic.length} samples`);
            console.log(`❌ Mojibake detected: ${mojibake.length} samples`);
            
            if (mojibake.length > 0) {
                console.log('🚨 Mojibake examples:', mojibake.map(s => s.companyName));
            }
        }
        
        // Trigger UI refresh
        if (window.customerStatusManager) {
            await window.customerStatusManager.updateCustomerStatus(freshData);
            console.log('✅ Customer Status UI refreshed');
        }
        
        return arabicSamples;
        
    } catch (error) {
        console.error('❌ Error during UTF-8 test:', error);
        return null;
    }
}

// Step 3: Test network request directly
async function testNetworkUTF8() {
    console.log('🌐 Testing network request directly...');
    
    try {
        const response = await fetch('/api/sheets-data');
        
        console.log('📡 Response headers:');
        for (const [key, value] of response.headers.entries()) {
            console.log(`  ${key}: ${value}`);
        }
        
        const contentType = response.headers.get('content-type');
        const hasUTF8 = contentType && contentType.includes('charset=utf-8');
        
        console.log(`✅ UTF-8 charset in headers: ${hasUTF8 ? 'YES' : 'NO'}`);
        
        if (!hasUTF8) {
            console.log('🚨 Missing UTF-8 charset in Content-Type header!');
        }
        
        const data = await response.json();
        console.log('📊 Raw API response sample:', data.values?.slice(0, 3));
        
        return { hasUTF8, data };
        
    } catch (error) {
        console.error('❌ Network test error:', error);
        return null;
    }
}

// Run the tests
(async () => {
    console.log('🚀 Running UTF-8 encoding diagnostics...');
    
    const networkTest = await testNetworkUTF8();
    const encodingTest = await testUTF8Encoding();
    
    console.log('📋 Summary:');
    console.log('- Network UTF-8 headers:', networkTest?.hasUTF8 ? '✅' : '❌');
    console.log('- Arabic text samples:', encodingTest?.length || 0);
    console.log('- Proper Arabic rendering:', encodingTest?.filter(s => s.isProperArabic).length || 0);
    
    if (networkTest?.hasUTF8 && encodingTest?.every(s => s.isProperArabic)) {
        console.log('🎉 UTF-8 encoding is working correctly!');
    } else {
        console.log('⚠️ UTF-8 encoding issues detected. Check the manual fixes needed.');
    }
})();