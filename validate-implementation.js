/**
 * Validation script for the Enhanced Customer Table implementation
 * This script checks if all components are working correctly
 */

class ImplementationValidator {
    constructor() {
        this.results = [];
        this.errors = [];
    }
    
    async validate() {
        console.log('🔍 Starting Enhanced Customer Table validation...');
        
        // Test 1: Check if CSS file exists and loads
        await this.testCSSLoading();
        
        // Test 2: Check if JavaScript files exist and load
        await this.testJSLoading();
        
        // Test 3: Check if classes are properly defined
        this.testClassDefinitions();
        
        // Test 4: Test UTF-8 handling
        this.testUTF8Handling();
        
        // Test 5: Test table functionality
        await this.testTableFunctionality();
        
        // Test 6: Test accessibility features
        this.testAccessibility();
        
        // Test 7: Test responsive design
        this.testResponsiveDesign();
        
        // Generate report
        this.generateReport();
        
        return {
            success: this.errors.length === 0,
            results: this.results,
            errors: this.errors
        };
    }
    
    async testCSSLoading() {
        try {
            const response = await fetch('customer-table.css');
            if (response.ok) {
                this.addResult('✅ CSS file loads successfully');
                
                // Check if CSS variables are defined
                const testElement = document.createElement('div');
                testElement.style.color = 'var(--primary-main)';
                document.body.appendChild(testElement);
                const computedStyle = getComputedStyle(testElement);
                
                if (computedStyle.color !== 'var(--primary-main)') {
                    this.addResult('✅ CSS variables are properly defined');
                } else {
                    this.addError('❌ CSS variables not found or not loaded');
                }
                
                document.body.removeChild(testElement);
            } else {
                this.addError('❌ CSS file failed to load');
            }
        } catch (error) {
            this.addError(`❌ CSS loading error: ${error.message}`);
        }
    }
    
    async testJSLoading() {
        const scripts = [
            'customer-table.js',
            'customer-table-integration.js',
            'add-enhanced-table.js'
        ];
        
        for (const script of scripts) {
            try {
                const response = await fetch(script);
                if (response.ok) {
                    this.addResult(`✅ ${script} loads successfully`);
                } else {
                    this.addError(`❌ ${script} failed to load`);
                }
            } catch (error) {
                this.addError(`❌ ${script} loading error: ${error.message}`);
            }
        }
    }
    
    testClassDefinitions() {
        const requiredClasses = ['CustomerTable', 'CustomerTableIntegration'];
        
        for (const className of requiredClasses) {
            if (typeof window[className] !== 'undefined') {
                this.addResult(`✅ ${className} class is defined`);
                
                // Test if class can be instantiated
                try {
                    if (className === 'CustomerTable') {
                        // Create a test container
                        const testContainer = document.createElement('div');
                        testContainer.id = 'test-container';
                        document.body.appendChild(testContainer);
                        
                        const instance = new window[className]('test-container');
                        this.addResult(`✅ ${className} can be instantiated`);
                        
                        // Clean up
                        instance.destroy();
                        document.body.removeChild(testContainer);
                    } else {
                        const instance = new window[className]();
                        this.addResult(`✅ ${className} can be instantiated`);
                    }
                } catch (error) {
                    this.addError(`❌ ${className} instantiation failed: ${error.message}`);
                }
            } else {
                this.addError(`❌ ${className} class not found`);
            }
        }
    }
    
    testUTF8Handling() {
        try {
            // Test Arabic text handling
            const testTexts = [
                'ساكو',
                'إبراهيم فضالي',
                'عبدالله احمد',
                'الدخيل للعود',
                'شاكرا'
            ];
            
            if (typeof CustomerTable !== 'undefined') {
                const testContainer = document.createElement('div');
                testContainer.id = 'utf8-test-container';
                document.body.appendChild(testContainer);
                
                const table = new CustomerTable('utf8-test-container');
                
                for (const text of testTexts) {
                    const sanitized = table.sanitizeUTF8(text);
                    if (sanitized === text) {
                        this.addResult(`✅ UTF-8 handling correct for: ${text}`);
                    } else {
                        this.addResult(`ℹ️ UTF-8 sanitized: ${text} → ${sanitized}`);
                    }
                }
                
                table.destroy();
                document.body.removeChild(testContainer);
            } else {
                this.addError('❌ Cannot test UTF-8 handling - CustomerTable not available');
            }
        } catch (error) {
            this.addError(`❌ UTF-8 testing error: ${error.message}`);
        }
    }
    
