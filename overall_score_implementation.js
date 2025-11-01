// New Overall Score Implementation for Account Managers
// This replaces the CSAT score calculation with a comprehensive Overall Score

// 1. Modified account manager metrics initialization
const accountManagerMetricsInit = {
    completed: 0,
    pending: 0,
    completionRate: 0,
    totalAssigned: 0,
    satisfiedCustomers: 0,
    // New metrics for Overall Score calculation
    communicationScores: [],
    responsivenessScores: [],
    problemResolutionScores: [],
    customizationScores: [],
    overallScore: null
};

// 2. Modified survey processing to collect the 4 performance metrics
function processSurveyForAccountManager(survey, accountManagerMetrics, manager) {
    if (survey.submittedAt) {
        accountManagerMetrics[manager].completed++;

        // Keep existing satisfaction tracking for other purposes
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
        }
    }
}

// 3. Calculate Overall Score function
function calculateOverallScore(metrics) {
    const averages = [];
    
    // Calculate average for each metric if there are scores
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
        return Math.round(overallScore * 10) / 10; // Round to 1 decimal place
    }
    
    return null; // No data available
}

// 4. Get color class for Overall Score
function getOverallScoreColorClass(score) {
    if (score === null || score === undefined) return '';
    
    if (score >= 4.0) return 'score-green';
    if (score >= 3.0) return 'score-orange';
    return 'score-red';
}

// 5. Modified createManagerRow function (the part that displays the score)
function createManagerRowOverallScore(metrics) {
    const overallScoreDisplay = metrics.overallScore !== null 
        ? `<span class="overall-score ${getOverallScoreColorClass(metrics.overallScore)}">${metrics.overallScore}</span>`
        : '<span class="overall-score no-data"></span>';
    
    return overallScoreDisplay;
}

// CSS classes needed for color coding
const cssClasses = `
.score-green {
    color: var(--primary-main) !important;
    font-weight: 600;
}

.score-orange {
    color: var(--secondary-main) !important;
    font-weight: 600;
}

.score-red {
    color: #ef4444 !important;
    font-weight: 600;
}

.overall-score.no-data {
    color: var(--text-secondary);
}
`;