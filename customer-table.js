/**
 * Enhanced Customer Table with Filtering, Sorting, and Accessibility
 * Supports Arabic text, responsive design, and persistent state
 */

class CustomerTable {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            throw new Error(`Container with ID "${containerId}" not found`);
        }
        
        // Configuration
        this.options = {
            pageSize: options.pageSize || 25,
            enablePagination: options.enablePagination !== false,
            enableFiltering: options.enableFiltering !== false,
            enableSorting: options.enableSorting !== false,
            persistState: options.persistState !== false,
            onRefresh: options.onRefresh || null,
            ...options
        };
        
        // State
        this.data = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.filters = {
            accountManager: []
        };
        
        // DOM elements
        this.tableElement = null;
        this.filterDropdowns = {};
        
        // Bind methods
        this.handleSort = this.handleSort.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the table
     */
    init() {
        this.loadState();
        this.render();
        this.attachEventListeners();
        
        console.log('✅ CustomerTable initialized');
    }
    
    /**
     * Set table data
     */
    setData(data) {
        this.data = Array.isArray(data) ? data : [];
        this.applyFiltersAndSort();
        this.render();
        
        console.log(`📊 Table data updated: ${this.data.length} records`);
    }
    
    /**
     * Render the complete table
     */
    render() {
        this.container.innerHTML = this.getTableHTML();
        this.attachEventListeners();
        this.updateFilterDropdowns();
    }
    
    /**
     * Generate complete table HTML
     */
    getTableHTML() {
        const stats = this.getTableStats();
        
        return `
            <div class="customer-table-wrapper">
                ${this.getTableHeaderHTML(stats)}
                <div class="table-container">
                    ${this.getTableBodyHTML()}
                </div>
                ${this.options.enablePagination ? this.getPaginationHTML() : ''}
            </div>
        `;
    }
    
    /**
     * Generate table header with stats and actions
     */
    getTableHeaderHTML(stats) {
        const activeFiltersCount = Object.values(this.filters).reduce((count, filter) => 
            count + (Array.isArray(filter) ? filter.length : (filter ? 1 : 0)), 0);
        
        return `
            <div class="table-header">
                <div class="table-title-section">
                    <h2 class="table-title">Customer Survey Data</h2>
                    <div class="table-stats">
                        <div class="stat-item">
                            <i class="fas fa-users"></i>
                            <span>${stats.total} Total Records</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-eye"></i>
                            <span>${stats.visible} Visible</span>
                        </div>
                        ${activeFiltersCount > 0 ? `
                            <div class="stat-item active-filters">
                                <i class="fas fa-filter"></i>
                                <span>${activeFiltersCount} Active Filter${activeFiltersCount !== 1 ? 's' : ''}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="table-actions">
                    <button class="btn-secondary" onclick="this.closest('.customer-table-wrapper').dispatchEvent(new CustomEvent('refresh'))" 
                            aria-label="Refresh table data">
                        <i class="fas fa-sync-alt"></i>
                        Refresh
                    </button>
                    ${activeFiltersCount > 0 ? `
                        <button class="btn-secondary" onclick="this.closest('.customer-table-wrapper').dispatchEvent(new CustomEvent('clearFilters'))"
                                aria-label="Clear all filters">
                            <i class="fas fa-times"></i>
                            Clear Filters
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate table body HTML
     */
    getTableBodyHTML() {
        if (this.filteredData.length === 0) {
            return this.getEmptyStateHTML();
        }
        
        const paginatedData = this.options.enablePagination ? this.getPaginatedData() : this.filteredData;
        
        return `
            <table class="customer-table" role="table" aria-label="Customer survey data">
                <thead>
                    <tr role="row">
                        ${this.getColumnHeaderHTML('customerName', 'Customer Name', true, false)}
                        ${this.getColumnHeaderHTML('accountManager', 'Account Manager', false, true)}
                        ${this.getColumnHeaderHTML('serviceType', 'Service Type', false, false)}
                        ${this.getColumnHeaderHTML('completionDate', 'Completion Date', true, false)}
                        ${this.getColumnHeaderHTML('npsScore', 'NPS Score', false, false)}
                        ${this.getColumnHeaderHTML('satisfactionScore', 'Satisfaction', false, false)}
                    </tr>
                </thead>
                <tbody>
                    ${paginatedData.map(row => this.getRowHTML(row)).join('')}
                </tbody>
            </table>
        `;
    }
    
    /**
     * Generate column header HTML
     */
    getColumnHeaderHTML(columnKey, label, sortable, filterable) {
        const isSorted = this.sortColumn === columnKey;
        const sortIcon = isSorted ? 
            (this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 
            'fa-sort';
        
        return `
            <th class="table-header-cell ${sortable ? 'sortable' : ''} ${isSorted ? 'sorted' : ''}"
                role="columnheader"
                ${sortable ? `aria-sort="${isSorted ? this.sortDirection + 'ending' : 'none'}"` : ''}
                ${sortable ? `tabindex="0"` : ''}
                data-column="${columnKey}">
                <div class="header-content">
                    <span class="header-label">${label}</span>
                    <div class="header-controls">
                        ${sortable ? `
                            <button class="sort-button" 
                                    aria-label="Sort by ${label} ${isSorted && this.sortDirection === 'asc' ? 'descending' : 'ascending'}"
                                    data-column="${columnKey}">
                                <i class="fas ${sortIcon}"></i>
                            </button>
                        ` : ''}
                        ${filterable ? `
                            <div class="filter-container">
                                <button class="filter-button ${this.filters[columnKey]?.length > 0 ? 'active' : ''}" 
                                        aria-label="Filter ${label}"
                                        aria-expanded="false"
                                        data-column="${columnKey}">
                                    <i class="fas fa-filter"></i>
                                </button>
                                ${this.getFilterDropdownHTML(columnKey, label)}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </th>
        `;
    }
    
    /**
     * Generate filter dropdown HTML
     */
    getFilterDropdownHTML(columnKey, label) {
        const uniqueValues = [...new Set(this.data.map(row => row[columnKey]).filter(Boolean))].sort();
        const selectedValues = this.filters[columnKey] || [];
        
        return `
            <div class="filter-dropdown" role="dialog" aria-labelledby="filter-${columnKey}-title">
                <div class="filter-dropdown-content">
                    <div class="filter-header">
                        <h3 id="filter-${columnKey}-title">Select ${label}</h3>
                        <button class="filter-close" aria-label="Close filter">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="filter-actions">
                        <button class="btn-link" data-action="clear">Clear</button>
                        <button class="btn-primary btn-sm" data-action="apply">Apply</button>
                    </div>
                    <div class="filter-options" role="listbox" aria-multiselectable="true">
                        ${uniqueValues.map(value => `
                            <label class="filter-option" role="option" aria-selected="${selectedValues.includes(value)}">
                                <input type="checkbox" 
                                       value="${this.escapeHtml(value)}" 
                                       ${selectedValues.includes(value) ? 'checked' : ''}
                                       data-column="${columnKey}">
                                <span class="checkmark"></span>
                                <span class="option-text">${this.sanitizeUTF8(value)}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate table row HTML
     */
    getRowHTML(row) {
        return `
            <tr class="table-row" role="row">
                <td class="customer-name" role="gridcell">${this.sanitizeUTF8(row.customerName || '')}</td>
                <td class="account-manager" role="gridcell">${this.sanitizeUTF8(row.accountManager || '')}</td>
                <td role="gridcell">
                    <span class="service-type">${this.sanitizeUTF8(row.serviceType || '')}</span>
                </td>
                <td class="completion-date" role="gridcell">${this.formatDate(row.completionDate)}</td>
                <td role="gridcell">
                    ${row.npsScore !== null && row.npsScore !== undefined ? 
                        `<span class="nps-score ${this.getNPSClass(row.npsScore)}">${row.npsScore}</span>` : 
                        '<span class="no-data">—</span>'
                    }
                </td>
                <td role="gridcell">
                    ${row.satisfactionScore !== null && row.satisfactionScore !== undefined ? 
                        `<span class="satisfaction-score">${row.satisfactionScore}/5</span>` : 
                        '<span class="no-data">—</span>'
                    }
                </td>
            </tr>
        `;
    }
    
    /**
     * Generate empty state HTML
     */
    getEmptyStateHTML() {
        const hasFilters = Object.values(this.filters).some(filter => 
            Array.isArray(filter) ? filter.length > 0 : Boolean(filter));
        
        return `
            <div class="empty-state">
                <div class="empty-content">
                    <i class="fas ${hasFilters ? 'fa-filter' : 'fa-table'}"></i>
                    <h3>${hasFilters ? 'No matching records' : 'No data available'}</h3>
                    <p>${hasFilters ? 'Try adjusting your filters to see more results.' : 'Data will appear here when available.'}</p>
                    ${hasFilters ? `
                        <button class="btn-primary" onclick="this.closest('.customer-table-wrapper').dispatchEvent(new CustomEvent('clearFilters'))">
                            Clear Filters
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate pagination HTML
     */
    getPaginationHTML() {
        const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
        
        if (totalPages <= 1) return '';
        
        const startRecord = (this.currentPage - 1) * this.options.pageSize + 1;
        const endRecord = Math.min(this.currentPage * this.options.pageSize, this.filteredData.length);
        
        return `
            <div class="pagination-container">
                <div class="pagination-info">
                    Showing ${startRecord}-${endRecord} of ${this.filteredData.length} records
                </div>
                <div class="pagination" role="navigation" aria-label="Table pagination">
                    ${this.getPaginationButtonsHTML(totalPages)}
                </div>
            </div>
        `;
    }
    
    /**
     * Generate pagination buttons HTML
     */
    getPaginationButtonsHTML(totalPages) {
        let buttons = [];
        
        // Previous button
        buttons.push(`
            <button class="pagination-btn" 
                    ${this.currentPage === 1 ? 'disabled' : ''} 
                    data-page="${this.currentPage - 1}"
                    aria-label="Previous page">
                <i class="fas fa-chevron-left"></i>
            </button>
        `);
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            buttons.push(`<button class="pagination-btn" data-page="1">1</button>`);
            if (startPage > 2) {
                buttons.push(`<span class="pagination-ellipsis">...</span>`);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(`
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        data-page="${i}"
                        aria-label="Page ${i}"
                        ${i === this.currentPage ? 'aria-current="page"' : ''}>
                    ${i}
                </button>
            `);
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(`<span class="pagination-ellipsis">...</span>`);
            }
            buttons.push(`<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`);
        }
        
        // Next button
        buttons.push(`
            <button class="pagination-btn" 
                    ${this.currentPage === totalPages ? 'disabled' : ''} 
                    data-page="${this.currentPage + 1}"
                    aria-label="Next page">
                <i class="fas fa-chevron-right"></i>
            </button>
        `);
        
        return buttons.join('');
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (!this.container) return;
        
        // Sort buttons
        this.container.querySelectorAll('.sort-button').forEach(button => {
            button.addEventListener('click', this.handleSort);
        });
        
        // Filter buttons
        this.container.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', this.handleFilter);
        });
        
        // Filter dropdown actions
        this.container.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            this.attachFilterDropdownListeners(dropdown);
        });
        
        // Pagination
        this.container.querySelectorAll('.pagination-btn:not([disabled])').forEach(button => {
            button.addEventListener('click', this.handlePageChange);
        });
        
        // Custom events
        this.container.addEventListener('refresh', () => {
            if (this.options.onRefresh) {
                this.options.onRefresh();
            }
        });
        
        this.container.addEventListener('clearFilters', () => {
            this.clearAllFilters();
        });
        
        // Keyboard navigation
        this.container.addEventListener('keydown', this.handleKeydown);
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }
    
    /**
     * Attach filter dropdown event listeners
     */
    attachFilterDropdownListeners(dropdown) {
        const column = dropdown.closest('.filter-container').querySelector('.filter-button').dataset.column;
        
        // Close button
        const closeBtn = dropdown.querySelector('.filter-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeFilterDropdown(column));
        }
        
        // Action buttons
        const clearBtn = dropdown.querySelector('[data-action="clear"]');
        const applyBtn = dropdown.querySelector('[data-action="apply"]');
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilter(column));
        }
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilter(column));
        }
        
        // Checkbox changes
        dropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const option = checkbox.closest('.filter-option');
                option.setAttribute('aria-selected', checkbox.checked);
            });
        });
    }    
  
  /**
     * Handle sort button clicks
     */
    handleSort(event) {
        event.preventDefault();
        const column = event.currentTarget.dataset.column;
        
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        this.applyFiltersAndSort();
        this.render();
        this.saveState();
        
        // Announce sort change to screen readers
        this.announceToScreenReader(`Table sorted by ${column} ${this.sortDirection}ending`);
    }
    
    /**
     * Handle filter button clicks
     */
    handleFilter(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const column = button.dataset.column;
        const dropdown = button.parentElement.querySelector('.filter-dropdown');
        
        if (dropdown.style.display === 'block') {
            this.closeFilterDropdown(column);
        } else {
            this.openFilterDropdown(column);
        }
    }
    
    /**
     * Open filter dropdown
     */
    openFilterDropdown(column) {
        // Close all other dropdowns
        this.container.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        
        const button = this.container.querySelector(`[data-column="${column}"].filter-button`);
        const dropdown = button.parentElement.querySelector('.filter-dropdown');
        
        if (dropdown) {
            dropdown.style.display = 'block';
            button.setAttribute('aria-expanded', 'true');
            
            // Focus first checkbox
            const firstCheckbox = dropdown.querySelector('input[type="checkbox"]');
            if (firstCheckbox) {
                setTimeout(() => firstCheckbox.focus(), 100);
            }
        }
    }
    
    /**
     * Close filter dropdown
     */
    closeFilterDropdown(column) {
        const button = this.container.querySelector(`[data-column="${column}"].filter-button`);
        const dropdown = button.parentElement.querySelector('.filter-dropdown');
        
        if (dropdown) {
            dropdown.style.display = 'none';
            button.setAttribute('aria-expanded', 'false');
            button.focus();
        }
    }
    
    /**
     * Clear filter for specific column
     */
    clearFilter(column) {
        const dropdown = this.container.querySelector(`[data-column="${column}"]`).parentElement.querySelector('.filter-dropdown');
        
        dropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('.filter-option').setAttribute('aria-selected', 'false');
        });
    }
    
    /**
     * Apply filter for specific column
     */
    applyFilter(column) {
        const dropdown = this.container.querySelector(`[data-column="${column}"]`).parentElement.querySelector('.filter-dropdown');
        const selectedValues = [];
        
        dropdown.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            selectedValues.push(checkbox.value);
        });
        
        this.filters[column] = selectedValues;
        this.currentPage = 1; // Reset to first page
        
        this.applyFiltersAndSort();
        this.render();
        this.saveState();
        
        // Announce filter change
        const filterCount = selectedValues.length;
        this.announceToScreenReader(
            filterCount > 0 ? 
            `Filter applied: ${filterCount} ${column} option${filterCount !== 1 ? 's' : ''} selected` :
            `Filter cleared for ${column}`
        );
    }
    
    /**
     * Clear all filters
     */
    clearAllFilters() {
        this.filters = { accountManager: [] };
        this.currentPage = 1;
        
        this.applyFiltersAndSort();
        this.render();
        this.saveState();
        
        this.announceToScreenReader('All filters cleared');
    }
    
    /**
     * Handle pagination clicks
     */
    handlePageChange(event) {
        event.preventDefault();
        const page = parseInt(event.currentTarget.dataset.page);
        
        if (page && page !== this.currentPage) {
            this.currentPage = page;
            this.render();
            this.saveState();
            
            // Scroll to top of table
            this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            this.announceToScreenReader(`Page ${page} loaded`);
        }
    }
    
    /**
     * Handle keyboard navigation
     */
    handleKeydown(event) {
        const { key, target } = event;
        
        // Handle sortable headers
        if (target.classList.contains('sortable') && (key === 'Enter' || key === ' ')) {
            event.preventDefault();
            const sortButton = target.querySelector('.sort-button');
            if (sortButton) {
                sortButton.click();
            }
        }
        
        // Handle filter dropdowns
        if (target.closest('.filter-dropdown')) {
            if (key === 'Escape') {
                const column = target.closest('.filter-container').querySelector('.filter-button').dataset.column;
                this.closeFilterDropdown(column);
            }
        }
        
        // Handle filter buttons
        if (target.classList.contains('filter-button') && (key === 'Enter' || key === ' ')) {
            event.preventDefault();
            target.click();
        }
    }
    
    /**
     * Handle clicks outside dropdowns
     */
    handleOutsideClick(event) {
        if (!event.target.closest('.filter-container')) {
            this.container.querySelectorAll('.filter-dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
            
            this.container.querySelectorAll('.filter-button').forEach(button => {
                button.setAttribute('aria-expanded', 'false');
            });
        }
    }
    
    /**
     * Apply filters and sorting to data
     */
    applyFiltersAndSort() {
        let filtered = [...this.data];
        
        // Apply filters
        Object.entries(this.filters).forEach(([column, values]) => {
            if (Array.isArray(values) && values.length > 0) {
                filtered = filtered.filter(row => values.includes(row[column]));
            }
        });
        
        // Apply sorting
        if (this.sortColumn) {
            filtered.sort((a, b) => {
                let aVal = a[this.sortColumn] || '';
                let bVal = b[this.sortColumn] || '';
                
                // Handle dates
                if (this.sortColumn === 'completionDate') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                
                // Handle numbers
                if (this.sortColumn === 'npsScore' || this.sortColumn === 'satisfactionScore') {
                    aVal = parseFloat(aVal) || 0;
                    bVal = parseFloat(bVal) || 0;
                }
                
                // Handle strings (with proper Unicode support)
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                    return this.sortDirection === 'asc' ? 
                        aVal.localeCompare(bVal, ['en', 'ar'], { numeric: true }) :
                        bVal.localeCompare(aVal, ['en', 'ar'], { numeric: true });
                }
                
                // Handle other types
                if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        this.filteredData = filtered;
    }
    
    /**
     * Get paginated data for current page
     */
    getPaginatedData() {
        const startIndex = (this.currentPage - 1) * this.options.pageSize;
        const endIndex = startIndex + this.options.pageSize;
        return this.filteredData.slice(startIndex, endIndex);
    }
    
    /**
     * Update filter dropdowns with current data
     */
    updateFilterDropdowns() {
        Object.keys(this.filters).forEach(column => {
            const dropdown = this.container.querySelector(`[data-column="${column}"]`)?.parentElement?.querySelector('.filter-dropdown');
            if (dropdown) {
                const uniqueValues = [...new Set(this.data.map(row => row[column]).filter(Boolean))].sort();
                const selectedValues = this.filters[column] || [];
                
                const optionsContainer = dropdown.querySelector('.filter-options');
                if (optionsContainer) {
                    optionsContainer.innerHTML = uniqueValues.map(value => `
                        <label class="filter-option" role="option" aria-selected="${selectedValues.includes(value)}">
                            <input type="checkbox" 
                                   value="${this.escapeHtml(value)}" 
                                   ${selectedValues.includes(value) ? 'checked' : ''}
                                   data-column="${column}">
                            <span class="checkmark"></span>
                            <span class="option-text">${this.sanitizeUTF8(value)}</span>
                        </label>
                    `).join('');
                    
                    // Reattach listeners
                    this.attachFilterDropdownListeners(dropdown);
                }
            }
        });
    }
    
    /**
     * Get table statistics
     */
    getTableStats() {
        return {
            total: this.data.length,
            visible: this.filteredData.length
        };
    }
    
    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return '—';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }
    
    /**
     * Get NPS score CSS class
     */
    getNPSClass(score) {
        if (score >= 9) return 'score-promoter';
        if (score >= 7) return 'score-passive';
        return 'score-detractor';
    }
    
    /**
     * Sanitize UTF-8 text for proper display
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
            { pattern: /Ø´Ø§ÙƒØ±Ø§/g, replacement: 'شاكرا' },
            { pattern: /Ø§Ù„Ø¹Ø«ÙŠÙ…/g, replacement: 'العثيم' },
            { pattern: /Ø³Ù„ÙŠÙ…/g, replacement: 'سليم' },
            { pattern: /ÙØ¶Ø§Ù„ÙŠ/g, replacement: 'فضالي' }
        ];
        
        mojibakePatterns.forEach(({ pattern, replacement }) => {
            cleaned = cleaned.replace(pattern, replacement);
        });
        
        // Ensure proper Unicode normalization
        cleaned = cleaned.normalize('NFC');
        
        return cleaned;
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    /**
     * Save current state to localStorage
     */
    saveState() {
        if (!this.options.persistState) return;
        
        const state = {
            sortColumn: this.sortColumn,
            sortDirection: this.sortDirection,
            filters: this.filters,
            currentPage: this.currentPage
        };
        
        try {
            localStorage.setItem(`customerTable_${this.containerId}`, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save table state:', e);
        }
    }
    
    /**
     * Load state from localStorage
     */
    loadState() {
        if (!this.options.persistState) return;
        
        try {
            const saved = localStorage.getItem(`customerTable_${this.containerId}`);
            if (saved) {
                const state = JSON.parse(saved);
                this.sortColumn = state.sortColumn;
                this.sortDirection = state.sortDirection || 'asc';
                this.filters = state.filters || { accountManager: [] };
                this.currentPage = state.currentPage || 1;
            }
        } catch (e) {
            console.warn('Could not load table state:', e);
        }
    }
    
    /**
     * Destroy the table and clean up
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('click', this.handleOutsideClick);
        
        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        // Clear references
        this.data = [];
        this.filteredData = [];
        this.filterDropdowns = {};
        
        console.log('🗑️ CustomerTable destroyed');
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CustomerTable = CustomerTable;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomerTable;
}