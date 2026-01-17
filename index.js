require('./settings')
const { modul } = require('./module');
const moment = require('moment-timezone');
const { baileys, boom, chalk, fs, figlet, FileType, path, pino, process, PhoneNumber, axios, yargs, _ } = modul;
const { Boom } = boom
const {
	default: XeonBotIncConnect,
	BufferJSON,
	processedMessages,
	PHONENUMBER_MCC,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
        makeInMemoryStore,
	useMultiFileAuthState,
	delay,
	fetchLatestBaileysVersion,
	generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    getAggregateVotesInPollMessage,
    proto
} = require("@whiskeysockets/baileys")
const cfonts = require('cfonts');
const { color, bgcolor } = require('./lib/color')
const { TelegraPh } = require('./lib/uploader')
const NodeCache = require("node-cache")
const canvafy = require("canvafy")
const { parsePhoneNumber } = require("libphonenumber-js")
let _welcome = JSON.parse(fs.readFileSync('./database/welcome.json'))
let _left = JSON.parse(fs.readFileSync('./database/left.json'))
const makeWASocket = require("@whiskeysockets/baileys").default
const Pino = require("pino")
const readline = require("readline")
const colors = require('colors')
const { start } = require('./lib/spinner')
const { uncache, nocache } = require('./lib/loader')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep, reSize } = require('./lib/myfunc')

const prefix = '.'
let phoneNumber = "916909137213"
const DataBase = require('./library/database');
const database = new DataBase();
(async () => {
const loadData = await database.read()
if (loadData && Object.keys(loadData).length === 0) {
global.db = {
sticker: {},
database: {}, 
groups: {}, 
game: {},
others: {},
users: {},
chats: {},
settings: {},
...(loadData || {}),
}
await database.write(global.db)
} else {
global.db = loadData
}
setInterval(async () => {
if (global.db) await database.write(global.db)
}, 10000)
})()


const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")

const useMobile = process.argv.includes("--mobile")
const owner = JSON.parse(fs.readFileSync('./PREMIUM/owner.json'))

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

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const DinzID = require('./DinzID.js')
// require('./DinzID.js')
// nocache('../DinzID.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))
require('./index.js')
nocache('../index.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))

// === TAMBAHAN PEMBERSIH RAM OTOMATIS ===
setInterval(() => {
    // FIX: Clean memory store messages
    if (store.messages) {
        const messageKeys = Object.keys(store.messages);
        messageKeys.forEach((key) => {
            if (store.messages[key].length > 50) {
                store.messages[key] = store.messages[key].slice(-50);
            }
        });
    }
}, 10 * 60 * 1000); // Jalan setiap 10 Menit

async function DinzBotzInd() {
	const {  saveCreds, state } = await useMultiFileAuthState(`./${sessionName}`)
	const msgRetryCounterCache = new NodeCache()
    const msgDeduplicate = new NodeCache({ stdTTL: 5 })

const DinzBotz = makeWASocket({
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0,
      keepAliveIntervalMs: 10000,
      emitOwnEvents: true,
      fireInitQueries: true,
      generateHighQualityLinkPreview: true,
      syncFullHistory: true,
      markOnlineOnConnect: true,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      retryRequestDelayMs: 10,
      maxMsgRetryCount: 15,

      patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage ||
                message.templateMessage ||
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        },
      auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg.message || undefined
            }
            return {
                conversation: "Yoimiya Disini!"
            }
        },
      msgRetryCounterCache, // Resolve waiting messages
   })
   
