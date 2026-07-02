const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, 'web-prototype', '.env');

if (fs.existsSync(envPath)) {
    console.log('.env file already exists. Skipping setup.');
    process.exit(0);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('==============================================');
console.log('  NightOwl Environment Setup');
console.log('==============================================');
console.log('No .env file found. Please provide your API keys.');
console.log('If you do not have them right now, press Ctrl+C to exit.\n');

rl.question('1. VITE_SUPABASE_URL (e.g., https://xxxxx.supabase.co): ', (supabaseUrl) => {
    rl.question('2. VITE_SUPABASE_ANON_KEY: ', (supabaseKey) => {
        rl.question('3. VITE_AGORA_APP_ID (optional, press Enter to skip): ', (agoraKey) => {
            const envContent = `VITE_SUPABASE_URL=${supabaseUrl.trim()}
VITE_SUPABASE_ANON_KEY=${supabaseKey.trim()}
VITE_AGORA_APP_ID=${agoraKey.trim() || 'dummy_agora_key'}
`;
            fs.writeFileSync(envPath, envContent);
            console.log('\n✅ .env file successfully created at web-prototype/.env\n');
            rl.close();
        });
    });
});
