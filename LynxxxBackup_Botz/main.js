const { execSync } = require('child_process')

// Cek Versi Node.js (Minimal v21)
const requiredMajorVersion = 21
const currentNodeVersion = process.version
const currentMajor = parseInt(currentNodeVersion.replace(/^v/, '').split('.')[0])

if (currentMajor < requiredMajorVersion) {
    console.warn(`⚠️ Node.js versi kamu (${currentNodeVersion}) terlalu rendah! Gunakan minimal versi v${requiredMajorVersion}`)
    process.exit(1)
}

// Daftar module yang wajib ada
const modulesToCheck = [
    'canvafy',
    'child_process',   // core module
    'ffmpeg-static',
    'fluent-ffmpeg',
    'form-data',
    'express',
    'jimp',
    'os',
    'fs'               // core module
]

let allGood = true
let checkedModules = []

// Cek dan install jika perlu
modulesToCheck.forEach(mod => {
    try {
        require.resolve(mod)
        checkedModules.push(mod)
    } catch {
        if (['fs', 'child_process'].includes(mod)) {
            console.warn(`⚠️ Module core '${mod}' tidak ditemukan, tapi harusnya ini sudah tersedia.`)
            return
        }
        console.warn(`⚠️ Module '${mod}' tidak ditemukan. Menginstall...`)
        try {
            execSync(`npm install ${mod}`, { stdio: 'inherit' })
            checkedModules.push(mod)
        } catch (err) {
            console.error(`❌ Gagal menginstall module '${mod}':`, err.message)
            allGood = false
        }
    }
})

// Output akhir
if (allGood) {
    console.log(`\n✅ Semua aman! Node.js versi ${currentNodeVersion} & ${checkedModules.length} module terpasang dengan baik.`)
} else {
    console.warn(`\n⚠️ Ada beberapa module yang gagal di-install. Silakan cek ulang.`)
}