const _0x27e29c = _0x47fd;
(function (_0x34b161, _0x5598ca) {
    const _0x271d04 = _0x47fd, _0x4c31db = _0x34b161();
    while (!![]) {
        try {
            const _0x2e3407 = -parseInt(_0x271d04(0x18c)) / (-0xd * 0x3 + -0x1f94 + 0x1fbc) * (-parseInt(_0x271d04(0x18d)) / (0x1913 + -0xc52 + 0xcbf * -0x1)) + parseInt(_0x271d04(0x198)) / (0x8 * 0x152 + 0x1b68 + -0x25f5) * (parseInt(_0x271d04(0x17e)) / (0x1ab2 + 0x593 + -0x2041)) + -parseInt(_0x271d04(0x188)) / (0x517 * 0x1 + 0x2419 * 0x1 + 0x493 * -0x9) * (parseInt(_0x271d04(0x195)) / (-0x3d * -0x68 + -0x24a4 + 0xa9 * 0x12)) + -parseInt(_0x271d04(0x194)) / (0x657 * -0x1 + -0xa5f + 0x10bd * 0x1) + -parseInt(_0x271d04(0x180)) / (-0x9ba + 0x198e + -0xfcc) * (-parseInt(_0x271d04(0x191)) / (0x35b * 0x6 + -0xef * 0x25 + -0x2 * -0x739)) + -parseInt(_0x271d04(0x192)) / (0x1331 + 0x1579 + -0x41 * 0xa0) + parseInt(_0x271d04(0x183)) / (-0x8ed + 0x3 * 0x51 + -0x805 * -0x1);
            if (_0x2e3407 === _0x5598ca)
                break;
            else
                _0x4c31db['push'](_0x4c31db['shift']());
        } catch (_0x1a081b) {
            _0x4c31db['push'](_0x4c31db['shift']());
        }
    }
}(_0x4601, -0x9a3 * 0x47 + -0x3ddea * 0x1 + 0xf7 * 0xa97));
if (!DinzBotz[_0x27e29c(0x18a)][_0x27e29c(0x17d)][_0x27e29c(0x18b)]) {
    const phoneNumber = await question(_0x27e29c(0x190) + _0x27e29c(0x185) + _0x27e29c(0x196) + _0x27e29c(0x184) + _0x27e29c(0x18e));
    let custom = _0x27e29c(0x17f);
    const code = await DinzBotz[_0x27e29c(0x18f) + _0x27e29c(0x197)](phoneNumber, custom);
    console[_0x27e29c(0x189)](chalk[_0x27e29c(0x187)](_0x27e29c(0x193))(_0x27e29c(0x182) + _0x27e29c(0x186) + _0x27e29c(0x181) + code));
}
function _0x47fd(_0x1aa846, _0x1f9b85) {
    const _0x3f3f07 = _0x4601();
    return _0x47fd = function (_0x32435c, _0xef415e) {
        _0x32435c = _0x32435c - (0x709 * 0x1 + 0x2d5 * -0x3 + 0x2f3);
        let _0x3510fa = _0x3f3f07[_0x32435c];
        return _0x3510fa;
    }, _0x47fd(_0x1aa846, _0x1f9b85);
}
function _0x4601() {
    const _0x390d11 = [
        'IRING\x20LU\x20]',
        'keyword',
        '16260BgodpU',
        'log',
        'authState',
        'registered',
        '6797jjSibX',
        '16jBCSqC',
        '\x20Recode\x20:\x0a',
        'requestPai',
        'Masukan\x20No',
        '13599gxjXnG',
        '1879350tHJmuf',
        'aqua',
        '3249393IbmUmo',
        '810NwHMyh',
        'ktif\x20Awali',
        'ringCode',
        '144BBmQKz',
        'creds',
        '5684RQjwSL',
        'YOIMIYAA',
        '360CHZPGB',
        '\x20:\x20',
        '\x0a[\x20CODE\x20PA',
        '12557787BmSIzi',
        '\x20Dengan\x2062',
        'mer\x20Yang\x20A'
    ];
    _0x4601 = function () {
        return _0x390d11;
    };
    return _0x4601();
}
   store.bind(DinzBotz.ev)

    DinzBotz.ev.on('connection.update', async (update) => {
        const { connection } = update
        if (connection === 'open') {
            if (!store.groupMetadata || Object.keys(store.groupMetadata).length === 0) {
                store.groupMetadata = await DinzBotz.groupFetchAllParticipating().catch(() => ({}))
            }
        }
    })
   
