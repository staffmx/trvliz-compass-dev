import fs from 'fs';
import path from 'path';

const files = [
    'components/AdminPanel.tsx',
    'components/Documentation.tsx',
    'components/ProviderDetail.tsx',
    'components/SearchResults.tsx'
];

for (const p of files) {
    const fullPath = path.resolve(p);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Evitar doble wrap si ya corrimos el script
        if (content.includes('className="overflow-x-auto w-full max-w-full"')) {
            console.log(`Skipping ${p}, already has overflow-x-auto wrappers.`);
            continue;
        }

        // Wrap <table ... </table> with the responsive div
        // match <table ... to </table>
        content = content.replace(/(<table[\s\S]*?<\/table>)/g, '<div className="overflow-x-auto w-full max-w-full block">\n$1\n</div>');

        fs.writeFileSync(fullPath, content);
        console.log(`Successfully patched tables in ${p}`);
    } else {
        console.log(`File not found: ${p}`);
    }
}
