/**
 * Script to add the enhanced customer table to the existing dashboard
 * This script will be loaded after the main page loads
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the main dashboard to initialize
    setTimeout(initializeEnhancedTable, 2000);
});

function initializeEnhancedTable() {
    try {
        console.log('🚀 Adding Enhanced Customer Table to Dashboard...');
        
        // Find the customer status section
        const customerStatusSection = document.getElementById('customer-status-panel');
        if (!customerStatusSection) {
            console.warn('Customer status panel not found, trying alternative locations...');
            return tryAlternativeLocations();
        }
        
        // Create the enhanced table container
        const enhancedTableSection = document.createElement('div');
        enhancedTableSection.id = 'enhanced-customer-table-section';
        enhancedTableSection.className = 'full-width-section';
        enhancedTableSection.style.cssText = `
            margin-top: 48px;
            padding: 0 24px;
        `;
        
        // Create the table container
        const tableContainer = document.createElement('div');
        tableContainer.id = 'enhanced-customer-table-container';
        enhancedTableSection.appendChild(tableContainer);
        
        // Find the content grid and add our section
        const contentGrid = customerStatusSection.querySelector('.content-grid');
        if (contentGrid) {
            contentGrid.appendChild(enhancedTableSection);
        } else {
            customerStatusSection.appendChild(enhancedTableSection);
        }
        
        // Initialize the enhanced customer table
        initializeCustomerTableIntegration();
        
    } catch (error) {
        console.error('❌ Failed to add enhanced table:', error);
    }
}

function tryAlternativeLocations() {
    // Try to find customer status tables
    const customerTables = document.getElementById('customer-status-tables');
    if (customerTables) {
        const enhancedSection = document.createElement('div');
        enhancedSection.id = 'enhanced-customer-table-section';
        enhancedSection.style.cssText = `
            margin-top: 48px;
            grid-column: 1 / -1;
        `;
        
        const tableContainer = document.createElement('div');
        tableContainer.id = 'enhanced-customer-table-container';
        enhancedSection.appendChild(tableContainer);
        
        customerTables.parentNode.insertBefore(enhancedSection, customerTables.nextSibling);
        
        initializeCustomerTableIntegration();
        return;
    }
    
    // Last resort: add to body
    const body = document.body;
    const enhancedSection = document.createElement('div');
    enhancedSection.id = 'enhanced-customer-table-section';
    enhancedSection.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 400px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 1000;
        padding: 20px;
    `;
    
    enhancedSection.innerHTML = `
        <div style="text-align: center; margin-bottom: 16px;">
            <h3 style="margin: 0 0 8px 0; color: #10B981;">Enhanced Table Available</h3>
            <p style="margin: 0; font-size: 0.875rem; color: #666;">
                Click to open the enhanced customer table
            </p>
            <button id="open-enhanced-table" style="
                margin-top: 12px;
                background: #10B981;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            ">Open Enhanced Table</button>
        </div>
    `;
    
    body.appendChild(enhancedSection);
    
    document.getElementById('open-enhanced-table').addEventListener('click', function() {
        window.open('enhanced-table-demo.html', '_blank');
    });
}

async function initializeCustomerTableIntegration() {
    try {
        // Check if required classes are available
        if (typeof CustomerTable === 'undefined') {
            console.warn('CustomerTable class not found, loading script...');
            await loadScript('customer-table.js');
        }
        
        if (typeof CustomerTableIntegration === 'undefined') {
            console.warn('CustomerTableIntegration class not found, loading script...');
            await loadScript('customer-table-integration.js');
        }
        
        // Initialize the integration
        const integration = new CustomerTableIntegration();
        await integration.init('enhanced-customer-table-container');
        
        console.log('✅ Enhanced Customer Table integrated successfully');
        
        // Make it globally available
        window.enhancedCustomerTable = integration;
        
        // Add header
        addEnhancedTableHeader();
        
    } catch (error) {
        console.error('❌ Failed to initialize customer table integration:', error);
        showEnhancedTableError(error);
    }
}

function addEnhancedTableHeader() {
    const container = document.getElementById('enhanced-customer-table-container');
    if (!container) return;
    
    const header = document.createElement('div');
    header.style.cssText = `
        background: linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%);
        padding: 24px;
        border-radius: 16px 16px 0 0;
        border: 1px solid #A7F3D0;
        border-bottom: none;
        text-align: center;
        margin-bottom: 0;
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
            font-family: 'Euclid Circular B', system-ui, sans-serif;
        ">🚀 Enhanced Customer Survey Table</h2>
        <p style="
            color: #5F726D;
            margin: 0;
            font-size: 0.875rem;
            line-height: 1.5;
        ">Advanced filtering by Account Manager • Sortable columns • Full Arabic text support • Responsive design</p>
        <div style="
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 12px;
            font-size: 0.75rem;
            color: #10B981;
        ">
            <span>✓ Multi-select filters</span>
            <span>✓ Keyboard navigation</span>
            <span>✓ Persistent state</span>
        </div>
    `;
    
    container.parentNode.insertBefore(header, container);
}

function showEnhancedTableError(error) {
    const container = document.getElementById('enhanced-customer-table-container');
    if (!container) return;
    
    container.innerHTML = `
        <div style="
            background: white;
            border: 1px solid #FEE2E2;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            color: #DC2626;
        ">
            <div style="font-size: 2rem; margin-bottom: 16px;">⚠️</div>
            <h3 style="margin: 0 0 8px 0; font-size: 1.125rem;">Enhanced Table Error</h3>
            <p style="margin: 0 0 16px 0; font-size: 0.875rem; color: #666;">
                ${error.message}
            </p>
            <button onclick="location.reload()" style="
                background: #DC2626;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.875rem;
            ">Reload Page</button>
        </div>
    `;
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Export for debugging
if (typeof window !== 'undefined') {
    window.addEnhancedTable = {
        initialize: initializeEnhancedTable,
        loadScript: loadScript
    };
}