function _0x273e(_0x571727, _0x18cfd3) {
    const _0x20ae82 = _0x2cd3();
    return _0x273e = function (_0x20cd29, _0x404204) {
        _0x20cd29 = _0x20cd29 - (-0x1261 + 0x5d9 + -0xc1 * -0x12);
        let _0x32afba = _0x20ae82[_0x20cd29];
        return _0x32afba;
    }, _0x273e(_0x571727, _0x18cfd3);
}
function _0x2cd3() {
    const _0x1d7851 = [
        'ications',
        'nicVA',
        '33747373@n',
        '\x20Again\x20And',
        '26110714@n',
        'yJzyi',
        '39070859@n',
        'badSession',
        'Lost',
        'Follow',
        'cDfHa',
        'receivedPe',
        'block',
        'DinzID',
        '\x20Run.',
        'ONyPb',
        'e\x20Session\x20',
        'NDWmB',
        'Restart\x20Re',
        'ason:\x20',
        '64403311@n',
        'IatrX',
        'uired',
        'WQvmd',
        '\x20Replaced,',
        'and\x20Scan\x20A',
        'error',
        'Connection',
        '\x20Another\x20N',
        'WhiteBrigh',
        '7588ATyvmQ',
        '20sucCkj',
        'timedOut',
        '1203634188',
        'quired,\x20Re',
        'transparen',
        'iZbui',
        'HCYXE',
        'Session\x20Fi',
        'rst',
        'gain',
        'open',
        '3tlEjZi',
        'output',
        'connection',
        'VMTrP',
        '75811250@n',
        'Bad\x20Sessio',
        'statusCode',
        'OJBRx',
        'IvEQL',
        '17898585@n',
        '3795000PfVmXZ',
        'left',
        'Error\x20in\x20C',
        '21605749laZsuf',
        'jkCiS',
        'g...',
        'nBhKE',
        '6571764VKcwXt',
        '.update',
        'n\x20File,\x20Pl',
        '1203633999',
        'g....',
        'ujPEs',
        '1203633992',
        'fWzMa',
        'e\x20Current\x20',
        '\x20Lost\x20from',
        'newsletter',
        'TIVGv',
        'gOzdu',
        'IYIfW',
        'ndingNotif',
        'close',
        '70324179@n',
        'uaPLs',
        'restartReq',
        'EzfPZ',
        '\x20closed,\x20r',
        'eYvlT',
        '\x20Opened,\x20P',
        'WTsiN',
        'ing...',
        'Utswv',
        'Unknown\x20Di',
        'ged\x20Out,\x20P',
        '3294240zXEqPm',
        'Closed',
        'ewsletter',
        'gyecn',
        'Bxgly',
        '1203634177',
        '5718ppMlol',
        'Yellow',
        'ease\x20Delet',
        '01798217@n',
        '15333329@n',
        'GjRYF',
        'mMRju',
        'RmvFV',
        'BdfEr',
        '1203634213',
        'hQXLE',
        'onnection.',
        '1203634202',
        '88193543@n',
        '1203633791',
        'ABpfI',
        'bogcX',
        'vkkfl',
        'starting..',
        '9947irDKdm',
        'lease\x20Clos',
        'true',
        '\x0a\x0aMenghubu',
        '\x20Reconnect',
        'uBvpc',
        'update\x20',
        '6420584wqnywi',
        '1203634013',
        'ptqYR',
        'lpjxZ',
        'Replaced',
        'hnbYG',
        'ew\x20Session',
        'yZHdw',
        'ngkan...',
        'oJxfA',
        'log',
        'sconnectRe',
        'roUSD',
        'econnectin',
        '\x20Server,\x20r',
        '\x20TimedOut,',
        'loggedOut',
        'yellow',
        'false',
        'ODqkB',
        'say',
        '66OQPHwt',
        '1203634038',
        'connecting',
        'Device\x20Log',
        'lease\x20Scan'
    ];
    _0x2cd3 = function () {
        return _0x1d7851;
    };
    return _0x2cd3();
}
const _0x33f5be = _0x273e;
(function (_0x17d5d7, _0x3bb393) {
    const _0x177d88 = _0x273e, _0x594f56 = _0x17d5d7();
    while (!![]) {
        try {
            const _0x3882eb = -parseInt(_0x177d88(0x17b)) / (0x8f1 + -0x18e9 + 0xff9) * (-parseInt(_0x177d88(0x197)) / (0xa36 + 0x26 * 0x56 + -0x16f8)) + parseInt(_0x177d88(0x135)) / (0x18ec + -0x1592 + -0x357) * (parseInt(_0x177d88(0x13f)) / (-0x16 * -0x1af + -0x1bfd + 0x303 * -0x3)) + parseInt(_0x177d88(0x162)) / (0x4b4 + -0xbb * -0x25 + -0x1fb6) + -parseInt(_0x177d88(0x168)) / (0x1 * -0x1b7a + -0x2093 + -0x895 * -0x7) * (-parseInt(_0x177d88(0x129)) / (0x1fa4 + 0xe * -0xc5 + -0x14d7)) + parseInt(_0x177d88(0x182)) / (0x29 * -0x83 + -0x15c + 0x165f) + parseInt(_0x177d88(0x146)) / (0x1 * 0x263 + -0x1 * -0x78b + -0x11 * 0x95) + -parseInt(_0x177d88(0x12a)) / (-0x2 * 0x4bc + -0x69 * -0x52 + -0x1820) * (parseInt(_0x177d88(0x142)) / (0x5 * -0x46 + -0x4e6 + 0x143 * 0x5));
            if (_0x3882eb === _0x3bb393)
                break;
            else
                _0x594f56['push'](_0x594f56['shift']());
        } catch (_0x5dc95f) {
            _0x594f56['push'](_0x594f56['shift']());
        }
    }
}(_0x2cd3, -0xea7e2 + 0x869e1 + 0x1 * 0xefda9), DinzBotz['ev']['on'](_0x33f5be(0x137) + _0x33f5be(0x147), async _0x3b3157 => {
    const _0x37d410 = _0x33f5be, _0x198ee5 = {
            'uBvpc': function (_0x363619, _0x2dee13) {
                return _0x363619 === _0x2dee13;
            },
            'hQXLE': _0x37d410(0x155),
            'ODqkB': function (_0x25f819, _0x25b4b2) {
                return _0x25f819 === _0x25b4b2;
            },
            'WQvmd': function (_0x4980d2) {
                return _0x4980d2();
            },
            'Bxgly': function (_0x312eaa, _0xba296d) {
                return _0x312eaa === _0xba296d;
            },
            'ujPEs': _0x37d410(0x126) + _0x37d410(0x15a) + _0x37d410(0x18f) + _0x37d410(0x14a),
            'BdfEr': _0x37d410(0x126) + _0x37d410(0x14f) + _0x37d410(0x190) + _0x37d410(0x18f) + _0x37d410(0x144),
            'yJzyi': function (_0x361d39) {
                return _0x361d39();
            },
            'IatrX': function (_0x11f913, _0x2037c7) {
                return _0x11f913 === _0x2037c7;
            },
            'OJBRx': _0x37d410(0x126) + _0x37d410(0x123) + _0x37d410(0x127) + _0x37d410(0x188) + _0x37d410(0x15c) + _0x37d410(0x17c) + _0x37d410(0x14e) + _0x37d410(0x131) + _0x37d410(0x132),
            'gyecn': function (_0x4e3ed8) {
                return _0x4e3ed8();
            },
            'ONyPb': function (_0x5c7874, _0xf4872d) {
                return _0x5c7874 === _0xf4872d;
            },
            'EzfPZ': _0x37d410(0x11d) + _0x37d410(0x12d) + _0x37d410(0x17a) + '.',
            'fWzMa': function (_0x9801b1) {
                return _0x9801b1();
            },
            'lpjxZ': _0x37d410(0x126) + _0x37d410(0x191) + _0x37d410(0x17f) + _0x37d410(0x15e),
            'oJxfA': function (_0x5db598, _0x3f49ce) {
                return _0x5db598 == _0x3f49ce;
            },
            'IvEQL': _0x37d410(0x199),
            'HCYXE': _0x37d410(0x194),
            'yZHdw': function (_0x441435, _0x11ea81, _0x34afb1) {
                return _0x441435(_0x11ea81, _0x34afb1);
            },
            'hnbYG': _0x37d410(0x193),
            'ABpfI': _0x37d410(0x134),
            'uaPLs': function (_0x28c5fd, _0x3a28a3) {
                return _0x28c5fd == _0x3a28a3;
            },
            'vkkfl': _0x37d410(0x17d),
            'eYvlT': _0x37d410(0x171) + _0x37d410(0x13e) + _0x37d410(0x164),
            'roUSD': _0x37d410(0x167) + _0x37d410(0x111) + _0x37d410(0x164),
            'iZbui': _0x37d410(0x14c) + _0x37d410(0x139) + _0x37d410(0x164),
            'Utswv': _0x37d410(0x183) + _0x37d410(0x175) + _0x37d410(0x164),
            'bogcX': _0x37d410(0x149) + _0x37d410(0x11f) + _0x37d410(0x164),
            'gOzdu': _0x37d410(0x176) + _0x37d410(0x10d) + _0x37d410(0x164),
            'cDfHa': _0x37d410(0x174) + _0x37d410(0x16b) + _0x37d410(0x164),
            'nBhKE': _0x37d410(0x12c) + _0x37d410(0x10f) + _0x37d410(0x164),
            'VMTrP': _0x37d410(0x198) + _0x37d410(0x156) + _0x37d410(0x164),
            'ptqYR': _0x37d410(0x14c) + _0x37d410(0x16c) + _0x37d410(0x164),
            'mMRju': function (_0x587820, _0xaef5c) {
                return _0x587820(_0xaef5c);
            },
            'RmvFV': _0x37d410(0x118),
            'WTsiN': _0x37d410(0x117),
            'nicVA': _0x37d410(0x140),
            'NDWmB': _0x37d410(0x169),
            'IYIfW': _0x37d410(0x128) + 't',
            'jkCiS': _0x37d410(0x12e) + 't',
            'GjRYF': function (_0x20386f, _0x43127b) {
                return _0x20386f + _0x43127b;
            },
            'TIVGv': _0x37d410(0x141) + _0x37d410(0x173) + _0x37d410(0x181)
        }, {
            connection: _0x186d6a,
            lastDisconnect: _0x17696f
        } = _0x3b3157;
    try {
        if (_0x198ee5[_0x37d410(0x180)](_0x186d6a, _0x198ee5[_0x37d410(0x172)])) {
            let _0x25d92a = new Boom(_0x17696f?.[_0x37d410(0x125)])?.[_0x37d410(0x136)][_0x37d410(0x13b)];
            if (_0x198ee5[_0x37d410(0x195)](_0x25d92a, DisconnectReason[_0x37d410(0x112)]))
                console[_0x37d410(0x18c)](_0x37d410(0x13a) + _0x37d410(0x148) + _0x37d410(0x16a) + _0x37d410(0x11b) + _0x37d410(0x124) + _0x37d410(0x133)), _0x198ee5[_0x37d410(0x122)](DinzBotzInd);
            else {
                if (_0x198ee5[_0x37d410(0x166)](_0x25d92a, DisconnectReason[_0x37d410(0x137) + _0x37d410(0x163)]))
                    console[_0x37d410(0x18c)](_0x198ee5[_0x37d410(0x14b)]), _0x198ee5[_0x37d410(0x122)](DinzBotzInd);
                else {
                    if (_0x198ee5[_0x37d410(0x166)](_0x25d92a, DisconnectReason[_0x37d410(0x137) + _0x37d410(0x113)]))
                        console[_0x37d410(0x18c)](_0x198ee5[_0x37d410(0x170)]), _0x198ee5[_0x37d410(0x110)](DinzBotzInd);
                    else {
                        if (_0x198ee5[_0x37d410(0x120)](_0x25d92a, DisconnectReason[_0x37d410(0x137) + _0x37d410(0x186)]))
                            console[_0x37d410(0x18c)](_0x198ee5[_0x37d410(0x13c)]), _0x198ee5[_0x37d410(0x122)](DinzBotzInd);
                        else {
                            if (_0x198ee5[_0x37d410(0x120)](_0x25d92a, DisconnectReason[_0x37d410(0x192)]))
                                console[_0x37d410(0x18c)](_0x37d410(0x19a) + _0x37d410(0x161) + _0x37d410(0x10a) + _0x37d410(0x10e) + _0x37d410(0x119)), _0x198ee5[_0x37d410(0x165)](DinzBotzInd);
                            else {
                                if (_0x198ee5[_0x37d410(0x11a)](_0x25d92a, DisconnectReason[_0x37d410(0x158) + _0x37d410(0x121)]))
                                    console[_0x37d410(0x18c)](_0x198ee5[_0x37d410(0x159)]), _0x198ee5[_0x37d410(0x14d)](DinzBotzInd);
                                else
                                    _0x198ee5[_0x37d410(0x11a)](_0x25d92a, DisconnectReason[_0x37d410(0x12b)]) ? (console[_0x37d410(0x18c)](_0x198ee5[_0x37d410(0x185)]), _0x198ee5[_0x37d410(0x110)](DinzBotzInd)) : (console[_0x37d410(0x18c)](_0x37d410(0x160) + _0x37d410(0x18d) + _0x37d410(0x11e) + _0x25d92a + '|' + _0x186d6a), _0x198ee5[_0x37d410(0x110)](DinzBotzInd));
                            }
                        }
                    }
                }
            }
        }
        (_0x198ee5[_0x37d410(0x18b)](_0x3b3157[_0x37d410(0x137)], _0x198ee5[_0x37d410(0x13d)]) || _0x198ee5[_0x37d410(0x18b)](_0x3b3157[_0x37d410(0x116) + _0x37d410(0x154) + _0x37d410(0x10b)], _0x198ee5[_0x37d410(0x130)])) && console[_0x37d410(0x18c)](_0x198ee5[_0x37d410(0x189)](color, _0x37d410(0x17e) + _0x37d410(0x18a), _0x198ee5[_0x37d410(0x187)]));
        if (_0x198ee5[_0x37d410(0x18b)](_0x3b3157[_0x37d410(0x137)], _0x198ee5[_0x37d410(0x177)]) || _0x198ee5[_0x37d410(0x157)](_0x3b3157[_0x37d410(0x116) + _0x37d410(0x154) + _0x37d410(0x10b)], _0x198ee5[_0x37d410(0x179)])) {
            let _0x3272cb = [
                _0x198ee5[_0x37d410(0x15b)],
                _0x198ee5[_0x37d410(0x18e)],
                _0x198ee5[_0x37d410(0x12f)],
                _0x198ee5[_0x37d410(0x15f)],
                _0x198ee5[_0x37d410(0x178)],
                _0x198ee5[_0x37d410(0x152)],
                _0x198ee5[_0x37d410(0x115)],
                _0x198ee5[_0x37d410(0x145)],
                _0x198ee5[_0x37d410(0x138)],
                _0x198ee5[_0x37d410(0x184)]
            ];
            for (let _0x7a73b0 of _0x3272cb) {
                await DinzBotz[_0x37d410(0x150) + _0x37d410(0x114)](_0x7a73b0);
            }
            await _0x198ee5[_0x37d410(0x16e)](delay, 0x3d6 * 0x7 + -0x3 * 0x10f + -0xfde), cfonts[_0x37d410(0x196)](_0x198ee5[_0x37d410(0x16f)], {
                'font': _0x198ee5[_0x37d410(0x15d)],
                'align': _0x198ee5[_0x37d410(0x10c)],
                'colors': [
                    _0x198ee5[_0x37d410(0x11c)],
                    _0x198ee5[_0x37d410(0x153)]
                ],
                'background': _0x198ee5[_0x37d410(0x143)],
                'maxLength': 0x14,
                'rawMode': ![]
            });
        }
    } catch (_0xfc19b0) {
        console[_0x37d410(0x18c)](_0x198ee5[_0x37d410(0x16d)](_0x198ee5[_0x37d410(0x151)], _0xfc19b0)), _0x198ee5[_0x37d410(0x14d)](DinzBotzInd);
    }
}));

