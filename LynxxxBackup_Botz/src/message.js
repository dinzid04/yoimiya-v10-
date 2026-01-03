require('../settings');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
    fromBuffer
} = require('file-type');
const chalk = require('chalk');
const FileType = require('file-type');
const PhoneNumber = require('awesome-phonenumber');

const fkontak = {
    key: {
        remoteJid: "status@broadcast",
        participant: '0@s.whatsapp.net',
    },
    message: {
        "extendedTextMessage": {
            "text": 'Irasshaimase...' // Menggunakan pesan yang dikirim oleh pengirim
        }
    }
}

const fkontak2 = {
    key: {
        remoteJid: "status@broadcast",
        participant: '0@s.whatsapp.net',
    },
    message: {
        "extendedTextMessage": {
            "text": 'Sayounara..' // Menggunakan pesan yang dikirim oleh pengirim
        }
    }
}

const fkontak1 = {
    key: {
        remoteJid: "status@broadcast",
        participant: '0@s.whatsapp.net',
    },
    message: {
        "extendedTextMessage": {
            "text": `${chfooter}` // Menggunakan pesan yang dikirim oleh pengirim
        }
    }
}

// Taruh ini di baris paling atas, di bawah require modules
const lidPath = './database/DataUserLid.json';
if (!fs.existsSync(lidPath)) {
    fs.writeFileSync(lidPath, JSON.stringify({}));
}
// Load database SEKALI SAJA di memori saat bot nyala
let lidDatabase = JSON.parse(fs.readFileSync(lidPath));


const {
    generateWelcomeCard
} = require("../lib/welcome")

const prem = require('./premium');
const {
    imageToWebp,
    videoToWebp,
    writeExif
} = require('../lib/exif');
const premium = JSON.parse(fs.readFileSync('./database/premium.json'));
const {
    isUrl,
    getGroupAdmins,
    generateMessageTag,
    getBuffer,
    getSizeMedia,
    fetchJson,
    sleep,
    getTypeUrlMedia
} = require('../lib/function');
const {
    jidNormalizedUser,
    proto,
    getBinaryNodeChildren,
    getBinaryNodeChild,
    generateWAMessageContent,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    delay,
    areJidsSameUser,
    extractMessageContent,
    generateMessageID,
    downloadContentFromMessage,
    generateWAMessageFromContent,
    jidDecode,
    generateWAMessage,
    toBuffer,
    getContentType,
    getDevice
} = require('@whiskeysockets/baileys');

async function GroupUpdate(naze, update, store) {
    try {
        for (let n of update) {
            if (store.groupMetadata[n.id]) {
                store.groupMetadata[n.id] = {
                    ...(store.groupMetadata[n.id] || {}),
                    ...(n || {})
                }
            }
        }
    } catch (e) {
        throw e;
    }
}

