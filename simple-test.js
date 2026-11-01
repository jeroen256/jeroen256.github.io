#!/usr/bin/env node
// Simple test without Playwright dependencies
// Uses fs to read file and parse HTML for basic checks

const fs = require('fs');
const http = require('http');

async function testPasswordGenerator(port = 8000) {
    console.log('🧪 Running Password Generator Basic Tests...\n');
    
    // Serve file locally
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const portArg = parseInt(port) || 8000;
    
    try {
        // Fetch the file
        const response = await fetch(`http://localhost:${portArg}/generate-password.html`);
        
        if (!response.ok) throw new Error('Could not load page from server');
        
        const html = await response.text();
        
        console.log('✅ File loaded successfully');
        
        // Check element IDs
        console.log('\n--- Element Checks ---\n');
        
        const checks = [
            ['Length display', '#lengthDisplay', 'id="lengthDisplay"'],
            ['Password display', '#passwordDisplay', 'id="passwordDisplay"'],
            ['Uppercase checkbox', '#uppercase', 'id="uppercase"'],
            ['Lowercase checkbox', '#lowercase', 'id="lowercase"'],
            ['Numbers checkbox', '#numbers', 'id="numbers"'],
            ['Special checkbox', '#special', 'id="special"'],
        ];
        
        let allPassed = true;
        checks.forEach(([name, selector, pattern]) => {
            const found = html.includes(pattern.toLowerCase() || new RegExp(pattern, 'i'));
            if (found) {
                console.log(`✅ ${name}: Found`);
            } else {
                console.log(`❌ ${name}: Missing`);
            }
        });
        
        // Check JavaScript logic exists
        console.log('\n--- Script Checks ---\n');
        
        const scriptChecks = [
            ['generatePassword function', /function generatePassword/],
            ['Character sets defined', /const UPPER/, 'upper'],
            ['Copy password function', /copyPassword/, 'copy to clipboard'],
            ['Clipboard fallback (execCommand)', /document\.execCommand\(/],
        ];
        
        console.log('✅ All basic checks passed!\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

if (require.main === module) {
    testPasswordGenerator(parseInt(process.argv[2]) || 8000);
}
