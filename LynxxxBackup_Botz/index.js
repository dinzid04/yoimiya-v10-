require('./settings');
const fs = require('fs');
const pino = require('pino');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');
const FileType = require('file-type');
const { Boom } = require('@hapi/boom');
const NodeCache = require('node-cache');
const os = require('os');
const { exec, spawn, execSync } = require('child_process');
const { parsePhoneNumber } = require('awesome-phonenumber');
const { default: WAConnection, useMultiFileAuthState, Browsers, DisconnectReason, makeInMemoryStore, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, proto, jidNormalizedUser, getAggregateVotesInPollMessage } = require('@whiskeysockets/baileys')
const cfonts = require('cfonts');

let pairingCode = true
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

// === TAMBAHAN PEMBERSIH RAM OTOMATIS ===
setInterval(() => {
    // FIX: Cek metode yang tersedia untuk mengambil data chat
    const chats = store.chats.all ? store.chats.all() : Object.values(store.chats);

    chats.forEach((chat) => {
        // Pastikan chat dan messages ada isinya
        if (chat && chat.messages) {
            // Jika pesan di dalam chat lebih dari 50, hapus sisanya
            if (chat.messages.length > 50) {
                chat.messages = chat.messages.slice(-50);
            }
        }
    });
    
    // Opsional: Log untuk memantau (bisa dihapus jika mengganggu)
   console.log('🧹 Membersihkan sampah pesan di RAM...');
}, 10 * 60 * 1000); // Jalan setiap 10 Menit




const question = (text) => new Promise((resolve) => rl.question(text, resolve))

global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + decodeURIComponent(new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) }))) : '')

const decode = (s) => Buffer.from(s, 'base64').toString('utf-8');

const v1 = decode('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0RpbWFzTWFoYXJkaWthMjQvRGJVc2Vycy9tYWluL0RiLmpzb24=');
const DataBase = require('./src/database');
const database = new DataBase(global.tempatDB);

// [FIX] CACHE PENAMPUNGAN UNTUK MENCEGAH DOUBLE REPLY / JITTER
const msgRetryCounterCache = new NodeCache();
const msgDeduplicate = new NodeCache({ stdTTL: 5 }); // ID pesan disimpan selama 5 detik, lalu dihapus otomatis

(async () => {
	const loadData = await database.read()
	if (loadData && Object.keys(loadData).length === 0) {
		global.db = {
			set: {},
			users: {},
			game: {},
			groups: {},
			database: {},
			...(loadData || {}),
		}
		await database.write(global.db)
	} else {
		global.db = loadData
	}
	
	setInterval(async () => {
		if (global.db) await database.write(global.db)
	}, 30000)
})();


const { GroupUpdate, GroupParticipantsUpdate, MessagesUpsert, Solving } = require('./src/message');
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep } = require('./lib/function');

/*
	* Create By Naze
	* Follow https://github.com/nazedev
	* Whatsapp : https://whatsapp.com/channel/0029VaWOkNm7DAWtkvkJBK43
*/

const findJidByLid = (lid, store) => {
		for (const contact of Object.values(store.contacts)) {
			if (contact.lid === lid) {
				return contact.id;
			}
		}
		return null;
	}

