const { execSync } = require('child_process');

const vars = {
    NEXT_PUBLIC_SUPABASE_URL: "https://jftsdfkohskbuunptkrh.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdHNkZmtvaHNrYnV1bnB0a3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTYxNTcsImV4cCI6MjA4NTczMjE1N30.VD8PzyAkZY-XZlT-mNFLYmTLHTBv6BYKY8J7T5RPWN0"
};

for (const [name, value] of Object.entries(vars)) {
    try {
        console.log(`Removing ${name}...`);
        execSync(`npx vercel env rm ${name} production --yes`, { stdio: 'inherit' });
    } catch (e) { }

    console.log(`Adding ${name}...`);
    // Use pipe to provide 'n' for sensitivity and then the value
    const input = `n\n${value}\n`;
    execSync(`npx vercel env add ${name} production`, { input, stdio: 'inherit' });
}
