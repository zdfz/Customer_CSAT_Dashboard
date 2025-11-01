/**
 * Patch script to add Enhanced Customer Table to index.html
 * This script modifies the existing HTML to include the enhanced table
 */

(function() {
    'use strict';
    
    console.log('🔧 Applying Enhanced Customer Table patch to index.html...');
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(applyPatch, 1000);
    });
    
    function applyPatch() {
        try {
            // 1. Add CSS if not already present
            addCustomerTableCSS();
            
            // 2. Find the customer status section and add enhanced table
            addEnhancedTableSection();
            
            // 3. Initialize the enhanced table
            initializeEnhancedTable();
            
            console.log('✅ Enhanced Customer Table patch applied successfully');
            
        } catch (error) {
            console.error('❌ Failed to apply patch:', error);
        }
    }
    
    function addCustomerTableCSS() {
        // Check if CSS is already loaded
        const existingCSS = document.querySelector('link[href*="customer-table.css"]');
        if (existingCSS) {
            console.log('ℹ️ Customer table CSS already loaded');
            return;
        }
        
        // Create and add CSS link
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'customer-table.css';
        cssLink.onload = () => console.log('✅ Customer table CSS loaded');
        cssLink.onerror = () => console.error('❌ Failed to load customer table CSS');
        
        document.head.appendChild(cssLink);
    }
    
    function addEnhancedTableSection() {
        // Find the customer status panel
        const customerStatusPanel = document.getElementById('customer-status-panel');
        if (!customerStatusPanel) {
            console.warn('Customer status panel not found, trying alternative approach...');
            return addEnhancedTableAlternative();
        }
        
        // Find the content grid within the panel
        const contentGrid = customerStatusPanel.querySelector('.content-grid');
        if (!contentGrid) {
            console.warn('Content grid not found, adding to panel directly');
            return addToPanel(customerStatusPanel);
        }
        
        // Create the enhanced table section
        const enhancedSection = createEnhancedTableSection();
        
        // Add it to the content grid
        contentGrid.appendChild(enhancedSection);
        
        console.log('✅ Enhanced table section added to customer status panel');
    }
    
    function addEnhancedTableAlternative() {
        // Try to find customer status tables
        const customerTables = document.getElementById('customer-status-tables');
        if (customerTables) {
            const enhancedSection = createEnhancedTableSection();
            enhancedSection.style.gridColumn = '1 / -1';
            enhancedSection.style.marginTop = '48px';
            
            // Insert after the existing tables
            customerTables.parentNode.insertBefore(enhancedSection, customerTables.nextSibling);
            console.log('✅ Enhanced table section added after customer status tables');
            return;
        }
        
        // Last resort: add to main content area
        const mainContent = document.querySelector('.main-content') || 
                           document.querySelector('.dashboard-content') || 
                           document.body;
        
        const enhancedSection = createEnhancedTableSection();
        enhancedSection.style.cssText += `
            position: relative;
            max-width: 1200px;
            margin: 40px auto;
            z-index: 1;
        `;
        
        mainContent.appendChild(enhancedSection);
        console.log('✅ Enhanced table section added to main content');
    }
    
    function addToPanel(panel) {
        const enhancedSection = createEnhancedTableSection();
        panel.appendChild(enhancedSection);
    }
    
    function createEnhancedTableSection() {
        const section = document.createElement('div');
        section.id = 'enhanced-customer-table-section';
        section.className = 'enhanced-table-section';
        section.style.cssText = `
            margin-top: 48px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #E6EFEA;
            overflow: hidden;
        `;
        
        // Add header
        const header = document.createElement('div');
        header.className = 'enhanced-table-header';
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
                font-family: 'Euclid Circular B', system-ui, sans-serif;
            ">🚀 Enhanced Customer Survey Table</h2>
            <p style="
                color: #5F726D;
                margin: 0 0 12px 0;
                font-size: 0.875rem;
                line-height: 1.5;
            ">Advanced filtering by Account Manager • Sortable columns • Full Arabic text support • Responsive design</p>
            <div style="
                display: flex;
                justify-content: center;
                gap: 16px;
                font-size: 0.75rem;
                color: #10B981;
                flex-wrap: wrap;
            ">
                <span>✓ Multi-select filters</span>
                <span>✓ Keyboard navigation</span>
                <span>✓ Persistent state</span>
                <span>✓ Arabic text support</span>
            </div>
        `;
        
        // Add table container
        const tableContainer = document.createElement('div');
        tableContainer.id = 'enhanced-customer-table-container';
        tableContainer.style.cssText = `
            padding: 0;
            min-height: 400px;
        `;
        
        section.appendChild(header);
        section.appendChild(tableContainer);
        
        return section;
    }
    
    async function initializeEnhancedTable() {
        try {
            // Load required scripts if not already loaded
            await loadRequiredScripts();
            
            // Wait a bit for scripts to initialize
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if classes are available
            if (typeof CustomerTable === 'undefined') {
                throw new Error('CustomerTable class not found after loading scripts');
            }
            
            if (typeof CustomerTableIntegration === 'undefined') {
                throw new Error('CustomerTableIntegration class not found after loading scripts');
            }
            
            // Initialize the integration
            const integration = new CustomerTableIntegration();
            await integration.init('enhanced-customer-table-container');
            
            // Make it globally available
            window.enhancedCustomerTable = integration;
            
            console.log('✅ Enhanced Customer Table initialized successfully');
            
            // Show success message
            showSuccessNotification();
            
        } catch (error) {
            console.error('❌ Failed to initialize enhanced table:', error);
            showErrorInTable(error);
        }
    }
    
    async function loadRequiredScripts() {
        const scripts = [
            'customer-table.js',
            'customer-table-integration.js'
        ];
        
        for (const scriptSrc of scripts) {
            // Check if script is already loaded
            const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
            if (existingScript) {
                console.log(`ℹ️ ${scriptSrc} already loaded`);
                continue;
            }
            
            // Load the script
            await loadScript(scriptSrc);
            console.log(`✅ ${scriptSrc} loaded`);
        }
    }
    
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }
    
    function showSuccessNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            font-family: system-ui, sans-serif;
            font-size: 0.875rem;
            font-weight: 600;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>🎉</span>
                <span>Enhanced Customer Table Ready!</span>
            </div>
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    function showErrorInTable(error) {
        const container = document.getElementById('enhanced-customer-table-container');
        if (!container) return;
        
        container.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 64px;
                text-align: center;
                background: #FEF2F2;
                border: 1px solid #FECACA;
                margin: 24px;
                border-radius: 12px;
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
                        color: #991B1B;
                        margin: 0 0 8px 0;
                    ">Enhanced Table Error</h3>
                    <p style="
                        color: #7F1D1D;
                        margin: 0 0 16px 0;
                        font-size: 0.875rem;
                        max-width: 400px;
                    ">${error.message}</p>
                    <button onclick="location.reload()" style="
                        background: #EF4444;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
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
    
})();