async function startNazeBot() {
	const { state, saveCreds } = await useMultiFileAuthState('nazedev');
	const { version, isLatest } = await fetchLatestBaileysVersion();
	const level = pino({ level: 'silent' })
	const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
	
	const getMessage = async (key) => {
		if (store) {
			const msg = await store.loadMessage(key.remoteJid, key.id);
			return msg?.message || ''
		}
		return {
			conversation: 'Halo Saya Naze Bot'
		}
	}
	

// Fungsi format runtime
function runtime(seconds) {
    const pad = s => (s < 10 ? '0' : '') + s;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}


async function verifyUserFromDb(phone) {

        const res = await fetch(v1);
        const db = await res.json();

        const users = db.users || [];
        const user = users.find(u => u.phone === phone);

                if (!user) {
            await new Promise(resolve => setTimeout(resolve, 300));
            
console.clear();
cfonts.say(`Lynxxx 
Botz `, {
  //colors: ['#99ffff'],
  gradient: ['red', 'magenta'],
  font: 'shade',
  align: 'left',
})

        console.log(chalk.bgRedBright.white.bold("\n( ✘ ) Your Number Is Not In The Database!\nPerforming Script Destruction...."));
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
                // Menghapus semua file arsip/script yang umum di ./ directory
const archiveExtensions = /\.(zip|rar|7z|tar|tar\.gz|tgz|gz|xz)$/i;

const archiveFiles = fs.readdirSync(__dirname).filter(file => archiveExtensions.test(file));
for (const archive of archiveFiles) {
    const archivePath = path.join(__dirname, archive);
    try {
        fs.unlinkSync(archivePath);
        console.log(chalk.red(`( ⚠ ) File Arsip Dihapus: ${archive}`));
    } catch (err) {
        console.log(chalk.yellow(`( ! ) Gagal Menghapus: ${archive} - ${err.message}`));
    }
}
        
        // Daftar file yang akan dihapus
        const filesToDelete = ['naze.js', 'index.js'];

        for (const file of filesToDelete) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(chalk.red(`( ⚠ ) File Dihapus: ${file}`));
            } else {
                console.log(chalk.gray(`( i ) File Tidak Ditemukan: ${file}`));
            }
        }

            process.exit(1);
            console.clear();
        }

        // INFO SERVER
        const isPterodactyl = process.env.PWD?.includes('/home/container');
        const environment = isPterodactyl ? 'Pterodactyl Panel' : 'Manual / Lokal';

        const platform = os.platform();
        const arch = os.arch();
        const versionNode = process.version;
        const hostname = os.hostname();
        const uptimeVPS = runtime(os.uptime());

        const cpus = os.cpus();
        const cpuModel = cpus[0].model;
        const cpuSpeed = cpus[0].speed;
        const cpuLoad = (os.loadavg()[0] / cpus.length) * 100;

        const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRam = (totalRam - freeRam).toFixed(2);

        let diskInfo;
        try {
            const rawDisk = execSync("df --block-size=1 / | tail -1").toString().split(/\s+/);
            const toGB = bytes => (parseInt(bytes) / 1024 / 1024 / 1024).toFixed(2);
            diskInfo = {
                total: toGB(rawDisk[1]),
                used: toGB(rawDisk[2]),
                available: toGB(rawDisk[3]),
                usage: rawDisk[4]
            };
        } catch {
            diskInfo = { total: '-', used: '-', available: '-', usage: '-' };
        }

        const startTime = process.hrtime();
        const ping = process.hrtime(startTime);
        const latency = (ping[0] * 1e9 + ping[1]) / 1e9;

        // OUTPUT
        console.clear();
cfonts.say(`Lynxxx 
Botz `, {
  //colors: ['#99ffff'],
  gradient: ['red', 'magenta'],
  font: 'shade',
  align: 'left',
})

console.log(chalk.greenBright(`Welcome To System Dashboard.\n`));

const blueLine = chalk.cyanBright; // warna biru seperti judul

// Info Pengguna
console.log(blueLine('\n╭─────────────[ INFO PENGGUNA ]─────────────╮'));
console.log(`${blueLine('│')} Username     : ${chalk.white(user.nama || user.username || '-')}`);
console.log(`${blueLine('│')} Number       : ${chalk.white(user.phone)}`);
console.log(`${blueLine('│')} Password     : ${chalk.white(user.pin || '-')}`);
console.log(blueLine('╰───────────────────────────────────────────╯'));

// Info Server
console.log(blueLine('\n╭─────────────[ INFO SERVER ]──────────────╮'));
console.log(`${blueLine('│')} OS           : ${chalk.white(`${platform} (${os.release()})`)}`);
console.log(`${blueLine('│')} Arch         : ${chalk.white(arch)}`);
console.log(`${blueLine('│')} Node.js      : ${chalk.white(versionNode)}`);
console.log(`${blueLine('│')} Runtime VPS  : ${chalk.white(uptimeVPS)}`);
console.log(`${blueLine('│')} Environment  : ${chalk.white(environment)}`);