await delay(5555) 
start('2',colors.bold.white('\n\nMenunggu Pesan Baru..'))

DinzBotz.ev.on('creds.update', await saveCreds)

    // Anti Call
    DinzBotz.ev.on('call', async (XeonPapa) => {
    let botNumber = await DinzBotz.decodeJid(DinzBotz.user.id)
    let XeonBotNum = db.settings[botNumber].anticall
    if (!XeonBotNum) return
    console.log(XeonPapa)
    for (let XeonFucks of XeonPapa) {
    if (XeonFucks.isGroup == false) {
    if (XeonFucks.status == "offer") {
    let XeonBlokMsg = await DinzBotz.sendTextWithMentions(XeonFucks.from, `*${DinzBotz.user.name}* can't receive ${XeonFucks.isVideo ? `video` : `voice` } call. Sorry @${XeonFucks.from.split('@')[0]} you will be blocked. If accidentally please contact the owner to be unblocked !`)
    DinzBotz.sendContact(XeonFucks.from, global.owner, XeonBlokMsg)
    await sleep(8000)
    await DinzBotz.updateBlockStatus(XeonFucks.from, "block")
    }
    }
    }
    })
DinzBotz.ev.on("messages.upsert", async (chatUpdate) => {
  try {
    // 1. Cek apakah ada pesan
    if (!chatUpdate.messages || !chatUpdate.messages[0]) return

    const kay = chatUpdate.messages[0]

    // 2. Filter Broadcast (Fix JID/LID Issue)
    // Removed strict LID filtering here because we now handle LID mapping in smsg/Serialize
    const originJid = kay.key.participant || kay.key.remoteJid || '';
    if (originJid.includes('status@broadcast')) return

    if (!kay.message) return

    // 4. Cek Deduping Cache (Cegah double reply)
    if (msgDeduplicate.has(kay.key.id)) {
        return; // Pesan sudah diproses sebelumnya, abaikan
    }
    msgDeduplicate.set(kay.key.id, true); // Tandai pesan ini sudah diproses

    kay.message = (Object.keys(kay.message)[0] === 'ephemeralMessage') ? kay.message.ephemeralMessage.message : kay.message

    // Auto Read (Fix Delay)
    if (db.settings[DinzBotz.user.id.split(':')[0]]?.autoread) {
        DinzBotz.readMessages([kay.key])
    }

    if (!DinzBotz.public && !kay.key.fromMe) return
    if (kay.key.id.startsWith('BAE5') && kay.key.id.length === 16) return

    const m = smsg(DinzBotz, kay, store)
    await DinzID(DinzBotz, m, chatUpdate, store)
} catch (err) {
console.log(err)}})

    async function getMessage(key){
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message
        }
        return {
            conversation: "Dinz Bot Ada Di Sini"
        }
    }
    DinzBotz.ev.on('messages.update', async chatUpdate => {
        for(const { key, update } of chatUpdate) {
			if(update.pollUpdates && !key.fromMe) {
				const pollCreation = await getMessage(key)
				if(pollCreation) {
				    const pollUpdate = await getAggregateVotesInPollMessage({
							message: pollCreation,
							pollUpdates: update.pollUpdates,
						})
	                var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
	                if (toCmd == undefined) return
                    var prefCmd = prefix+toCmd
	                DinzBotz.appenTextMessage(prefCmd, chatUpdate)
				}
			}
		}
    })