async function GroupParticipantsUpdate(naze, {
    id,
    participants,
    action
}, store) {
    try {
        const groupData = global.db.groups[id] = global.db.groups[id] || {};
        groupData.text = groupData.text || {};

        const metadata = store.groupMetadata?.[id];
        if (!metadata || !groupData.welcome) return;

        for (let n of participants) {
            let profile;
            try {
                profile = await naze.profilePictureUrl(n, 'image');
            } catch {
                profile = 'https://telegra.ph/file/95670d63378f7f4210f03.png';
            }

            const name = await naze.getName(n);

            // parsing teks dengan placeholder dinamis
            const parseText = (raw, userJid) => {
                return (raw || '')
                    .replace(/@subject/g, metadata.subject || '')
                    .replace(/@desc/g, metadata.desc || '')
                    .replace(/@membercount/g, metadata.participants.length.toString())
                    .replace(/@admin/g, '@' + naze.user.id.split('@')[0])
                    .replace(/@user|@/g, '@' + userJid.split('@')[0]);
            };

            // =============== WELCOME ===============
            if (action === 'add') {
                const teks = parseText(groupData.text.setwelcome || '👋 Selamat datang @user di @subject!', n);
                const pathImage = await generateWelcomeCard({
                    title: 'WELCOME',
                    avatar: profile,
                    name: name,
                    message: `I hope you enjoy it here!`
                });

                await naze.sendMessage(id, {
                    image: {
                        url: pathImage
                    },
                    caption: teks,
                    mentions: [n]
                }, {
                    quoted: fkontak1
                });

                fs.unlinkSync(pathImage);
                metadata.participants.push(...participants.map(jid => ({
                    id: jidNormalizedUser(jid),
                    admin: null
                })));
            }

            // =============== LEAVE ===============
            else if (action === 'remove') {
                const teks = parseText(groupData.text.setleave || '👋 Sayonara @user! Terima kasih di @subject', n);
                const pathImage = await generateWelcomeCard({
                    title: 'GOODBYE',
                    avatar: profile,
                    name: name,
                    message: `Bye, see you later!`
                });

                await naze.sendMessage(id, {
                    image: {
                        url: pathImage
                    },
                    caption: teks,
                    mentions: [n]
                }, {
                    quoted: fkontak2
                });

                fs.unlinkSync(pathImage);
                metadata.participants = metadata.participants.filter(p => !participants.includes(jidNormalizedUser(p.id)));
            }

            // =============== PROMOTE ===============
            else if (action === 'promote') {
                const teks = parseText(groupData.text.setpromote || '🎉 @user telah menjadi admin di @subject!', n);

                await naze.sendMessage(id, {
                    image: {
                        url: profile
                    },
                    caption: teks,
                    mentions: [n]
                }, {
                    quoted: fkontak1
                });

                for (let p of metadata.participants) {
                    if (participants.includes(jidNormalizedUser(p.id))) p.admin = 'admin';
                }
            }

            // =============== DEMOTE ===============
            else if (action === 'demote') {
                const teks = parseText(groupData.text.setdemote || '⚠️ @user diturunkan dari admin di @subject', n);

                await naze.sendMessage(id, {
                    image: {
                        url: profile
                    },
                    caption: teks,
                    mentions: [n]
                }, {
                    quoted: fkontak1
                });

                for (let p of metadata.participants) {
                    if (participants.includes(jidNormalizedUser(p.id))) p.admin = null;
                }
            }
        }
    } catch (e) {
        console.error('GroupParticipantsUpdate Error:', e);
    }
}

