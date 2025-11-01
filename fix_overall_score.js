// Script to fix the Overall Score implementation

// Step 1: Update account manager metrics initialization
const metricsInit = `                        accountManagerMetrics[manager] = {
                            completed: 0,
                            pending: 0,
                            completionRate: 0,
                            satisfactionRate: 0,
                            totalAssigned: 0,
                            satisfiedCustomers: 0,
                            communicationScores: [],
                            responsivenessScores: [],
                            problemResolutionScores: [],
                            customizationScores: [],
                            overallScore: null
                        };`;

// Step 2: Add score collection logic
const scoreCollection = `                        // Check if customer is satisfied (rating 4-5)
                        if (survey.overallSatisfaction >= 4) {
                            accountManagerMetrics[manager].satisfiedCustomers++;
                        }

                        // Collect scores for the 4 account manager performance metrics
                        if (survey.communicationClarity !== null && survey.communicationClarity !== undefined) {
                            accountManagerMetrics[manager].communicationScores.push(survey.communicationClarity);
                        }
                        if (survey.responsiveness !== null && survey.responsiveness !== undefined) {
                            accountManagerMetrics[manager].responsivenessScores.push(survey.responsiveness);
                        }
                        if (survey.problemResolution !== null && survey.problemResolution !== undefined) {
                            accountManagerMetrics[manager].problemResolutionScores.push(survey.problemResolution);
                        }
                        if (survey.customizationAbility !== null && survey.customizationAbility !== undefined) {
                            accountManagerMetrics[manager].customizationScores.push(survey.customizationAbility);
                        }`;

// Step 3: Overall Score calculation
const overallScoreCalc = `                        // Calculate Overall Score from the 4 account manager performance metrics
                        const averages = [];
                        
                        if (metrics.communicationScores.length > 0) {
                            const avg = metrics.communicationScores.reduce((a, b) => a + b, 0) / metrics.communicationScores.length;
                            averages.push(avg);
                        }
                        
                        if (metrics.responsivenessScores.length > 0) {
                            const avg = metrics.responsivenessScores.reduce((a, b) => a + b, 0) / metrics.responsivenessScores.length;
                            averages.push(avg);
                        }
                        
                        if (metrics.problemResolutionScores.length > 0) {
                            const avg = metrics.problemResolutionScores.reduce((a, b) => a + b, 0) / metrics.problemResolutionScores.length;
                            averages.push(avg);
                        }
                        
                        if (metrics.customizationScores.length > 0) {
                            const avg = metrics.customizationScores.reduce((a, b) => a + b, 0) / metrics.customizationScores.length;
                            averages.push(avg);
                        }
                        
                        // Calculate overall score as average of available averages
                        if (averages.length > 0) {
                            const overallScore = averages.reduce((a, b) => a + b, 0) / averages.length;
                            metrics.overallScore = Math.round(overallScore * 10) / 10;
                        } else {
                            metrics.overallScore = null;
                        }`;

// Step 4: Display logic
const displayLogic = `\${metrics.overallScore !== null && metrics.overallScore !== undefined ? \`<span class="overall-score \${this.getOverallScoreColorClass(metrics.overallScore)}">\${metrics.overallScore}</span>\` : \`<span class="overall-score no-data"></span>\`}`;

// Step 5: Color class function
const colorClassFunction = `            /**
             * Get color class for Overall Score based on score value
             */
            getOverallScoreColorClass(score) {
                if (score === null || score === undefined) return '';
                
                if (score >= 4.0) return 'score-green';
                if (score >= 3.0) return 'score-orange';
                return 'score-red';
            }`;

// Step 6: CSS classes
const cssClasses = `        /* Overall Score Color Coding */
        .overall-score.score-green {
            color: var(--primary-main) !important;
            font-weight: 600;
        }

        .overall-score.score-orange {
            color: var(--secondary-main) !important;
            font-weight: 600;
        }

        .overall-score.score-red {
            color: #ef4444 !important;
            font-weight: 600;
        }

        .overall-score.no-data {
            color: var(--text-secondary);
        }`;

console.log('Fix script created. Apply these changes manually to index.html');