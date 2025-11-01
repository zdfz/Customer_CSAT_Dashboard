// Force refresh data with clean UTF-8 encoding
// Copy and paste this into browser console

console.log('🔄 Forcing fresh data fetch with UTF-8 encoding...');

async function refreshWithUTF8() {
    try {
        // Clear any remaining cache
        if (window.dataCache) {
            window.dataCache.data = null;
            window.dataCache.timestamp = null;
        }
        
        // Force fresh fetch
        console.log('📡 Fetching fresh data...');
        const freshData = await window.DashboardAPI.getData(true);
        
        console.log('✅ Fresh data received:', freshData.length, 'records');
        
        // Check for proper Arabic text
        const arabicSamples = freshData
            .filter(item => item.companyName && /[\u0600-\u06FF]/.test(item.companyName))
            .slice(0, 5)
            .map(item => ({
                name: item.companyName,
                isClean: !/[ÃØÙ]/.test(item.companyName)
            }));
            
        console.log('🔍 Arabic text samples:', arabicSamples);
        
        // Force Customer Status refresh
        if (window.customerStatusManager) {
            console.log('🔄 Refreshing Customer Status UI...');
            await window.customerStatusManager.updateCustomerStatus(freshData);
            console.log('✅ Customer Status refreshed');
        }
        
        // Check if Arabic is now displaying correctly
        const cleanArabic = arabicSamples.filter(s => s.isClean).length;
        const totalArabic = arabicSamples.length;
        
        console.log(`📊 Results: ${cleanArabic}/${totalArabic} Arabic names are clean`);
        
        if (cleanArabic === totalArabic && totalArabic > 0) {
            console.log('🎉 SUCCESS! Arabic text is now displaying correctly!');
        } else if (totalArabic === 0) {
            console.log('ℹ️ No Arabic text found in current data');
        } else {
            console.log('⚠️ Some Arabic text still has encoding issues');
        }
        
        return { success: cleanArabic === totalArabic, cleanArabic, totalArabic };
        
    } catch (error) {
        console.error('❌ Error during refresh:', error);
        return { success: false, error: error.message };
    }
}

// Run the refresh
refreshWithUTF8().then(result => {
    if (result.success) {
        console.log('🎉 UTF-8 encoding fix completed successfully!');
    } else {
        console.log('⚠️ Additional troubleshooting may be needed');
    }
});