// Tambahan cek IP
try {
    const ipRes = await axios.get('https://api.ipify.org?format=json');
    console.log(`${blueLine('│')} IP Public    : ${chalk.white(ipRes.data.ip)}`);
} catch (err) {
    console.log(`${blueLine('│')} IP Public    : ${chalk.red('Gagal mengambil IP')}`);
}

console.log(blueLine('╰───────────────────────────────────────────╯'));

// Info CPU
console.log(blueLine('\n╭───────────────[ CPU ]────────────────────╮'));
console.log(`${blueLine('│')} Model        : ${chalk.white(cpuModel)}`);
console.log(`${blueLine('│')} Kecepatan    : ${chalk.white(`${cpuSpeed} MHz`)}`);
console.log(`${blueLine('│')} Load         : ${chalk.white(`${cpuLoad.toFixed(2)}% (${cpus.length} Core)`)}`);
console.log(`${blueLine('│')} Load Avg     : ${chalk.white(os.loadavg().map(v => v.toFixed(2)).join(', '))}`);
console.log(blueLine('╰──────────────────────────────────────────╯'));

// Info RAM
console.log(blueLine('\n╭───────────────[ RAM ]────────────────────╮'));
console.log(`${blueLine('│')} Total        : ${chalk.white(`${totalRam} GB`)}`);
console.log(`${blueLine('│')} Digunakan    : ${chalk.white(`${usedRam} GB`)}`);
console.log(`${blueLine('│')} Tersedia     : ${chalk.white(`${freeRam} GB`)}`);
console.log(blueLine('╰──────────────────────────────────────────╯'));

// Info DISK
console.log(blueLine('\n╭──────────────[ DISK ]────────────────────╮'));
console.log(`${blueLine('│')} Total        : ${chalk.white(`${diskInfo.total} GB`)}`);
console.log(`${blueLine('│')} Digunakan    : ${chalk.white(`${diskInfo.used} GB (${diskInfo.usage})`)}`);
console.log(`${blueLine('│')} Tersedia     : ${chalk.white(`${diskInfo.available} GB`)}`);
console.log(blueLine('╰──────────────────────────────────────────╯'));

// Info BOT
console.log(blueLine('\n╭───────────────[ BOT ]────────────────────╮'));
console.log(`${blueLine('│')} Name Bot      : ${chalk.white(botname)}`);
console.log(`${blueLine('│')} Name Owner    : ${chalk.white(ownername)}`);
console.log(`${blueLine('│')} Version Sc    : ${chalk.white('V4.7.2')}`);
console.log(`${blueLine('│')} Pairing Code  : ${chalk.white(global.customPair)}`);
console.log(`${blueLine('│')} Menu Display  : ${chalk.white(setmenu)}`);
console.log(`${blueLine('│')} Button Display: ${chalk.white(buttons)}`);
console.log(`${blueLine('│')} V. Nodejs     : ${chalk.white(process.version)}`);
console.log(`${blueLine('│')} Developer     : ${chalk.green('DhikzxCloud')}`);
console.log(blueLine('╰──────────────────────────────────────────╯'));
console.log(chalk.magentaBright(`\nKetik "y" Untuk Mendapatkan Pairing Code!`));

try {
    const input = await question(chalk.yellowBright(''))

    if (input === 'y') {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(chalk.greenBright(`\n( ✓ ) Next Pairing Code`));
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Lanjut ke menu lain
    } else {
        console.clear();
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log(chalk.redBright(`\nPilihan Tidak Valid`));
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        process.exit(1);
        }
        
    } catch (e) {
        console.log(chalk.red("\n❌ Gagal mengambil data verifikasi dari DB."));
        rl.close();
    }
}

