const fs = require('fs');

// Read the HTML file
let content = fs.readFileSync('index.html', 'utf8');

// Remove the first progress container (Total Progress Card)
content = content.replace(
    /                                <div class="progress-container">\s*\n                                    <div class="progress-bar">\s*\n                                        <div id="completion-rate-progress" class="progress-fill success" style="width: 0%"><\/div>\s*\n                                    <\/div>\s*\n                                <\/div>/g,
    ''
);

// Remove the second progress container (Satisfaction Score Card)
content = content.replace(
    /                                <div class="progress-container">\s*\n                                    <div class="progress-bar">\s*\n                                        <div id="satisfaction-rate-progress" class="progress-fill" style="width: 0%"><\/div>\s*\n                                    <\/div>\s*\n                                <\/div>/g,
    ''
);

// Remove the inline progress container from account manager table
content = content.replace(
    /                            <div class="progress-container-inline">\s*\n                                <div class="progress-bar-inline">\s*\n                                    <div class="progress-fill \$\{completionRateClass\}" \s*\n                                         data-width="\$\{metrics\.completionRate\}" \s*\n                                         style="width: 0%"><\/div>\s*\n                                <\/div>\s*\n                                <span class="progress-percentage">\$\{metrics\.completionRate\}%<\/span>\s*\n                            <\/div>/g,
    '                            <span class="progress-percentage">${metrics.completionRate}%</span>'
);

// Write the modified content back
fs.writeFileSync('index.html', content, 'utf8');

console.log('Progress bars removed successfully!');