async function LoadDataBase(naze, m) {
    try {
        const botNumber = await naze.decodeJid(naze.user.id);
        const isNumber = x => typeof x === 'number' && !isNaN(x)
        const isBoolean = x => typeof x === 'boolean' && Boolean(x)
        let user = global.db.users[m.sender]
        let setBot = global.db.set[botNumber]
        let limitUser = user ? (user.vip ? global.limit.vip : prem.checkPremiumUser(m.sender, premium) ? global.limit.premium : global.limit.free) : prem.checkPremiumUser(m.sender, premium) ? global.limit.premium : global.limit.free
        let uangUser = user ? (user.vip ? global.uang.vip : prem.checkPremiumUser(m.sender, premium) ? global.uang.premium : global.uang.free) : prem.checkPremiumUser(m.sender, premium) ? global.uang.premium : global.uang.free

        if (typeof setBot !== 'object') global.db.set[botNumber] = {}
        if (setBot) {
            if (!('lang' in setBot)) setBot.lang = 'id'
            if (!('limit' in setBot)) setBot.limit = 0
            if (!('uang' in setBot)) setBot.uang = 0
            if (!('status' in setBot)) setBot.status = 0
            if (!('anticall' in setBot)) setBot.anticall = false
            if (!('autobio' in setBot)) setBot.autobio = false
            if (!('autoread' in setBot)) setBot.autoread = true
            if (!('autotyping' in setBot)) setBot.autotyping = true
            if (!('readsw' in setBot)) setBot.readsw = false
            if (!('multiprefix' in setBot)) setBot.multiprefix = false
            // PERBAIKAN BUG: Properti di bawah ini salah menunjuk ke 'multiprefix'
            if (!('owneronly' in setBot)) setBot.owneronly = false
            if (!('adminonly' in setBot)) setBot.adminonly = false
            if (!('gconly' in setBot)) setBot.gconly = false
            if (!('pconly' in setBot)) setBot.pconly = false
            if (!('template' in setBot)) setBot.template = 'textMessage'
        } else {
            global.db.set[botNumber] = {
                lang: 'id',
                limit: 0,
                uang: 0,
                status: 0,
                anticall: false,
                autobio: false,
                autoread: true,
                autotyping: true,
                readsw: false,
                multiprefix: false,
                owneronly: false,
                adminonly: false,
                gconly: false,
                pconly: false,
                template: 'textMessage',
            }
        }

        if (typeof user !== 'object') global.db.users[m.sender] = {}
        if (user) {
            // PERBAIKAN BUG: Properti ini salah menunjuk ke 'afkReason'
            if (!('vip' in user)) user.vip = false
            if (!isNumber(user.afkTime)) user.afkTime = -1
            if (!('afkReason' in user)) user.afkReason = ''
            if (!isNumber(user.limit)) user.limit = limitUser
            if (!('uang' in user)) user.uang = uangUser
            if (!('lastclaim' in user)) user.lastclaim = new Date * 1
            if (!('lastbegal' in user)) user.lastbegal = new Date * 1
            if (!('lastrampok' in user)) user.lastrampok = new Date * 1

            // BARU: Menambahkan data registrasi jika belum ada
            if (!('registered' in user)) user.registered = false
            if (!('name' in user)) user.name = ''
            if (!isNumber(user.age)) user.age = 0
            if (!isNumber(user.regTime)) user.regTime = -1

        } else {
            global.db.users[m.sender] = {
                vip: false,
                afkTime: -1,
                afkReason: '',
                limit: limitUser,
                uang: uangUser,
                lastclaim: new Date * 1,
                lastbegal: new Date * 1,
                lastrampok: new Date * 1,

                // BARU: Menambahkan data registrasi untuk user baru
                registered: false,
                name: '',
                age: 0,
                regTime: -1
            }
        }

        if (m.isGroup) {
            let group = global.db.groups[m.chat];
            if (typeof group !== 'object') global.db.groups[m.chat] = {};

            if (group) {
                if (!('nsfw' in group)) group.nsfw = false;
                if (!('mute' in group)) group.mute = false;
                if (!('setinfo' in group)) group.setinfo = true;
                if (!('antilink' in group)) group.antilink = false
                if (!('antitoxic' in group)) group.antitoxic = false;
                if (!('welcome' in group)) group.welcome = false;
                if (!('antivirtex' in group)) group.antivirtex = false;
                if (!('antidelete' in group)) group.antidelete = false;
                if (!('waktusholat' in group)) group.waktusholat = false;
                if (!('antivideo' in group)) group.antivideo = false;
                if (!('antiimage' in group)) group.antiimage = false;
                if (!('antiaudio' in group)) group.antiaudio = false;
                if (!('antisticker' in group)) group.antisticker = false;
                if (!('antidocument' in group)) group.antidocument = false;
                if (!('antiedit' in group)) group.antiedit = false;
                if (!('antipromosi' in group)) group.antipromosi = false;
                if (!('antinsfw' in group)) group.antinsfw = false;
                if (!('antitagsw' in group)) group.antitagsw = false;
                if (!('aksescpanel' in group)) group.aksescpanel = false;
                if (!('text' in group)) group.text = {
                    setwelcome: '',
                    setleave: '',
                    setpromote: '',
                    setdemote: ''
                };
            } else {
                global.db.groups[m.chat] = {
                    nsfw: false,
                    mute: false,
                    setinfo: true,
                    antilink: false,
                    antitoxic: false,
                    welcome: false,
                    antivirtex: false,
                    antidelete: false,
                    waktusholat: false,
                    antivideo: false,
                    antiimage: false,
                    antiaudio: false,
                    antisticker: false,
                    antidocument: false,
                    antiedit: false,
                    antipromosi: false,
                    antinsfw: false,
                    antitagsw: false,
                    aksescpanel: false,
                    text: {
                        setwelcome: '',
                        setleave: '',
                        setpromote: '',
                        setdemote: ''
                    }
                };
            }
        }
    } catch (e) {
        throw e;
    }
}


