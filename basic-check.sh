#!/bin/bash
echo "🔍 Password Generator - Quick Test"
echo "==================================="
file="generate-password.html"
echo ""
echo "✅ File exists:"
ls -lh "$file" | awk '{print "  Size:", $5}'

echo ""
echo "-- Checking for required elements --"
if grep -q 'id="length"' $file; then echo "   ✅ Length input found"; else echo "   ❌ Missing"; fi
if grep -q 'passwordDisplay' $file; then echo "   ✅ Password display found"; else echo "   ❌ Missing"; fi
if grep -q 'generatePassword' $file; then echo "   ✅ generator function exists"; fi

echo ""