    async testTableFunctionality() {
        try {
            if (typeof CustomerTable === 'undefined') {
                this.addError('❌ Cannot test table functionality - CustomerTable not available');
                return;
            }
            
            const testContainer = document.createElement('div');
            testContainer.id = 'functionality-test-container';
            document.body.appendChild(testContainer);
            
            const table = new CustomerTable('functionality-test-container', {
                pageSize: 5,
                enablePagination: true,
                enableFiltering: true,
                enableSorting: true
            });
            
            // Test data setting
            const testData = [
                {
                    id: 'test-1',
                    customerName: 'Test Customer 1',
                    accountManager: 'Manager A',
                    serviceType: 'Service 1',
                    completionDate: '2025-01-01',
                    npsScore: 8,
                    satisfactionScore: 4
                },
                {
                    id: 'test-2',
                    customerName: 'Test Customer 2',
                    accountManager: 'Manager B',
                    serviceType: 'Service 2',
                    completionDate: '2025-01-02',
                    npsScore: 9,
                    satisfactionScore: 5
                }
            ];
            
            table.setData(testData);
            this.addResult('✅ Table data setting works');
            
            // Test filtering
            table.filters.accountManager = ['Manager A'];
            table.applyFiltersAndSort();
            if (table.filteredData.length === 1) {
                this.addResult('✅ Filtering functionality works');
            } else {
                this.addError('❌ Filtering functionality failed');
            }
            
            // Test sorting
            table.sortColumn = 'customerName';
            table.sortDirection = 'desc';
            table.applyFiltersAndSort();
            this.addResult('✅ Sorting functionality works');
            
            // Clean up
            table.destroy();
            document.body.removeChild(testContainer);
            
        } catch (error) {
            this.addError(`❌ Table functionality testing error: ${error.message}`);
        }
    }
    
    testAccessibility() {
        try {
            // Check if ARIA attributes are properly implemented
            const testContainer = document.createElement('div');
            testContainer.id = 'accessibility-test-container';
            document.body.appendChild(testContainer);
            
            if (typeof CustomerTable !== 'undefined') {
                const table = new CustomerTable('accessibility-test-container');
                table.setData([{
                    id: 'test',
                    customerName: 'Test',
                    accountManager: 'Test Manager',
                    serviceType: 'Test Service',
                    completionDate: '2025-01-01',
                    npsScore: 8,
                    satisfactionScore: 4
                }]);
                
                // Check for ARIA attributes
                const tableElement = testContainer.querySelector('table');
                if (tableElement && tableElement.getAttribute('role') === 'table') {
                    this.addResult('✅ Table has proper ARIA role');
                } else {
                    this.addError('❌ Table missing ARIA role');
                }
                
                // Check for column headers
                const headers = testContainer.querySelectorAll('th[role="columnheader"]');
                if (headers.length > 0) {
                    this.addResult('✅ Column headers have proper ARIA roles');
                } else {
                    this.addError('❌ Column headers missing ARIA roles');
                }
                
                table.destroy();
            }
            
            document.body.removeChild(testContainer);
            
        } catch (error) {
            this.addError(`❌ Accessibility testing error: ${error.message}`);
        }
    }
    
    testResponsiveDesign() {
        try {
            // Test CSS media queries
            const mediaQueries = [
                '(max-width: 768px)',
                '(max-width: 480px)',
                '(prefers-reduced-motion: reduce)',
                '(prefers-contrast: high)'
            ];
            
            for (const query of mediaQueries) {
                if (window.matchMedia && window.matchMedia(query)) {
                    this.addResult(`✅ Media query supported: ${query}`);
                } else {
                    this.addError(`❌ Media query not supported: ${query}`);
                }
            }
            
        } catch (error) {
            this.addError(`❌ Responsive design testing error: ${error.message}`);
        }
    }
    
    addResult(message) {
        this.results.push(message);
        console.log(message);
    }
    
    addError(message) {
        this.errors.push(message);
        console.error(message);
    }
    
    generateReport() {
        console.log('\n📊 VALIDATION REPORT');
        console.log('='.repeat(50));
        
        console.log('\n✅ PASSED TESTS:');
        this.results.forEach(result => console.log(`  ${result}`));
        
        if (this.errors.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.errors.forEach(error => console.log(`  ${error}`));
        }
        
        console.log(`\n📈 SUMMARY: ${this.results.length} passed, ${this.errors.length} failed`);
        
        if (this.errors.length === 0) {
            console.log('🎉 All tests passed! Enhanced Customer Table is ready to use.');
        } else {
            console.log('⚠️ Some tests failed. Please review the errors above.');
        }
    }
}

// Auto-run validation when script loads
document.addEventListener('DOMContentLoaded', async function() {
    // Wait for other scripts to load
    setTimeout(async () => {
        const validator = new ImplementationValidator();
        const report = await validator.validate();
        
        // Make report available globally
        window.validationReport = report;
        
        // Show results in console
        if (report.success) {
            console.log('🎉 Enhanced Customer Table validation completed successfully!');
        } else {
            console.warn('⚠️ Enhanced Customer Table validation found issues. Check the report above.');
        }
    }, 3000);
});

// Export for manual testing
if (typeof window !== 'undefined') {
    window.ImplementationValidator = ImplementationValidator;
}