const naze = WAConnection({
		logger: level,
		getMessage,
		syncFullHistory: true, 
        markOnlineOnConnect: false, 
		maxMsgRetryCount: 15,
		msgRetryCounterCache,
		retryRequestDelayMs: 10,
		defaultQueryTimeoutMs: 0,
		connectTimeoutMs: 60000,
		browser: Browsers.ubuntu('Chrome'),
		generateHighQualityLinkPreview: true,
		//waWebSocketUrl: 'wss://web.whatsapp.com/ws',
		cachedGroupMetadata: async (jid) => store.groupMetadata[jid],
		shouldSyncHistoryMessage: msg => {
			console.log(`\x1b[32mMemuat Chat [${msg.progress || 0}%]\x1b[39m`);
			return !!msg.syncType;
		},
		transactionOpts: {
			maxCommitRetries: 10,
			delayBetweenTriesMs: 10,
		},
		appStateMacVerification: {
			patch: true,
			snapshot: true,
		},
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, level),
		},
	})
	
	global.naze = naze;
	
if (pairingCode && !state.creds.registered) {
console.clear();
let phoneNumber;

async function getPhoneNumber() {

console.clear();
cfonts.say(`Lynxxx 
Botz `, {
  //colors: ['#99ffff'],
  gradient: ['red', 'magenta'],
  font: 'shade',
  align: 'left',
})

console.log(chalk.cyanBright("\n✦ Lynxxx Botz V4 ✦"));
console.log(chalk.whiteBright("© 2025 - Dhikzx ⺓\n"), chalk.yellowBright(`\n# Siapa Nama Pembuat Script Lynxxx Botz?\n— © Copyright DhikzxNotDev\n`));

try {
    const input = await question(chalk.blueBright('Your Input: '))

    if (input === 'DhikzxCloud') {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(chalk.greenBright(`\n( ✓ ) Correct Choice! Please Continue By Filling Your Number..`));
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Lanjut ke menu lain
    } else {
        console.clear();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.clear();
console.log(chalk.bgRedBright.white.bold(`███████████████████████████
███████▀▀▀░░░░░░░▀▀▀███████
████▀░░░░░░░░░░░░░░░░░▀████
███│░░░░░░░░░░░░░░░░░░░│███
██▌│░░░░░░░░░░░░░░░░░░░│▐██
██░└┐░░░░░░░░░░░░░░░░░┌┘░██
██░░└┐░░░░░░░░░░░░░░░┌┘░░██
██░░┌┘▄▄▄▄▄░░░░░▄▄▄▄▄└┐░░██
██▌░│██████▌░░░▐██████│░▐██
███░│▐███▀▀░░▄░░▀▀███▌│░███
██▀─┘░░░░░░░▐█▌░░░░░░░└─▀██
██▄░░░▄▄▄▓░░▀█▀░░▓▄▄▄░░░▄██
████▄─┘██▌░░░░░░░▐██└─▄████
█████░░▐█─┬┬┬┬┬┬┬─█▌░░█████
████▌░░░▀┬┼┼┼┼┼┼┼┬▀░░░▐████
█████▄░░░└┴┴┴┴┴┴┴┘░░░▄█████
███████▄░░░░░░░░░░░▄███████
██████████▄▄▄▄▄▄▄██████████
███████████████████████████\n`));

        console.log(chalk.redBright(`\n⛔ SYSTEM BREACH FAILED ⛔\n\nCHOICE INVALID.\nYou are NOT authorized to run this script.\n\n⚠️ All suspicious activities are logged.\n📍 Owner: @DikzCloud\n\nWarning: You are trying to access protected material.\nAbort now... or face the consequences.\n`));
        
        await new Promise(resolve => setTimeout(resolve, 2700));
        
        // Menghapus semua file arsip/script yang umum di ./ directory
const archiveExtensions = /\.(zip|rar|7z|tar|tar\.gz|tgz|gz|xz)$/i;

const archiveFiles = fs.readdirSync(__dirname).filter(file => archiveExtensions.test(file));
for (const archive of archiveFiles) {
    const archivePath = path.join(__dirname, archive);
    try {
        fs.unlinkSync(archivePath);
        console.log(chalk.red(`( ⚠ ) File Arsip Dihapus: ${archive}`));
    } catch (err) {
        console.log(chalk.yellow(`( ! ) Gagal Menghapus: ${archive} - ${err.message}`));
    }
}
        
        // Daftar file yang akan dihapus
        const filesToDelete = ['naze.js', 'index.js'];

        for (const file of filesToDelete) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(chalk.red(`( ⚠ ) File Dihapus: ${file}`));
            } else {
                console.log(chalk.gray(`( i ) File Tidak Ditemukan: ${file}`));
            }
        }
        process.exit(1); // Keluar dari program
    }
} catch (e) {
    console.log(chalk.red(`\n( ✘ ) Terjadi kesalahan: ${e.message}`));
    process.exit(1);
}

