const fs = require('fs');
const chalk = require('chalk');
////////////////


/////// CPANEL SERVER 2
global.panels3 = "https://dinzxzan.biz.id"//domain panel
global.creds3 = "ptla_6chhHDVW4wHCEiAXAkQRQmwIiIG4qj6U8RyYKsEyi0t"// plta
global.apiusers3 = "ptlc_9ZD5FP2ZxYeQBXgtimLoqz3M7qdIonSrnInrpiYzZe3"//pltc
global.eggsnyas3 = 15
global.netsnyas3 = 5
global.locations3 = "1"



//// AI COSTUM KALIAN
global.prompt = 'hai aku yoimiya'
global.thumbai = 'https://catbox.moe/huwwjwis.jpg'
global.namaai = 'Markona'











//
global.decor = {
	menut: '❏═┅═━–〈',
	menub: '┊•',
	menub2: '┊',
	menuf: '┗––––––––––✦',
	hiasan: '꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷ ͝ ꒦ ͝ ꒷',

	menut: '––––––『',
    menuh: '』––––––',
    menub: '┊☃︎ ',
    menuf: '┗━═┅═━––––––๑\n',
	menua: '',
	menus: '☃︎',

	htki: '––––––『',
	htka: '』––––––',
	haki: '┅━━━═┅═❏',
	haka: '❏═┅═━━━┅',
	lopr: 'Ⓟ',
	lolm: 'Ⓛ',
	htjava: '❃'
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})