DinzBotz.sendTextWithMentions = async (jid, text, quoted, options = {}) => DinzBotz.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

DinzBotz.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

const findJidByLid = (lid, store) => {
    for (const contact of Object.values(store.contacts)) {
        if (contact.lid === lid) {
            return contact.id;
        }
    }
    return null;
}

DinzBotz.ev.on('contacts.update', update => {
    for (let contact of update) {
        let trueJid;
        if (contact.id.endsWith('@lid')) {
            trueJid = findJidByLid(contact.id, store) || contact.id;
        } else {
            trueJid = jidNormalizedUser(contact.id);
        }

        if (store && store.contacts) {
            store.contacts[trueJid] = {
                ...(store.contacts[trueJid] || {}),
                id: trueJid,
                name: contact.notify || store.contacts[trueJid]?.name
            }
            if (contact.id.endsWith('@lid')) {
                store.contacts[trueJid].lid = contact.id;
            }
        }
    }
})

DinzBotz.getName = (jid, withoutContact  = false) => {
id = DinzBotz.decodeJid(jid)
withoutContact = DinzBotz.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = DinzBotz.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === DinzBotz.decodeJid(DinzBotz.user.id) ?
DinzBotz.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

DinzBotz.parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

DinzBotz.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await DinzBotz.getName(i),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await DinzBotz.getName(i)}\nFN:${await DinzBotz.getName(i)}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${ytname}\nitem2.X-ABLabel:YouTube\nitem3.URL:${socialm}\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
	    })
	}
	DinzBotz.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }

DinzBotz.setStatus = (status) => {
DinzBotz.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}]
})
return status
}
DinzBotz.public = true

DinzBotz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await DinzBotz.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

DinzBotz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await DinzBotz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}

DinzBotz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await DinzBotz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

DinzBotz.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await DinzBotz.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}

DinzBotz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

DinzBotz.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

DinzBotz.getFile = async (PATH, save) => {
let res
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'}
filename = path.join(__filename, './lib' + new Date * 1 + '.' + type.ext)
if (data && save) fs.promises.writeFile(filename, data)
return {
res,
filename,
size: await getSizeMedia(data),
...type,
data}}

DinzBotz.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
let types = await DinzBotz.getFile(path, true)
let { mime, ext, res, data, filename } = types
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }}
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./lib/exif')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await DinzBotz.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)}

DinzBotz.sendText = (jid, text, quoted = '', options) => DinzBotz.sendMessage(jid, { text: text, ...options }, { quoted })

DinzBotz.serializeM = (m) => smsg(DinzBotz, m, store)

DinzBotz.before = (teks) => smsg(DinzBotz, m, store)

DinzBotz.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
DinzBotz.sendMessage(jid, buttonMessage, { quoted, ...options })
}

DinzBotz.sendKatalog = async (jid , title = '' , desc = '', gam , options = {}) =>{
let message = await prepareWAMessageMedia({ image: gam }, { upload: DinzBotz.waUploadToServer })
const tod = generateWAMessageFromContent(jid,
{"productMessage": {
"product": {
"productImage": message.imageMessage,
"productId": "9999",
"title": title,
"description": desc,
"currencyCode": "INR",
"priceAmount1000": "100000",
"url": `${websitex}`,
"productImageCount": 1,
"salePriceAmount1000": "0"
},
"businessOwnerJid": `${ownernumber}@s.whatsapp.net`
}
}, options)
return DinzBotz.relayMessage(jid, tod.message, {messageId: tod.key.id})
} 

