/**
 * Customer Table Integration with Existing Dashboard
 * Connects the enhanced table with the current data pipeline
 */

class CustomerTableIntegration {
    constructor() {
        this.customerTable = null;
        this.dataCache = null;
        this.isInitialized = false;
        
        // Bind methods
        this.handleDataRefresh = this.handleDataRefresh.bind(this);
        this.processRawData = this.processRawData.bind(this);
    }
    
    /**
     * Initialize the customer table integration
     */
    async init(containerId = 'customer-table-container') {
        try {
            // Create container if it doesn't exist
            let container = document.getElementById(containerId);
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                container.className = 'customer-table-integration';
                
                // Find a suitable parent element
                const mainContent = document.querySelector('.main-content') || 
                                  document.querySelector('.dashboard-content') || 
                                  document.body;
                mainContent.appendChild(container);
            }
            
            // Initialize the customer table
            this.customerTable = new CustomerTable(containerId, {
                pageSize: 25,
                enablePagination: true,
                enableFiltering: true,
                enableSorting: true,
                persistState: true,
                onRefresh: this.handleDataRefresh
            });
            
            // Load initial data
            await this.loadData();
            
            this.isInitialized = true;
            console.log('✅ Customer Table Integration initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Customer Table Integration:', error);
            throw error;
        }
    }
    
    /**
     * Load data from the existing dashboard API
     */
    async loadData() {
        try {
            // Check if DashboardAPI exists (from existing system)
            if (window.DashboardAPI && typeof window.DashboardAPI.getData === 'function') {
                console.log('📡 Loading data from existing DashboardAPI...');
                const rawData = await window.DashboardAPI.getData(true);
                const processedData = this.processRawData(rawData);
                this.customerTable.setData(processedData);
                this.dataCache = processedData;
                
            } else if (window.fetch) {
                // Fallback to direct API call
                console.log('📡 Loading data from API endpoint...');
                const response = await fetch('/api/sheets-data');
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                const processedData = this.processGoogleSheetsData(data);
                this.customerTable.setData(processedData);
                this.dataCache = processedData;
                
            } else {
                // Use static data as fallback
                console.log('📄 Loading static data...');
                const staticData = await this.loadStaticData();
                this.customerTable.setData(staticData);
                this.dataCache = staticData;
            }
            
        } catch (error) {
            console.error('❌ Failed to load data:', error);
            
            // Show error state in table
            this.customerTable.setData([]);
            this.showError(error.message);
        }
    }
    
    /**
     * Process raw data from existing dashboard system
     */
    processRawData(rawData) {
        if (!Array.isArray(rawData)) {
            console.warn('Raw data is not an array, attempting to extract...');
            rawData = rawData.data || rawData.values || [];
        }
        
        return rawData.map((item, index) => {
            // Handle different data structures
            const companyName = item.companyName || 
                              item['Please provide your company name'] || 
                              item['فضلًا، أدخل اسم الشركة'] || 
                              '';
            
            const accountManager = item.accountManager || 
                                 item['Name of designated account manager: '] || 
                                 item['اسم مدير الحساب المعيّن'] || 
                                 '';
            
            const serviceType = item.serviceType || 
                              item['Service Type'] || 
                              item['نوع الخدمة'] || 
                              '';
            
            const submittedAt = item.submittedAt || 
                              item['Submitted At'] || 
                              item.completionDate || 
                              '';
            
            // Extract NPS and satisfaction scores
            const npsScore = this.extractScore(item, [
                'How likely are you to recommend Starlinks to other businesses',
                'ما مدى احتمالية أن تنصح الآخرين بخدمات ستارلينكس؟'
            ]);
            
            const satisfactionScore = this.extractScore(item, [
                'How satisfied are you with the overall experience with Starlinks',
                'ما مدى رضاك عن تجربتك العامة مع ستارلينكس؟'
            ]);
            
            return {
                id: item.id || `row-${index}`,
                customerName: this.sanitizeUTF8(companyName),
                accountManager: this.sanitizeUTF8(accountManager),
                serviceType: this.sanitizeUTF8(serviceType),
                completionDate: submittedAt,
                npsScore: npsScore,
                satisfactionScore: satisfactionScore,
                status: 'Completed',
                quarter: this.determineQuarter(submittedAt),
                rawData: item
            };
        }).filter(item => item.customerName || item.accountManager); // Filter out empty rows
    }
    
    /**
     * Process Google Sheets API response
     */
    processGoogleSheetsData(sheetsResponse) {
        const values = sheetsResponse.values || [];
        if (values.length === 0) return [];
        
        const headers = values[0];
        const rows = values.slice(1);
        
        return rows.map((row, index) => {
            const rowData = {};
            headers.forEach((header, i) => {
                rowData[header] = row[i] || '';
            });
            
            return this.processRawData([rowData])[0];
        }).filter(Boolean);
    }
    
    /**
     * Extract score from various possible column names
     */
    extractScore(item, possibleKeys) {
        for (const key of possibleKeys) {
            if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
                const score = parseInt(item[key]);
                return isNaN(score) ? null : score;
            }
        }
        return null;
    }
    
    /**
     * Determine quarter from date
     */
    determineQuarter(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            
            let quarter;
            if (month <= 3) quarter = 'Q1';
            else if (month <= 6) quarter = 'Q2';
            else if (month <= 9) quarter = 'Q3';
            else quarter = 'Q4';
            
            return `${quarter} ${year}`;
        } catch (e) {
            return '';
        }
    }
    
    /**
     * Sanitize UTF-8 text (same as in CustomerTable)
     */
    sanitizeUTF8(value) {
        if (!value) return '';
        
        let cleaned = String(value).trim();
        
        // Fix common mojibake patterns for Arabic text
        const mojibakePatterns = [
            { pattern: /Ø³Ø§ÙƒÙˆ/g, replacement: 'ساكو' },
            { pattern: /Ø¹Ø¨Ø¯Ø§Ù„Ù„Ù‡/g, replacement: 'عبدالله' },
            { pattern: /Ø£Ø­Ù…Ø¯/g, replacement: 'أحمد' },
            { pattern: /Ø¥Ø¨Ø±Ø§Ù‡ÙŠÙ…/g, replacement: 'إبراهيم' },
            { pattern: /Ø§Ù„Ø¯Ø®ÙŠÙ„/g, replacement: 'الدخيل' },
            { pattern: /Ø´Ø§ÙƒØ±Ø§/g, replacement: 'شاكرا' }
        ];
        
        mojibakePatterns.forEach(({ pattern, replacement }) => {
            cleaned = cleaned.replace(pattern, replacement);
        });
        
        return cleaned;
    }
    
    /**
     * Handle data refresh requests
     */
    async handleDataRefresh() {
        console.log('🔄 Refreshing customer table data...');
        
        try {
            // Clear cache if using DashboardAPI
            if (window.dataCache) {
                window.dataCache.data = null;
                window.dataCache.timestamp = null;
            }
            
            await this.loadData();
            console.log('✅ Data refreshed successfully');
            
        } catch (error) {
            console.error('❌ Failed to refresh data:', error);
            this.showError('Failed to refresh data. Please try again.');
        }
    }
    
    /**
     * Load static data as fallback
     */
    async loadStaticData() {
        try {
            const response = await fetch('./complete_data.json');
            const data = await response.json();
            return this.processGoogleSheetsData(data);
        } catch (error) {
            console.warn('Could not load static data:', error);
            return this.generateSampleData();
        }
    }
    
    /**
     * Generate sample data for demonstration
     */
    generateSampleData() {
        return [
            {
                id: 'sample-1',
                customerName: 'ساكو',
                accountManager: 'إبراهيم فضالي',
                serviceType: 'شحن فقط',
                completionDate: '2025-06-30T12:34:28',
                npsScore: 2,
                satisfactionScore: 2,
                status: 'Completed',
                quarter: 'Q2 2025'
            },
            {
                id: 'sample-2',
                customerName: 'Noon',
                accountManager: 'Ibrahim Fadaly',
                serviceType: 'Fulfilment Only',
                completionDate: '2025-07-10T08:58:25',
                npsScore: 9,
                satisfactionScore: 5,
                status: 'Completed',
                quarter: 'Q3 2025'
            },
            {
                id: 'sample-3',
                customerName: 'Amazon',
                accountManager: 'Ahmed Saleem',
                serviceType: 'Last Mile Only',
                completionDate: '2025-07-08T11:04:47',
                npsScore: 10,
                satisfactionScore: 5,
                status: 'Completed',
                quarter: 'Q3 2025'
            },
            {
                id: 'sample-4',
                customerName: 'الدخيل للعود',
                accountManager: 'عبدالله احمد',
                serviceType: 'شحن فقط',
                completionDate: '2025-07-02T07:21:47',
                npsScore: 5,
                satisfactionScore: 4,
                status: 'Completed',
                quarter: 'Q3 2025'
            },
            {
                id: 'sample-5',
                customerName: 'Homzmart',
                accountManager: 'Ahmed Saleem',
                serviceType: 'Last Mile & Fulfilment',
                completionDate: '2025-06-26T10:15:56',
                npsScore: 8,
                satisfactionScore: 4,
                status: 'Completed',
                quarter: 'Q2 2025'
            }
        ];
    }
    
    /**
     * Show error message
     */
    showError(message) {
        const container = document.getElementById(this.customerTable?.containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-content">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error Loading Data</h3>
                        <p>${message}</p>
                        <button class="btn-primary" onclick="customerTableIntegration.handleDataRefresh()">
                            <i class="fas fa-retry"></i>
                            Try Again
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Get current data
     */
    getData() {
        return this.dataCache || [];
    }
    
    /**
     * Update data programmatically
     */
    updateData(newData) {
        if (this.customerTable) {
            const processedData = this.processRawData(newData);
            this.customerTable.setData(processedData);
            this.dataCache = processedData;
        }
    }
    
    /**
     * Destroy the integration
     */
    destroy() {
        if (this.customerTable) {
            this.customerTable.destroy();
            this.customerTable = null;
        }
        
        this.dataCache = null;
        this.isInitialized = false;
    }
}

// Create global instance
window.CustomerTableIntegration = CustomerTableIntegration;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not already done
    if (!window.customerTableIntegration) {
        window.customerTableIntegration = new CustomerTableIntegration();
        
        // Initialize after a short delay to ensure other scripts are loaded
        setTimeout(() => {
            if (document.getElementById('customer-table-container') || 
                document.querySelector('.customer-table-integration')) {
                window.customerTableIntegration.init().catch(console.error);
            }
        }, 1000);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomerTableIntegration;
}