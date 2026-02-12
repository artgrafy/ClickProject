const { execSync } = require('child_process');

const vars = {
    NEXT_PUBLIC_SUPABASE_URL: "https://aarsgtcmhdjqwrvqvfem.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcnNndGNtaGRqcXdydnF2ZmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyODM0NTUsImV4cCI6MjA4NTg1OTQ1NX0.Ot-Vm5xCqo1RMYLC3I4ZPGareP4aLImhndqc8NK4Ruw"
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
