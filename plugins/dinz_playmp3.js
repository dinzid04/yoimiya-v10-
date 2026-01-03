const fetch = require('node-fetch');
const handler = async (m, { DinzBotz, text }) => {
    if (!text) return m.reply('Masukkan judul lagu!\nContoh: .playmp3 Jakarta Hari Ini');
    
    try {
        // Try vreden.my.id API first
        await m.reply('🔍 Mencari lagu di sumber utama...');
        const vredenRes = await fetch(`https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(text)}`);
        const vredenData = await vredenRes.json();
        
        if (vredenData.result?.download?.url) {
            const { metadata, download } = vredenData.result;
            
            await DinzBotz.sendMessage(m.chat, {
                audio: { url: download.url },
                mimetype: 'audio/mpeg',
                fileName: download.filename,
                ptt: false,
                contextInfo: {
                    externalAdReply: {
                        title: metadata.title.slice(0, 60),
                        body: `${metadata.author?.name || 'Unknown'} • ${metadata.duration?.timestamp || '0:00'}`,
                        thumbnailUrl: metadata.thumbnail,
                        mediaUrl: metadata.url,
                        mediaType: 2,
                        sourceUrl: metadata.url
                    }
                }
            }, { quoted: m });
            
            return;
        }
        throw new Error('Sumber utama gagal');
        
    } catch (e) {
        console.error('Error with vreden API:', e);
        
        try {
            await m.reply('⚡ Mencoba sumber alternatif...');
            const diioffcRes = await fetch(`https://api.diioffc.web.id/api/search/ytplay?query=${encodeURIComponent(text)}`);
            const diioffcData = await diioffcRes.json();
            
            if (diioffcData.status && diioffcData.result?.download?.url) {
                const { title, author, duration, thumbnail, url, download } = diioffcData.result;
                
                await DinzBotz.sendMessage(m.chat, {
                    audio: { url: download.url },
                    mimetype: 'audio/mpeg',
                    fileName: download.filename || `${title}.mp3`,
                    ptt: false,
                    contextInfo: {
                        externalAdReply: {
                            title: title.slice(0, 60),
                            body: `${author?.name || 'Unknown'} • ${duration?.timestamp || '0:00'}`,
                            thumbnailUrl: thumbnail,
                            mediaUrl: url,
                            mediaType: 2,
                            sourceUrl: url
                        }
                    }
                }, { quoted: m });
                
                
                return;
            }
            throw new Error('Lagu tidak ditemukan di sumber alternatif');
            
        } catch (e2) {
            console.error('Error with diioffc API:', e2);
            m.reply('❌ Gagal menemukan lagu. Coba judul lain atau coba lagi nanti.\nError: ' + (e2.message || 'Unknown error'));
        }
    }
};

handler.help = ['playmp3 <judul>'];
handler.tags = ['music'];
handler.command = ['playv1', 'playmp3']

module.exports = handler;