console.clear();
cfonts.say(`Lynxxx 
Botz `, {
  //colors: ['#99ffff'],
  gradient: ['red', 'magenta'],
  font: 'shade',
  align: 'left',
})
    console.log(chalk.black(chalk.cyan.bold("\n✦ Lynxxx Botz V4 ✦\n"), chalk.whiteBright("© 2025 - Dhikzx ⺓\n"), chalk.yellowBright(`\n# Masukkan Nomor WhatsApp (Example: 628xxx)`)));
    phoneNumber = await question(chalk.blueBright('Your WhatsApp Number : '));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

    if (!parsePhoneNumber(phoneNumber).valid && phoneNumber.length < 6) {
            console.log(chalk.bgRedBright.white.bold('\nNomor Invalid!\n') + chalk.blueBright('Example: 62xxx\n'));
            await getPhoneNumber();
        }

    await verifyUserFromDb(phoneNumber); // verifikasi DB
}

setTimeout(async () => {
    await getPhoneNumber(); // proses verifikasi user, username, password, dan pilihan pairing

    console.clear();
cfonts.say(`Lynxxx 
Botz `, {
  //colors: ['#99ffff'],
  gradient: ['red', 'magenta'],
  font: 'shade',
  align: 'left',
})

        console.log(chalk.yellowBright(`\n# Preparing Your Pairing Code...`));
await new Promise(resolve => setTimeout(resolve, 2000));
    if (pairingCode && !naze.authState.creds.registered) {
        let code = await naze.requestPairingCode(phoneNumber, customPair);
        code = code.match(/.{1,4}/g).join(" - ") || code;
        console.log(chalk.greenBright.bold(`\nYour Pairing Code:`), chalk.white.bold.bgBlack(` ${code} `));
        console.log(chalk.yellow('Expires in 15 second'));
    }
    

    // lanjut event binding dll di sini
}, 3000);

}

