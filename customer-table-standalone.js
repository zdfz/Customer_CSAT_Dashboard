/**
 * Standalone Customer Table Integration
 * Can be added to existing HTML pages
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page that should have the customer table
    const targetContainer = document.getElementById('customer-status-tables') || 
                           document.getElementById('customer-table-container');
    
    if (!targetContainer) {
        console.log('No customer table container found, skipping initialization');
        return;
    }
    
    // Create enhanced table container
    const enhancedContainer = document.createElement('div');
    enhancedContainer.id = 'enhanced-customer-table';
    enhancedContainer.className = 'enhanced-customer-table-wrapper';
    
    // Add some basic styling
    enhancedContainer.style.cssText = `
        margin: 24px 0;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    `;
    
    // Insert the enhanced table after the existing tables
    targetContainer.parentNode.insertBefore(enhancedContainer, targetContainer.nextSibling);
    
    // Initialize the customer table
    initializeEnhancedCustomerTable();
    
    async function initializeEnhancedCustomerTable() {
        try {
            console.log('🚀 Initializing Enhanced Customer Table...');
            
            // Check if CustomerTable class is available
            if (typeof CustomerTable === 'undefined') {
                throw new Error('CustomerTable class not found. Please include customer-table.js');
            }
            
            // Check if CustomerTableIntegration class is available
            if (typeof CustomerTableIntegration === 'undefined') {
                throw new Error('CustomerTableIntegration class not found. Please include customer-table-integration.js');
            }
            
            // Create and initialize the integration
            const integration = new CustomerTableIntegration();
            await integration.init('enhanced-customer-table');
            
            console.log('✅ Enhanced Customer Table initialized successfully');
            
            // Make it globally available
            window.enhancedCustomerTable = integration;
            
            // Add a header to distinguish it from the original tables
            const header = document.createElement('div');
            header.style.cssText = `
                background: linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%);
                padding: 24px;
                border-bottom: 1px solid #A7F3D0;
                text-align: center;
            `;
            header.innerHTML = `
                <h2 style="
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0 0 8px 0;
                ">Enhanced Customer Survey Table</h2>
                <p style="
                    color: #5F726D;
                    margin: 0;
                    font-size: 0.875rem;
                ">Advanced filtering, sorting, and Arabic text support</p>
            `;
            
            enhancedContainer.insertBefore(header, enhancedContainer.firstChild);
            
        } catch (error) {
            console.error('❌ Failed to initialize Enhanced Customer Table:', error);
            
            // Show error message
            enhancedContainer.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 64px;
                    text-align: center;
                ">
                    <div>
                        <div style="
                            font-size: 3rem;
                            color: #EF4444;
                            margin-bottom: 16px;
                        ">⚠️</div>
                        <h3 style="
                            font-size: 1.25rem;
                            font-weight: 600;
                            color: #2F4942;
                            margin: 0 0 8px 0;
                        ">Initialization Error</h3>
                        <p style="
                            color: #5F726D;
                            margin: 0 0 16px 0;
                            font-size: 0.875rem;
                        ">${error.message}</p>
                        <button onclick="location.reload()" style="
                            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 12px;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 0.875rem;
                        ">
                            🔄 Reload Page
                        </button>
                    </div>
                </div>
            `;
        }
    }
});

// Export for debugging
if (typeof window !== 'undefined') {
    window.CustomerTableStandalone = true;
}