async function MessagesUpsert(naze, message, store) {
    try {
        let botNumber = await naze.decodeJid(naze.user.id);
        const msg = message.messages[0];
        if (store.groupMetadata && Object.keys(store.groupMetadata).length === 0) store.groupMetadata = await naze.groupFetchAllParticipating()
        const type = msg.message ? (getContentType(msg.message) || Object.keys(msg.message)[0]) : '';
        if (!msg.key.fromMe && !msg.message && message.type === 'notify') return
        const m = await Serialize(naze, msg, store)
        require('../naze')(naze, m, message, store);
        if (global.db.set && global.db.set[botNumber] && global.db.set[botNumber].readsw) {
            if (msg.key.remoteJid === 'status@broadcast') {
                await naze.readMessages([msg.key]);
                if (/protocolMessage/i.test(type)) naze.sendFromOwner(global.owner, 'Status dari @' + msg.key.participant.split('@')[0] + ' Telah dihapus', msg, {
                    mentions: [msg.key.participant]
                });
                if (/(audioMessage|imageMessage|videoMessage|extendedTextMessage)/i.test(type)) {
                    let keke = (type == 'extendedTextMessage') ? `Story Teks Berisi : ${msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : ''}` : (type == 'imageMessage') ? `Story Gambar ${msg.message.imageMessage.caption ? 'dengan Caption : ' + msg.message.imageMessage.caption : ''}` : (type == 'videoMessage') ? `Story Video ${msg.message.videoMessage.caption ? 'dengan Caption : ' + msg.message.videoMessage.caption : ''}` : (type == 'audioMessage') ? 'Story Audio' : '\nTidak diketahui cek saja langsung'
                    await naze.sendFromOwner(global.owner, `Melihat story dari @${msg.key.participant.split('@')[0]}\n${keke}`, msg, {
                        mentions: [msg.key.participant]
                    });
                }
            }
        }
    } catch (e) {
        throw e;
    }
}