DinzBotz.send5ButLoc = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
"hydratedContentText": text,
"locationMessage": {
"jpegThumbnail": img },
"hydratedFooterText": footer,
"hydratedButtons": but
}
}
}), options)
DinzBotz.relayMessage(jid, template.message, { messageId: template.key.id })
}
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name]: name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query, ...(apikeyqueryname ? {
        [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name]: name]
    }: {})
})): '')

DinzBotz.sendButImg = async (jid, path, teks, fke, but) => {
let img = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let fjejfjjjer = {
image: img, 
jpegThumbnail: img,
caption: teks,
fileLength: "1",
footer: fke,
buttons: but,
headerType: 4,
}
DinzBotz.sendMessage(jid, fjejfjjjer, { quoted: m })
}

            /**
             * Send Media/File with Automatic Type Specifier
             * @param {String} jid
             * @param {String|Buffer} path
             * @param {String} filename
             * @param {String} caption
             * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
             * @param {Boolean} ptt
             * @param {Object} options
             */
DinzBotz.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let type = await DinzBotz.getFile(path, true);
  let { res, data: file, filename: pathFile } = type;

  if (res && res.status !== 200 || file.length <= 65536) {
    try {
      throw {
        json: JSON.parse(file.toString())
      };
    } catch (e) {
      if (e.json) throw e.json;
    }
  }

  let opt = {
    filename
  };

  if (quoted) opt.quoted = quoted;
  if (!type) options.asDocument = true;

  let mtype = '',
    mimetype = type.mime,
    convert;

  if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
  else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
  else if (/video/.test(type.mime)) mtype = 'video';
  else if (/audio/.test(type.mime)) {
    convert = await (ptt ? toPTT : toAudio)(file, type.ext);
    file = convert.data;
    pathFile = convert.filename;
    mtype = 'audio';
    mimetype = 'audio/ogg; codecs=opus';
  } else mtype = 'document';

  if (options.asDocument) mtype = 'document';

  delete options.asSticker;
  delete options.asLocation;
  delete options.asVideo;
  delete options.asDocument;
  delete options.asImage;

  let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
  let m;

  try {
    m = await DinzBotz.sendMessage(jid, message, { ...opt, ...options });
  } catch (e) {
    //console.error(e)
    m = null;
  } finally {
    if (!m) m = await DinzBotz.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
    file = null;
    return m;
  }
}


