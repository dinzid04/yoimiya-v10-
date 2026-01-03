const fs = require('fs');
const chalk = require('chalk');

/*
	* Create By Naze
	* Remake By Dhikzx
	* Follow https://github.com/nazedev
	* Whatsapp : wa.me/6282113821188
	* Wahtsapp : wa.me/6285810287828
*/

//——————————( GLOBAL SETTINGS )——————————\\

global.owner = ['62881027247687']
global.owner.lid = ['55753071169765']
global.botname = 'Zanky Botz'
global.ownername = 'Zanky'
global.packname = 'By Zanky Botz'
global.author = 'By zanky'
global.botfooter = 'zanky 𝙱𝚘𝚝𝚣 | 𝙼𝙳'
global.chfooter = 'zanky 𝙱𝚢 zan tampan'
global.tempatDB = 'database.json'
global.customPair = 'AAAAAAAA' // Custom Pairing ( ganti aja )
global.setmenu = 'special';
global.buttons = 'on'; // ONLY WHATSAPP BETA / NOT SUPPORT WHATSAPP BUSINESS

//——————————( GLOBAL MY )——————————\\

global.my = {
    audio: 'https://files.catbox.moe/ub5b3b.mpeg',
    gb: 'https://chat.whatsapp.com/DqXwXWlTbw342gRMN7ImNU',
	ch: '120363360765660190@newsletter',
}

//——————————( GLOBAL MENU )——————————\\

global.menu = {
    image: 'https://img1.pixhost.to/images/10668/668511944_upload.jpg',
    video: 'https://files.catbox.moe/y9vp1c.mp4',
}

//——————————( GLOBAL NOPE )——————————\\

global.nope = {
    dana: '6288210553034',
    gopay: '',
    ovo: 'Unknown',
}

//——————————( GLOBAL IMAGE )——————————\\

global.img = {
    thumbnail: 'https://img1.pixhost.to/images/8526/638389296_dhikzxcloud.jpg',
    footer: 'https://img1.pixhost.to/images/10668/668512587_upload.jpg',
    qris: 'https://img1.pixhost.to/images/8526/638389244_dhikzxcloud.jpg',
    dana: 'https://img1.pixhost.to/images/8526/638389050_dhikzxcloud.jpg',
    gopay: 'https://img1.pixhost.to/images/8526/638389149_dhikzxcloud.jpg',
    ovo: 'https://img1.pixhost.to/images/8526/638389207_dhikzxcloud.jpg',
 }
 
//——————————( GLOBAL FAKE )——————————\\

//               Gausah Di Ganti
global.fake = {
	anonim: 'https://telegra.ph/file/95670d63378f7f4210f03.png',
	docs: fs.readFileSync('./src/media/fake.pdf'),
	listfakedocs: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf'],
}

//——————————( GLOBAL BALANCE )——————————\\

global.limit = {
	free: 20,
	premium: 999,
	vip: 'VIP'
}

global.uang = {
	free: 10000,
	premium: 1000000,
	vip: 10000000
}

//——————————( Settings Panel )——————————\\

// Settings Api Panel Pterodactyl
global.egg = "15" // Egg ID
global.nestid = "5" // nest ID
global.loc = "1" // Location ID
global.domain = 'https://fyzz.ganteng.lightsecretconnected.my.id'
global.apikey = 'ptla_y187NTcN4684fBn1Yjcg4PF2DhrDWvJMyYIA4wbU16t' //ptla
global.capikey = 'ptlc_D5lcopaY8S4Td9TTPzjgKsaNEdQJU4tFpOocdjFpr5T' //ptlc

//———————————————————————————————————————\\

// Settings Api Panel Pterodactyl Server 2
global.eggV2 = "15" // Egg ID
global.nestidV2 = "5" // nest ID
global.locV2 = "1" // Location ID
global.domainV2 = 'https://'
global.apikeyV2 = 'ptla_' //ptla
global.capikeyV2 = 'ptlc_' //ptlc

//———————————————————————————————————————\\

// Settings Api Panel Pterodactyl Server 3
global.eggV3 = "16" // Egg ID
global.nestidV3 = "6" // nest ID
global.locV3 = "1" // Location ID
global.domainV3 = 'https://'
global.apikeyV3 = 'ptla_' //ptla
global.capikeyV3 = 'ptlc_' //ptlc

//———————————————————————————————————————\\

// Settings Api Panel Pterodactyl Server 4
global.eggV4 = "17" // Egg ID
global.nestidV4 = "6" // nest ID
global.locV4 = "1" // Location ID
global.domainV4 = 'https://'
global.apikeyV4 = 'ptla_' //ptla
global.capikeyV4 = 'ptlc_' //ptlc

//———————————————————————————————————————\\

// Settings Api Panel Pterodactyl Server 5
global.eggV5 = "17" // Egg ID
global.nestidV5 = "6" // nest ID
global.locV5 = "1" // Location ID
global.domainV5 = 'https://'
global.apikeyV5 = 'ptla_' //ptla
global.capikeyV5 = 'ptlc_' //ptlc

//——————————( Message )——————————\\

global.mess = {
	owner: 'Fitur Khusus Owner!',
	admin: 'Fitur Khusus Admin!',
	botAdmin: 'Bot Bukan Admin!',
	group: 'Gunakan Di Group!',
	private: 'Gunakan Di Privat Chat!',
	prem: 'Khusus User Premium!',
	wait: 'Loading...',
	error: 'Error!',
	done: 'Done'
}

//——————————( Unknown Settings )——————————\\

global.APIs = {
	hitori: 'https://my.hitori.pw/api',
}
global.APIKeys = {
	'https://my.hitori.pw/api': 'htrkey-awokawok',
}

//——————————( Settings Procses )——————————\\

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});