

let handler = async (m, { DinzBotz }) => {
  if (!m.quoted) throw 'Reply gambar/video yang ingin Anda lihat'
  if (!m.quoted.viewOnce) throw 'Ini bukan pesan viewonce.'
  try {
  let media =  m.quoted.mtype == 'imageMessage' ? 'image' : 'video'
  let buffer = await m.quoted.download()
  if (/video/.test(media)) {
    return DinzBotz.sendFile(m.chat, buffer, 'media.mp4', m.quoted.text || '', m, false, false, { contextInfo: { isForwarded: true }})
  } else if (/image/.test(media)) {
    return DinzBotz.sendFile(m.chat, buffer, 'media.jpg', m.quoted.text || '', m, false, { contextInfo: { isForwarded: true }})
  }
} catch (e) {
		throw e
	}
}

handler.help = ['readviewonce']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'rvo', 'liat', 'readvo']
handler.premium = true
handler.register = false
handler.fail = null

module.exports = handler