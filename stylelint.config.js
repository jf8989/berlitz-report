// stylelint.config.js
module.exports = {
    extends: [
        'stylelint-config-standard', // Recommended base
        'stylelint-config-tailwindcss', // Enables Tailwind CSS specific linting
    ],
    rules: {
        // You can override or add rules here if needed
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'tailwind',
                    'apply',
                    'variants',
                    'responsive',
                    'screen',
                    'layer', // Add layer here
                    // any other Tailwind-specific at-rules
                ],
            },
        ],
        'declaration-block-trailing-semicolon': null, // Often used with Tailwind
        'no-descending-specificity': null, // Can be problematic with utility-first
    },
};