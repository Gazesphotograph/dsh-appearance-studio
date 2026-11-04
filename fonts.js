import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {join} from 'node:path';
const run=promisify(execFile);

// GDI enumerates real family names, including localized names and per-user fonts.
// This is a fixed read-only command: no user-controlled text reaches PowerShell.
const WINDOWS_FONT_QUERY=`
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
Add-Type -AssemblyName System.Drawing
$installedFonts = New-Object System.Drawing.Text.InstalledFontCollection
try { ConvertTo-Json -InputObject @($installedFonts.Families | ForEach-Object { $_.Name } | Sort-Object -Unique) -Compress }
finally { $installedFonts.Dispose() }
`;

export function normalizeFamilies(values) {
    if(!Array.isArray(values))throw new Error('Invalid local font response');
    const names=new Map();
    for(const value of values){
        if(typeof value!=='string')continue;
        const name=value.trim();
        if(!name||name.length>200||/[\u0000-\u001f\u007f"'\\<>,]/u.test(name)||name.startsWith('@'))continue;
        const key=name.toLocaleLowerCase();
        if(!names.has(key))names.set(key,name);
    }
    return [...names.values()].sort((a,b)=>a.localeCompare(b,'zh-CN',{numeric:true,sensitivity:'base'}));
}

export async function readInstalledFonts(signal) {
    if(process.platform!=='win32')throw new Error('Windows font discovery is unavailable');
    const executable=join(process.env.SystemRoot||'C:\\Windows','System32','WindowsPowerShell','v1.0','powershell.exe');
    const {stdout}=await run(executable,['-NoLogo','-NoProfile','-NonInteractive','-EncodedCommand',Buffer.from(WINDOWS_FONT_QUERY,'utf16le').toString('base64')],{windowsHide:true,encoding:'utf8',timeout:12000,maxBuffer:2*1024*1024,signal});
    const fonts=normalizeFamilies(JSON.parse(stdout.replace(/^\uFEFF/,'')));
    if(fonts.length===0)throw new Error('No installed font families found');
    return fonts;
}

export function createFontCatalog(enumerate=readInstalledFonts) {
    let cache,inflight,disposed=false;
    const controller=new AbortController();
    return {
        read(force=false){
            if(disposed)return Promise.reject(new Error('Font catalog disposed'));
            if(inflight)return inflight;
            if(!force&&cache&&Date.now()-cache.generatedAt<60000)return Promise.resolve(cache);
            const current=Promise.resolve().then(()=>enumerate(controller.signal)).then(fonts=>{
                if(disposed)throw new Error('Font catalog disposed');
                return cache={fonts:normalizeFamilies(fonts),generatedAt:Date.now()};
            }).finally(()=>{if(inflight===current)inflight=undefined;});
            inflight=current;
            return current;
        },
        dispose(){disposed=true;cache=undefined;controller.abort();},
    };
}