DinzBotz.ev.on('group-participants.update', async (anu) => {
    try {
        let metadata = await DinzBotz.groupMetadata(anu.id)
        let participants = anu.participants
        let namagc = metadata.subject;
      let thumwel = `${global.wlcmimg}`;
      let thumleft = `${global.leftimg}`;
      let jumpahMem = metadata.participants.length;
        for (let num of participants) {
 var ppuser
    try {
      ppuser = await DinzBotz.profilePictureUrl(m.sender, 'image')
    } catch (err) {
      ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
    }

            // --- WELCOME ---
            if (anu.action == 'add') {
                // Baca Data Terbaru
                let welcomeData = []
                let setWelcomeData = {}
                try {
                    welcomeData = JSON.parse(fs.readFileSync('./database/sambutan/welcome.json'))
                    setWelcomeData = JSON.parse(fs.readFileSync('./database/sambutan/set_welcome.json'))
                } catch {}

                // Cek langsung ke array data (tanpa bikin variable isWelcome lagi)
                if (welcomeData.includes(anu.id)) {
                    
                    let teks = setWelcomeData[anu.id] || "Halo @user, Selamat datang di @group 👋"
                    let welcomeCaption = teks
                        .replace(/@user/g, `@${num.split('@')[0]}`)
                        .replace(/@group/g, metadata.subject)
                        .replace(/@desc/g, metadata.desc?.toString() || "Tidak ada deskripsi")

                    const welcomeCard = await new canvafy.WelcomeLeave()
                        .setAvatar(ppuser)
                        .setBackground("image", `${global.wlcmimg}`)
                        .setTitle("WELCOME")
                        .setDescription(`Welcome to ${metadata.subject}`)
                        .setBorder("#2a2e35")
                        .setAvatarBorder("#2a2e35")
                        .setOverlayOpacity(0.5)
                        .build();

                    await DinzBotz.sendMessage(anu.id, { image: welcomeCard, caption: welcomeCaption, mentions: [num] })
                }
            }

            // --- LEFT ---
            else if (anu.action == 'remove') {
                // Baca Data Terbaru
                let leftData = []
                let setLeftData = {}
                try {
                    leftData = JSON.parse(fs.readFileSync('./database/sambutan/left.json'))
                    setLeftData = JSON.parse(fs.readFileSync('./database/sambutan/set_left.json'))
                } catch {}

                // Cek langsung ke array data
                if (leftData.includes(anu.id)) {
                    
                    let teks = setLeftData[anu.id] || "Selamat tinggal @user 👋"
                    let goodbyeCaption = teks
                        .replace(/@user/g, `@${num.split('@')[0]}`)
                        .replace(/@group/g, metadata.subject)
                        .replace(/@desc/g, metadata.desc?.toString() || "Tidak ada deskripsi")

                    const goodbyeCard = await new canvafy.WelcomeLeave()
                        .setAvatar(ppuser)
                        .setBackground("image", `${global.leftimg}`)
                        .setTitle("GOODBYE")
                        .setDescription(`Leaving ${metadata.subject}`)
                        .setBorder("#2a2e35")
                        .setAvatarBorder("#2a2e35")
                        .setOverlayOpacity(0.5)
                        .build();

                    await DinzBotz.sendMessage(anu.id, { image: goodbyeCard, caption: goodbyeCaption, mentions: [num] })
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
})





DinzBotz.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
     return DinzBotz.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
      }
      let type = mime.split("/")[0]+"Message"
      if(mime === "application/pdf"){
     return DinzBotz.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "image"){
     return DinzBotz.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
      }
      if(mime.split("/")[0] === "video"){
     return DinzBotz.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "audio"){
     return DinzBotz.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
      }
      }
      
      /**
     * 
     * @param {*} jid 
     * @param {*} name 
     * @param [*] values 
     * @returns 
     */
    DinzBotz.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return DinzBotz.sendMessage(jid, { poll: { name, values, selectableCount }}) }

return DinzBotz

}

DinzBotzInd()

process.on('uncaughtException', function (err) {
console.log('Caught exception: ', err)
})
