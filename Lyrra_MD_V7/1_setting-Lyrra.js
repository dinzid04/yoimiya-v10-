require("./Lyrra")
const fs = require('fs')
const { version } = require("./package.json")
//~~~~~~~~~SETTING BOT~~~~~~~~~~//

global.pairing = "PPPPPPPP"// 8 huruf/angka
global.owner = ['6285892928715']
global.namaBot = "Ipin SHOP"
global.namaOwner = "ipin"
global.linkch = "https://whatsapp.com/channel/0029VbBKScNAInPfll7NHM0O"
global.linkgc = "https://chat.whatsapp.com/LvA30WKiFgB0t5yFjFmWsz?mode=hqrc"
// Foto Message
global.thumbnail = './_menu.jpg'
global.thumbnail2 = "https://img1.pixhost.to/images/10784/670068064_jamal-md.jpg"
global.video = "https://raw.githubusercontent.com/zionjs0/whatsapp-media/main/file_1765376820477.mp4"
global.audio = "https://raw.githubusercontent.com/zionjs0/whatsapp-media/main/file_1765376220762.aac"

// ==========================
// 🌐 GLOBAL REGISTER
// ==========================
global.register = false; // default aktif

// Payment
global.teks = "jangan lupa kirim bukti transfernya kak"
global.namadana = "xieenaa"
global.namagopay = "Pinz Host"
global.namaovo = "-"
global.dana = "085892928715"// isi no dana
global.ovo = "-"// isi no ovo
global.gopay = "085892928715"//isi no gopay
global.qris = "https://github.com/AhmadDaniWn/No-Enc/blob/main/G313019263-0703A01-default.png?raw=true"// isi url qris

// TOKEN BOT TELEGRAM
global.token = "8156052053:AAH16-yGrqrgzhzd_yUqo0IBO_0cuHHgbmU" // GANTI DENGAN TOKEN BOT TELE KALIAN
global.owntg = "7009109669"  // GANTI DENGAN ID TELE KALIAN
// GRUP GARANSI PANEL TELE/WA (OPSIONAL)
global.linkgc = "https://chat.whatsapp.com/LvA30WKiFgB0t5yFjFmWsz?mode=hqrc"

// Settings Api Panel Pterodactyl
// INI JUGA BUAT FITUR BUY PANEL OTOMATIS VIA WA/TELE
global.egg = "15" // Egg ID
global.nestid = "5" // nest ID
global.loc = "1" // Location ID
global.domain = "https://pterodactyl-by.alwaysnyzz.my.id"
global.apikey = "ptla_MJdugVfFX6jQwE4xQxV4N4AQdRxizGLzRTH1yRj4Teg" //ptla
global.capikey = " " //ptlc

// Settings Api Panel Pterodactyl Server 2
global.eggV2 = "15" // Egg ID
global.nestidV2 = "5" // nest ID
global.locV2 = "1" // Location ID
global.domainV2 = "https"
global.apikeyV2 = "ptla" //ptla
global.capikeyV2 = "ptlc" //ptlc

// Setting Api cVPS
global.doToken = "APIKEY"
global.linodeToken = "APIKEY"

//Set Limit User
global.setlimit = 100

//Set Api BotWa
global.baseurl = "https://ciaatopup.my.id"
global.pay = {
  apikey: "CiaaTopUp_ylddpmphwjwq4rb2",
  fee: 300,
  metode: "QRISFAST",
  expired: Date.now() + (30 * 60 * 1000)
}

// Message
global.mess = {
 owner: "Maaf hanya untuk owner bot",
 prem: "Maaf hanya untuk pengguna premium",
 admin: "Maaf hanya untuk admin group",
 botadmin: "Maaf bot harus dijadikan admin",
 group: "Maaf hanya dapat digunakan di dalam group",
 private: "Silahkan gunakan fitur di private chat",
}
global.vircsetz = ['☼', '✘', '✦', '✧', '❀', '○', '⏣', '♧', '々', '〆', '✎'] // Emoticon

global.gamewaktu = 60 // Game waktu
global.suit = {};
global.tictactoe = {};
global.petakbom = {};
global.kuis = {};
global.siapakahaku = {};
global.asahotak = {};
global.susunkata = {};
global.caklontong = {};
global.family100 = {};
global.tebaklirik = {};
global.tebaklagu = {};
global.tebakgambar2 = {};
global.tebakkimia = {};
global.tebakkata = {};
global.tebakkalimat = {};
global.tebakbendera = {};
global.tebakanime = {};
global.kuismath = {};

global.rpg = {
    emoticon(string) {
        string = string.toLowerCase()
        let emot = {
            level: '📊',
            limit: '🎫',
            health: '❤️',
            exp: '✨',
            atm: '💳',
            money: '💰',
            bank: '🏦',
            potion: '🥤',
            diamond: '💎',
            common: '📦',
            uncommon: '🛍️',
            mythic: '🎁',
            legendary: '🗃️',
            superior: '💼',
            pet: '🔖',
            trash: '🗑',
            armor: '🥼',
            sword: '⚔️',
            makanancentaur: "🥗",
            makanangriffin: "🥙",
            makanankyubi: "🍗",
            makanannaga: "🍖",
            makananpet: "🥩",
            makananphonix: "🧀",
            pickaxe: '⛏️',
            fishingrod: '🎣',
            wood: '🪵',
            rock: '🪨',
            string: '🕸️',
            horse: '🐴',
            cat: '🐱',
            dog: '🐶',
            fox: '🦊',
            robo: '🤖',
            petfood: '🍖',
            iron: '⛓️',
            gold: '🪙',
            emerald: '❇️',
            upgrader: '🧰',
            bibitanggur: '🌱',
            bibitjeruk: '🌿',
            bibitapel: '☘️',
            bibitmangga: '🍀',
            bibitpisang: '🌴',
            anggur: '🍇',
            jeruk: '🍊',
            apel: '🍎',
            mangga: '🥭',
            pisang: '🍌',
            botol: '🍾',
            kardus: '📦',
            kaleng: '🏮',
            plastik: '📜',
            gelas: '🧋',
            chip: '♋',
            umpan: '🪱',
            naga: "🐉",
            phonix: "🦅",
            kyubi: "🦊",
            griffin: "🦒",
            centaur: "🎠",
            skata: '🧩'
        }
        let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
        if (!results.length) return ''
        else return emot[results[0][0]]
    }
}
//~~~~~~~~~~~ DIEMIN ~~~~~~~~~~//

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
