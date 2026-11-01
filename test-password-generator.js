#!/usr/bin/env node

// Test page for password generator using Playwright or puppeteer
// Run with: node test-password-generator.js PORT (default: 8000)

const { chromium, firefox } = require('@playwright/test');

async function runTests(port = 8000) {
    const browser = await chromium.launch({
        headless: true,
        slowMo: false,
    });

    console.log('🧪 Starting Password Generator tests...\n');

    const page = await browser.newPage();
    const portArg = typeof port === 'string' ? parseInt(port) : 8000;
    
    try {
        await page.waitForLoadState('networkidle', { timeout: 5000 });

        // Test 1: Load the page and check basic elements
        console.log('Test 1: Page load and structure...');
        const response = await page.goto(`http://127.0.0.1:${portArg}/generate-password.html`, { waitUntil: 'networkidle' });
        console.assert(response.ok(), 'Page did not load successfully');
        
        // Check for expected elements
        await expect(page.locator('h1')).toBeVisible();
        console.log('✅ H1 heading found');

        const lengthInput = page.locator('#length').first();
        const lengthDisplay = page.locator('#lengthDisplay').first();
        console.log(`✅ Length slider found (initial value: ${await lengthInput.inputValue()})`);

        // Test 2: Check checkbox states are initialized correctly
        console.log('\nTest 2: Initialize with default settings...');
        const initialPassword = page.locator('.current-password').first();
        let passwordText = await initialPassword.innerText();
        console.log(`✅ Initial password: "${passwordText}" (length: ${passwordText.length})`);
        expect(passwordText).toBeTruthy();

        // Test 3: Toggle character options and check password generation
        console.log('\nTest 3: Test lowercase only...');
        
        const checkboxes = page.locators('#lowercase').first();
        await checkboxes.evaluate(node => node.checked = false);
        // Give it a moment to generate
        await page.waitForTimeout(100);
                
        passwordText = await initialPassword.innerText();
        console.log(`📝 Lowercase only: "${passwordText}"`);

        // Test 4: Add numbers back (should mix both cases + numbers)
        console.log('\nTest 4: Adding numbers to charsets...');
        const lowerCaseBox = page.locator('#lowercase').first();
        const numberBox = page.locator('#numbers').first();
        
        await lowerCaseBox.focus();
        await lowerCaseBox.dblclick(); // Use double click to toggle
        await page.waitForTimeout(100);

        passwordText = await initialPassword.innerText();
        console.log(`📝 Lowercase: "${passwordText}"`);

        const numbersLength = await numberBox.evaluate(node => {
            return { checked: node.checked };
        });
        
        if (numbersLength.checked === false) {
            console.log('❌ Expected lower and numbers to combine, got:', passwordText);
        } else {
            // Test 5: Change length slider and verify it updates immediately
            console.log('\nTest 5: Change slider from 32 to 16 chars...');
            
            const oldValue = await numberInput.inputValue();
            await numberInput.fill('16');
            await page.waitForTimeout(50); // Give generatePassword a moment

            newLength = await initialPassword.innerText().length;
            console.log(`✅ New password length: ${newLength} (requested 16)`);

            if (newLength !== 16) {
                console.log('⚠️ Length should be exactly 16');
            } else {
                console.log('✅ Length slider working!');
            }

        }
    } catch (error) {
        console.error('❌ Test error:', error.message);
        await page.screenshot({ path: 'test-error.png', fullPage: false });
    }

    await browser.close();
}

if (require.main === module) {
    runTests(parseInt(process.argv[2]) || 8000);
}