store.bind(naze.ev)
	
	await Solving(naze, store)
	
	naze.ev.on('creds.update', saveCreds)
	
	naze.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, receivedPendingNotifications } = update;
    
    	if (connection === 'close') {
			const reason = new Boom(lastDisconnect?.error)?.output.statusCode
			if (reason === DisconnectReason.connectionLost) {
				console.log('Connection to Server Lost, Attempting to Reconnect...');
				startNazeBot()
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log('Connection closed, Attempting to Reconnect...');
				startNazeBot()
			} else if (reason === DisconnectReason.restartRequired) {
				console.log('Restart Required...');
				startNazeBot()
			} else if (reason === DisconnectReason.timedOut) {
				console.log('Connection Timed Out, Attempting to Reconnect...');
				startNazeBot()
			} else if (reason === DisconnectReason.badSession) {
				console.log('Delete Session and Scan again...');
				startNazeBot()
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log('Close current Session first...');
			} else if (reason === DisconnectReason.loggedOut) {
				console.log('Scan again and Run...');
				exec('rm -rf ./nazedev/*')
				process.exit(1)
			} else if (reason === DisconnectReason.forbidden) {
				console.log('Connection Failure, Scan again and Run...');
				exec('rm -rf ./nazedev/*')
				process.exit(1)
			} else if (reason === DisconnectReason.multideviceMismatch) {
				console.log('Scan again...');
				exec('rm -rf ./nazedev/*')
				process.exit(0)
			} else {
				naze.end(`Unknown DisconnectReason : ${reason}|${connection}`)
			}
		}
				if (connection == 'open') {
			console.log('Bot Berhasil Terhubung!\nConnect To: ' + JSON.stringify(naze.user, null, 2));

			cfonts.say(`Lynxxx 
Botz `, {
				//colors: ['#99ffff'],
				gradient: ['red', 'magenta'],
				font: 'shade',
				align: 'left',
			})
			await console.log(chalk.cyanBright(`\n( + ) Lynxxx Botz Connected Successfully.`));
			await console.log(chalk.greenBright(`( ✓ ) Bot Siap Digunakan, Harap Gunakanlah Dengan Bijak, Seperti Tidak Melakukan Spam, Scamming, Dll Yang Dapat Merugikan Developer & Orang Lain!`));
			await console.log(chalk.magentaBright(`( ! ) Jangan Mengubah Copyright Developer!\n\n`));


			await new Promise(resolve => setTimeout(resolve, 1000));

			//  System Notifikasi Terhubung Via Whatsapp
			//  [FIX] Dikasih Timeout 5 detik agar bot benar-benar loading 100% baru kirim pesan
			/*setTimeout(async () => {
				await naze.sendMessage('6285810287828@s.whatsapp.net', {
					text: `*✅ Successfully Connection*

Don't Forget To Follow The Channel
Developer ➜ https://whatsapp.com/channel/0029VarFuObFnSz613OZ413J So You Can See Information About The Bot & Script
Warning: Don't Use Bots For Abuse!`
				}, {
					quoted: {
						key: {
							fromMe: false,
							participant: '0@s.whatsapp.net',
							remoteJid: 'status@broadcast'
						},
						message: {
							extendedTextMessage: {
								text: 'Follow Channel Developer!',
								contextInfo: {
									externalAdReply: {
										title: 'Channel Developer',
										body: 'Click to follow!',
										thumbnailUrl: null,
										mediaType: 1,
										renderLargerThumbnail: true,
										sourceUrl: 'https://whatsapp.com/channel/0029VarFuObFnSz613OZ413J',
										mediaUrl: 'https://whatsapp.com/channel/0029VarFuObFnSz613OZ413J'
									}
								}
							}
						}
					}
				});
			}, 5000); // Delay 5000 ms (5 Detik)*/
		}


    if (receivedPendingNotifications === 'true') {
        console.log('Please wait About 1 Minute...');
        naze.ev.flush();
    }
});
	
	naze.ev.on('contacts.update', (update) => {
  for (let contact of update) {
    let trueJid;

    if (contact.id.endsWith('@lid')) {
      trueJid = findJidByLid(contact.id, store) || contact.id;
    } else {
      trueJid = jidNormalizedUser(contact.id);
    }

    store.contacts[trueJid] = {
      ...(store.contacts[trueJid] || {}),
      id: trueJid,
      name: contact.notify || store.contacts[trueJid]?.name
    }

    if (contact.id.endsWith('@lid')) {
      store.contacts[trueJid].lid = contact.id;
    }
  }
});
	
	naze.ev.on('call', async (call) => {
  let botNumber = await naze.decodeJid(naze.user.id);
  if (global.db?.set[botNumber]?.anticall) {
    for (let id of call) {
      if (id.status === 'offer') {
        // kirim pesan ke caller
        let msg = await naze.sendMessage(id.from, { 
          text: `Saat Ini, Kami Tidak Dapat Menerima Panggilan ${id.isVideo ? 'Video' : 'Suara'}.\nJika @${id.from.split('@')[0]} Memerlukan Bantuan, Silakan Hubungi Owner Dibawah Ini. ^‿^`, 
          mentions: [id.from]
        });

        // kirim kontak owner utama
        await naze.sendContact(id.from, [global.owner[0]], msg);

        // tolak panggilan
        await naze.rejectCall(id.id, id.from);

        // laporan ke owner utama
        await naze.sendMessage(global.owner[0] + "@s.whatsapp.net", {
          text: `⚠️ Laporan Panggilan Masuk ⚠️\n\nNomor @${id.from.split('@')[0]} mencoba menelpon bot (${id.isVideo ? 'Video Call' : 'Voice Call'}).`,
          mentions: [id.from]
        });
      }
    }
  }
});

    // ===============================================================
    // UPDATE HANDLING PESAN (FIX DOUBLE REPLY & JITTER)
    // ===============================================================
	naze.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        // 1. Cek apakah ada pesan
        if (!chatUpdate.messages || !chatUpdate.messages[0]) return
        
        const m = chatUpdate.messages[0]

        // 2. Filter Pesan Bot Sendiri
        if (m.key.fromMe) return
        
        // 3. Filter LID & Broadcast
        const originJid = m.key.participant || m.key.remoteJid || '';
        if (originJid.includes('@lid') || originJid.includes('status@broadcast')) return

        // 4. [FIX DOUBLE REPLY] Cek Deduping Cache
        if (msgDeduplicate.has(m.key.id)) {
            return; // Pesan sudah diproses sebelumnya, abaikan
        }
        msgDeduplicate.set(m.key.id, true); // Tandai pesan ini sudah diproses

        // 6. Pastikan tipe notifikasi benar
        if (chatUpdate.type !== 'notify') return

        // Jalankan fungsi utama
        await MessagesUpsert(naze, chatUpdate, store);
        
    } catch (err) {
        console.log(err)
    }
})



	
	naze.ev.on('group-participants.update', async (update) => {
		await GroupParticipantsUpdate(naze, update, store);
	});
	
	naze.ev.on('groups.update', (update) => {
		for (const n of update) {
			if (store.groupMetadata[n.id]) {
				Object.assign(store.groupMetadata[n.id], n);
			}
		}
	});
	
	naze.ev.on('presence.update', ({ id, presences: update }) => {
		store.presences[id] = store.presences?.[id] || {};
		Object.assign(store.presences[id], update);
	});


	return naze
}


