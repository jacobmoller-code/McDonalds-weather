const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
console.log('Reading McDonald\'s restaurant data...');
const workbook = XLSX.readFile('McDonald restaurants.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Display structure
console.log('\nFile structure:');
console.log('First row:', data[0]);
console.log('\nColumns:', Object.keys(data[0]));
console.log(`\nTotal restaurants: ${data.length}`);

// Check for coordinates
const hasCoordinates = data[0].hasOwnProperty('latitude') ||
                       data[0].hasOwnProperty('lat') ||
                       data[0].hasOwnProperty('Latitude');

console.log(hasCoordinates ? '\n✓ Coordinates found' : '\n✗ No coordinates - will need geocoding');