async function Solving(naze, store) {
    naze.public = true

    naze.serializeM = (m) => MessagesUpsert(naze, m, store)

    naze.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    naze.findJidByLid = (lid, store) => {
        for (const contact of Object.values(store.contacts)) {
            if (contact.lid === lid) {
                return contact.id;
            }
        }
        return null;
    }

    naze.getName = (jid, withoutContact = false) => {
        const id = naze.decodeJid(jid);
        if (id.endsWith('@g.us')) {
            const groupInfo = store.contacts[id] || naze.groupMetadata(id) || {};
            return Promise.resolve(groupInfo.name || groupInfo.subject || PhoneNumber('+' + id.replace('@g.us', '')).getNumber('international'));
        } else {
            if (id === '0@s.whatsapp.net') {
                return 'WhatsApp';
            }
            const contactInfo = store.contacts[id] || {};
            return withoutContact ? '' : contactInfo.name || contactInfo.subject || contactInfo.verifiedName || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international');
        }
    }

    naze.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = []
        for (let i of kon) {
            list.push({
                displayName: await naze.getName(i + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await naze.getName(i + '@s.whatsapp.net')}\nFN:${await naze.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.ADR:;;Indonesia;;;;\nitem2.X-ABLabel:Region\nEND:VCARD` //vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await naze.getName(i + '@s.whatsapp.net')}\nFN:${await naze.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:whatsapp@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://instagram.com/naze_dev\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
            })
        }
        naze.sendMessage(jid, {
            contacts: {
                displayName: `${list.length} Kontak`,
                contacts: list
            },
            ...opts
        }, {
            quoted
        })
    }

    naze.profilePictureUrl = async (jid, type = 'image', timeoutMs) => {
        const result = await naze.query({
            tag: 'iq',
            attrs: {
                target: jidNormalizedUser(jid),
                to: '@s.whatsapp.net',
                type: 'get',
                xmlns: 'w:profile:picture'
            },
            content: [{
                tag: 'picture',
                attrs: {
                    type,
                    query: 'url'
                },
            }]
        }, timeoutMs);
        const child = getBinaryNodeChild(result, 'picture');
        return child?.attrs?.url;
    }

    naze.setStatus = (status) => {
        naze.query({
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

    naze.sendPoll = (jid, name = '', values = [], selectableCount = 1) => {
        return naze.sendMessage(jid, {
            poll: {
                name,
                values,
                selectableCount
            }
        })
    }

    naze.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
        async function getFileUrl(res, mime) {
            if (mime && mime.includes('gif')) {
                return naze.sendMessage(jid, {
                    video: res.data,
                    caption: caption,
                    gifPlayback: true,
                    ...options
                }, {
                    quoted
                });
            } else if (mime && mime === 'application/pdf') {
                return naze.sendMessage(jid, {
                    document: res.data,
                    mimetype: 'application/pdf',
                    caption: caption,
                    ...options
                }, {
                    quoted
                });
            } else if (mime && mime.includes('image')) {
                return naze.sendMessage(jid, {
                    image: res.data,
                    caption: caption,
                    ...options
                }, {
                    quoted
                });
            } else if (mime && mime.includes('video')) {
                return naze.sendMessage(jid, {
                    video: res.data,
                    caption: caption,
                    mimetype: 'video/mp4',
                    ...options
                }, {
                    quoted
                });
            } else if (mime && mime.includes('audio')) {
                return naze.sendMessage(jid, {
                    audio: res.data,
                    mimetype: 'audio/mpeg',
                    ...options
                }, {
                    quoted
                });
            }
        }

        const res = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        let mime = res.headers['content-type'];
        if (!mime || mime.includes('octet-stream')) {
            const fileType = await FileType.fromBuffer(res.data);
            mime = fileType ? fileType.mime : null;
        }
        const hasil = await getFileUrl(res, mime);
        return hasil
    }

    naze.sendFakeLink = async (jid, text, title, body, thumbnail, myweb, options = {}) => {
        await naze.sendMessage(jid, {
            text: text,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: body,
                    previewType: 'PHOTO',
                    thumbnailUrl: myweb,
                    thumbnail: thumbnail,
                    sourceUrl: myweb
                }
            }
        }, {
            ...options
        })
    }

    naze.sendFromOwner = async (jid, text, quoted, options = {}) => {
        for (const a of jid) {
            await naze.sendMessage(a.replace(/[^0-9]/g, '') + '@s.whatsapp.net', {
                text,
                ...options
            }, {
                quoted
            });
        }
    }

    naze.sendTextMentions = async (jid, text, quoted, options = {}) => naze.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })

    naze.sendAsSticker = async (jid, path, quoted, options = {}) => {
        const buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        const result = await writeExif(buff, options);
        await naze.sendMessage(jid, {
            sticker: {
                url: result
            },
            ...options
        }, {
            quoted
        });
        return buff;
    }

    naze.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        const quoted = message.msg || message;
        const mime = quoted.mimetype || '';
        const messageType = (message.mtype || mime.split('/')[0]).replace(/Message/gi, '');
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        const type = await FileType.fromBuffer(buffer);
        const trueFileName = attachExtension ? `./database/sampah/${filename ? filename : Date.now()}.${type.ext}` : filename;
        await fs.promises.writeFile(trueFileName, buffer);
        return trueFileName;
    }

    naze.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../database/sampah/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        }
    }

    naze.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        const {
            mime,
            data,
            filename
        } = await naze.getFile(path, true);
        const isWebpSticker = options.asSticker || /webp/.test(mime);
        let type = 'document',
            mimetype = mime,
            pathFile = filename;
        if (isWebpSticker) {
            const {
                writeExif
            } = require('../lib/exif');
            const media = {
                mimetype: mime,
                data
            };
            pathFile = await writeExif(media, {
                packname: options.packname || global.packname,
                author: options.author || global.author,
                categories: options.categories || [],
            })
            await fs.promises.unlink(filename);
            type = 'sticker';
            mimetype = 'image/webp';
        } else if (/image|video|audio/.test(mime)) {
            type = mime.split('/')[0];
        }
        await naze.sendMessage(jid, {
            [type]: {
                url: pathFile
            },
            caption,
            mimetype,
            fileName,
            ...options
        }, {
            quoted,
            ...options
        });
        return fs.promises.unlink(pathFile);
    }

    naze.sendButtonMsg = async (jid, body = '', footer = '', title = '', media, buttons = [], quoted, options = {}) => {
        const {
            type,
            data,
            url,
            ...rest
        } = media || {}
        const msg = await generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: body
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: footer
                        }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title,
                            hasMediaAttachment: !!media,
                            ...(media ? await generateWAMessageContent({
                                [type]: url ? {
                                    url
                                } : data,
                                ...rest
                            }, {
                                upload: naze.waUploadToServer
                            }) : {})
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: buttons.map(a => {
                                return {
                                    name: a.name,
                                    buttonParamsJson: JSON.stringify(a.buttonParamsJson ? (typeof a.buttonParamsJson === 'string' ? JSON.parse(a.buttonParamsJson) : a.buttonParamsJson) : '')
                                }
                            })
                        }),
                        contextInfo: {
                            forwardingScore: 10,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: global.my.ch,
                                serverMessageId: null,
                                newsletterName: 'Join For More Info'
                            },
                            mentionedJid: options.mentions || [],
                            ...options.contextInfo,
                            ...(quoted ? {
                                stanzaId: quoted.key.id,
                                remoteJid: quoted.key.remoteJid,
                                participant: quoted.key.participant || quoted.key.remoteJid,
                                fromMe: quoted.key.fromMe,
                                quotedMessage: quoted.message
                            } : {})
                        }
                    })
                }
            }
        }, {});
        const hasil = await naze.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });
        return hasil
    }

    naze.sendCarouselMsg = async (jid, body = '', footer = '', cards = [], options = {}) => {
        async function getImageMsg(url) {
            const {
                imageMessage
            } = await generateWAMessageContent({
                image: {
                    url
                }
            }, {
                upload: naze.waUploadToServer
            });
            return imageMessage;
        }
        const cardPromises = cards.map(async (a) => {
            const imageMessage = await getImageMsg(a.url);
            return {
                header: {
                    imageMessage: imageMessage,
                    hasMediaAttachment: true
                },
                body: {
                    text: a.body
                },
                footer: {
                    text: a.footer
                },
                nativeFlowMessage: {
                    buttons: a.buttons.map(b => ({
                        name: b.name,
                        buttonParamsJson: JSON.stringify(b.buttonParamsJson ? JSON.parse(b.buttonParamsJson) : '')
                    }))
                }
            };
        });

        const cardResults = await Promise.all(cardPromises);
        const msg = await generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: body
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: footer
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({
                            cards: cardResults,
                            messageVersion: 1
                        })
                    })
                }
            }
        }, {});
        const hasil = await naze.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });
        return hasil
    }

    return naze
}

/*
 * Create By Naze
 * Follow https://github.com/nazedev
 * Whatsapp : wa.me/6282113821188
 */

async function Serialize(naze, m, store) {
    const botLid = naze.decodeJid(naze.user.lid);
    const botNumber = naze.decodeJid(naze.user.id);

   function findJidByLid(lid, store) {
        for (const [jid, data] of Object.entries(store.contacts || {})) {
            if (data?.lid === lid) return jid
        }
        return null
    }

    if (!m) return m
    if (m.key) {
        m.id = m.key.id
        m.chat = m.key.remoteJid
        
        m.rawJid = m.key.participant || m.key.remoteJid;
        if (m.rawJid && m.rawJid.endsWith('@lid')) {
            store.contacts[m.sender] = {
                ...(store.contacts[m.sender] || {}),
                id: m.sender,
                lid: m.rawJid,
                name: m.pushName || store.contacts[m.sender]?.name || ''
            };
        }
        m.fromMe = m.key.fromMe
        m.isBot = ['HSK', 'BAE', 'B1E', '3EB0', 'B24E', 'WA'].some(a => m.id.startsWith(a) && [12, 16, 20, 22, 40].includes(m.id.length)) || /(.)\1{5,}|[^a-zA-Z0-9]|[^0-9A-F]/.test(m.id) || false
        m.isGroup = m.chat.endsWith('@g.us')
        if (!m.isGroup && m.chat.endsWith('@lid')) m.chat = naze.findJidByLid(m.chat, store) || m.chat;

        // --- BAGIAN YANG DIHAPUS: Pembacaan File Sync ---
        // (Sudah dipindah ke atas global variable)

        if (m.isGroup) {
            let rawSender = naze.decodeJid(m.fromMe || m.key.participant || m.participant)

            if (!store.groupMetadata) store.groupMetadata = await naze.groupFetchAllParticipating().catch(e => ({}));

            let metadata = store.groupMetadata[m.chat] ?
                store.groupMetadata[m.chat] :
                (store.groupMetadata[m.chat] = await naze.groupMetadata(m.chat).catch(e => ({})));

            if (!metadata) {
                metadata = await naze.groupMetadata(m.chat).catch(e => ({}));
                store.groupMetadata[m.chat] = metadata;
            }

            m.metadata = metadata;
            m.metadata.size = (metadata.participants || []).length;
            const participants = metadata.participants || [];

            // ==========================================
            // 🔥 AUTO FIX LID + SAVE SIMPLE (OPTIMIZED)
            // ==========================================
            let fixedSender = rawSender;

            if (rawSender && rawSender.endsWith('@lid')) {
                // 1. CEK MEMORY DULU (Cepat)
                if (lidDatabase[rawSender] && lidDatabase[rawSender].jid) {
                    fixedSender = lidDatabase[rawSender].jid;
                } 
                // 2. FALLBACK KE METADATA
                else {
                    if (participants && participants.length > 0) {
                        const found = participants.find(p =>
                            p.lid === rawSender || 
                            p.id === rawSender ||
                            p.jid === rawSender
                        );
                        const realJid = found?.jid || found?.id;

                        // 3. SIMPAN JIKA DATA BARU (Agar tidak spam write file)
                        if (realJid && !realJid.endsWith('@lid')) {
                            fixedSender = realJid;
                            
                            // Update Memory
                            lidDatabase[rawSender] = { jid: realJid };

                            // Simpan ke file (Hanya jika ada data baru)
                            try {
                                fs.writeFileSync(lidPath, JSON.stringify(lidDatabase, null, 2));
                            } catch (err) {
                                console.error('Gagal save DataUserLid:', err);
                            }
                        }
                    }
                }
            }
            m.sender = fixedSender;

            // ============================
            // STATUS ADMIN / OWNER / BOT
            // ============================
            m.admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.jid || p.id);
            m.groupOwner = participants.find(p => p.admin === 'superadmin')?.jid || null;
            m.isAdmin = m.admins.includes(m.sender);
            m.isGroupOwner = m.groupOwner === m.sender;
            m.participant = m.key.participant;
            m.isBotAdmin = m.admins.includes(botNumber) || m.admins.includes(botLid);

        } else {
            m.sender = naze.decodeJid(m.fromMe && naze.user.id || m.key.participant || m.chat || '')
        }


    }
    if (m.message) {
        m.type = getContentType(m.message) || Object.keys(m.message)[0]
        m.msg = (/viewOnceMessage|viewOnceMessageV2Extension|editedMessage|ephemeralMessage/i.test(m.type) ? m.message[m.type].message[getContentType(m.message[m.type].message)] : (extractMessageContent(m.message[m.type]) || m.message[m.type]))
        m.body = m.message?.conversation || m.msg?.text || m.msg?.conversation || m.msg?.caption || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || m.msg?.selectedId || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || m.msg?.name || ''
    // === CUSTOM FORCE LID BY USER ===
    let rawMentions = m.msg?.contextInfo?.mentionedJid || []
    
    // Kita looping semua tag, ambil nomor depannya saja, lalu tempel @lid
    m.mentionedJid = rawMentions.map(jid => {
        // jid.split('@')[0] = mengambil angka (misal: 628xxx)
        // + '@lid' = menambahkan akhiran lid
        return jid ? jid.split('@')[0] + '@lid' : null
    }).filter(v => v) // filter untuk membuang yang null/kosong

    m.text = m.msg?.text || m.msg?.caption || m.message?.conversation || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || '';
    m.prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(m.body) ? m.body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : /[\uD800-\uDBFF][\uDC00-\uDFFF]/gi.test(m.body) ? m.body.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/gi)[0] : ''
    m.command = m.body && m.body.replace(m.prefix, '').trim().split(/ +/).shift()
    m.args = m.body?.trim().replace(new RegExp("^" + m.prefix?.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, '\\$&'), 'i'), '').replace(m.command, '').split(/ +/).filter(a => a) || []
    m.device = getDevice(m.id)
    m.expiration = m.msg?.contextInfo?.expiration || m?.metadata?.ephemeralDuration || store?.messages?.[m.chat]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0
    m.timestamp = (typeof m.messageTimestamp === "number" ? m.messageTimestamp : m.messageTimestamp.low ? m.messageTimestamp.low : m.messageTimestamp.high) || m.msg.timestampMs * 1000
    m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath
    if (m.isMedia) {
        m.mime = m.msg?.mimetype
        m.size = m.msg?.fileLength
        m.height = m.msg?.height || ''
        m.width = m.msg?.width || ''
        if (/webp/i.test(m.mime)) {
            m.isAnimated = m.msg?.isAnimated
        }
    }
    m.quoted = m.msg?.contextInfo?.quotedMessage || null
    if (m.quoted) {
        m.quoted.message = extractMessageContent(m.msg?.contextInfo?.quotedMessage)
        m.quoted.type = getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0]
        m.quoted.id = m.msg.contextInfo.stanzaId
        m.quoted.device = getDevice(m.quoted.id)
        m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
        m.quoted.isBot = m.quoted.id ? ['HSK', 'BAE', 'B1E', '3EB0', 'WA'].some(a => m.quoted.id.startsWith(a) && [12, 16, 20, 22, 40].includes(m.quoted.id.length)) : false
        m.quoted.sender = naze.decodeJid(m.msg.contextInfo.participant)
        m.quoted.fromMe = m.quoted.sender === naze.decodeJid(naze.user.id)
        m.quoted.text = m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
        m.quoted.msg = extractMessageContent(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type]
        m.quoted.mentionedJid = m.quoted?.msg?.contextInfo?.mentionedJid || []
        m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || ''
        m.getQuotedObj = async () => {
            if (!m.quoted.id) return false
            let q = await store.loadMessage(m.chat, m.quoted.id, naze)
            return await Serialize(naze, q, store)
        }
        m.quoted.key = {
            remoteJid: m.msg?.contextInfo?.remoteJid || m.chat,
            participant: m.quoted.sender,
            fromMe: areJidsSameUser(naze.decodeJid(m.msg?.contextInfo?.participant), naze.decodeJid(naze?.user?.id)),
            id: m.msg?.contextInfo?.stanzaId
        }
        m.quoted.isGroup = m.quoted.chat.endsWith('@g.us')
        m.quoted.mentions = m.quoted.msg?.contextInfo?.mentionedJid || []
        m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || ''
        m.quoted.prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(m.quoted.body) ? m.quoted.body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : /[\uD800-\uDBFF][\uDC00-\uDFFF]/gi.test(m.quoted.body) ? m.quoted.body.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/gi)[0] : ''
        m.quoted.command = m.quoted.body && m.quoted.body.replace(m.quoted.prefix, '').trim().split(/ +/).shift()
        m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath
        if (m.quoted.isMedia) {
            m.quoted.mime = m.quoted.msg?.mimetype
            m.quoted.size = m.quoted.msg?.fileLength
            m.quoted.height = m.quoted.msg?.height || ''
            m.quoted.width = m.quoted.msg?.width || ''
            if (/webp/i.test(m.quoted.mime)) {
                m.quoted.isAnimated = m?.quoted?.msg?.isAnimated || false
            }
        }
        m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
            key: {
                remoteJid: m.quoted.chat,
                fromMe: m.quoted.fromMe,
                id: m.quoted.id
            },
            message: m.quoted,
            ...(m.isGroup ? {
                participant: m.quoted.sender
            } : {})
        })
        m.quoted.download = async () => {
            const quotednya = m.quoted.msg || m.quoted;
            const mimenya = quotednya.mimetype || '';
            const messageType = (m.quoted.type || mimenya.split('/')[0]).replace(/Message/gi, '');
            const stream = await downloadContentFromMessage(quotednya, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            return buffer
        }
        m.quoted.delete = () => {
            naze.sendMessage(m.quoted.chat, {
                delete: {
                    remoteJid: m.quoted.chat,
                    fromMe: m.isBotAdmins ? false : true,
                    id: m.quoted.id,
                    participant: m.quoted.sender
                }
            })
        }
    }
}

m.download = async () => {
    const quotednya = m.msg || m.quoted;
    const mimenya = quotednya.mimetype || '';
    const messageType = (m.type || mimenya.split('/')[0]).replace(/Message/gi, '');
    const stream = await downloadContentFromMessage(quotednya, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer
}

m.copy = () => Serialize(naze, proto.WebMessageInfo.fromObject(proto.WebMessageInfo.toObject(m)))

m.reply = async (text, options = {}) => {
    const chatId = options?.chat ? options.chat : m.chat
    const caption = options.caption || '';
    const quoted = options?.quoted ? options.quoted : m
    try {
        if (/^https?:\/\//.test(text)) {
            const data = await axios.get(text, {
                responseType: 'arraybuffer'
            });
            const mime = data.headers['content-type'] || (await FileType.fromBuffer(data.data)).mime
            if (/gif|image|video|audio|pdf|stream/i.test(mime)) {
                return naze.sendFileUrl(chatId, text, caption, quoted, options)
            } else {
                return naze.sendMessage(chatId, {
                    text: text,
                    mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
                    ...options
                }, {
                    quoted
                })
            }
        } else {
            return naze.sendMessage(chatId, {
                text: text,
                mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
                ...options
            }, {
                quoted
            })
        }
    } catch (e) {
        return naze.sendMessage(chatId, {
            text: text,
            mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
            ...options
        }, {
            quoted
        })
    }
}
return m
}

module.exports = {
    GroupUpdate,
    GroupParticipantsUpdate,
    LoadDataBase,
    MessagesUpsert,
    Solving
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
});