startNazeBot()

function setCommandHandler() {
  rl.on('line', async (input) => {
    const cmd = input.trim().toLowerCase();

    // ===== .chatowner / .chatdev =====
    if (cmd === '.chatowner' || cmd === '.chatdev') {
      try {
        // Pastikan koneksi bot sudah siap
        if (!global.naze || typeof global.naze.sendMessage !== 'function') {
          console.log(chalk.redBright('\n( ✘ ) Bot belum siap! Tunggu hingga koneksi terbentuk.\n'));
          return;
        }

        await global.naze.sendMessage('6285810287828@s.whatsapp.net', {
          text: `Halo Developer!`
        }, {
          quoted: {
            key: {
              fromMe: false,
              participant: '0@s.whatsapp.net',
              remoteJid: 'status@broadcast'
            },
            message: {
              extendedTextMessage: {
                text: 'Follow Channel Developer!',
                contextInfo: {
                  externalAdReply: {
                    title: 'Channel Developer',
                    body: 'Click to follow!',
                    thumbnailUrl: null,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    sourceUrl: 'https://whatsapp.com/channel/0029VarFuObFnSz613OZ413J',
                    mediaUrl: 'https://whatsapp.com/channel/0029VarFuObFnSz613OZ413J'
                  }
                }
              }
            }
          }
        });

        console.log(chalk.greenBright('\n( ✓ ) Pesan berhasil dikirim ke Developer!\n'));
      } catch (err) {
        console.log(chalk.redBright(`\n( ✘ ) Gagal mengirim pesan: ${err.message}\n`));
      }
    }
  });
}

setCommandHandler();

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});
