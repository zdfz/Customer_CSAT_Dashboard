/**
 * Script to move the Enhanced Customer Table to a more prominent position
 * This will place it right after the existing customer status tables
 */

(function() {
    'use strict';
    
    console.log('📍 Moving Enhanced Customer Table to prominent position...');
    
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(moveTableUp, 1500);
    });
    
    function moveTableUp() {
        try {
            // Find the enhanced table section
            const enhancedSection = document.getElementById('enhanced-customer-table-section');
            if (!enhancedSection) {
                console.log('Enhanced table section not found yet, trying again...');
                setTimeout(moveTableUp, 1000);
                return;
            }
            
            // Find the customer status tables container
            const customerStatusTables = document.getElementById('customer-status-tables');
            if (!customerStatusTables) {
                console.warn('Customer status tables not found');
                return;
            }
            
            // Remove the enhanced section from its current position
            enhancedSection.remove();
            
            // Update the styling to fit better in the new position
            enhancedSection.style.cssText = `
                margin-top: 32px;
                margin-bottom: 32px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                border: 1px solid #E6EFEA;
                overflow: hidden;
                grid-column: 1 / -1;
            `;
            
            // Insert it right after the customer status tables
            customerStatusTables.parentNode.insertBefore(enhancedSection, customerStatusTables.nextSibling);
            
            console.log('✅ Enhanced Customer Table moved to prominent position');
            
            // Add a subtle animation to draw attention
            enhancedSection.style.animation = 'fadeInUp 0.6s ease-out';
            
            // Add the animation CSS if not already present
            if (!document.getElementById('enhanced-table-animations')) {
                const style = document.createElement('style');
                style.id = 'enhanced-table-animations';
                style.textContent = `
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .enhanced-table-highlight {
                        animation: pulse 2s ease-in-out 3;
                    }
                    
                    @keyframes pulse {
                        0%, 100% { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                        50% { box-shadow: 0 8px 25px -5px rgba(16, 185, 129, 0.3); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Add a temporary highlight effect
            setTimeout(() => {
                enhancedSection.classList.add('enhanced-table-highlight');
                setTimeout(() => {
                    enhancedSection.classList.remove('enhanced-table-highlight');
                }, 6000);
            }, 1000);
            
        } catch (error) {
            console.error('❌ Failed to move enhanced table:', error);
        }
    }
    
})();