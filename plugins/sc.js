/*
* Nama fitur : Soundcloud Downloader
* Type : Plugin Esm
* Sumber : https://whatsapp.com/channel/0029Vb6Zs8yEgGfRQWWWp639
* Author : ZenzzXD
*/

const fetch = require ('node-fetch')

const sc = {
  _tools: {
    async hit(hitDescription, url, options, returnType = "text") {
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw Error(`${response.status} ${response.statusText} ${(await response.text() || `(respond body kosong)`).substring(0, 100)}...`)
        try {
          if (returnType === "text") return { data: await response.text(), response }
          if (returnType === "json") return { data: await response.json(), response }
          if (returnType == "buffer") return { data: Buffer.from(await response.arrayBuffer()), response }
          throw Error(`invalid param retunt type. pilih text/json`)
        } catch (e) {
          throw Error(`gagal mengubah response menjadi ${returnType}\n${e.message}`)
        }
      } catch (e) {
        throw Error(`gagal hit. ${hitDescription}.\n${e.message}`)
      }
    },
    validateString: (desc, val) => {
      if (typeof val !== "string" || val?.trim()?.length === 0) throw Error(`${desc} harus string dan gak boleh kosong!`)
    }
  },

  get baseHeaders() {
    return {
      'accept-encoding': 'gzip, deflate, br, zstd',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
    }
  },

  async getTrackAuthAndStreamUrlAndKey(url) {
    const headers = this.baseHeaders
    const { data: html } = await this._tools.hit(`homepage`, url, { headers })
    const m_json = html?.match(/<script>window.__sc_hydration = (.+?);<\/script>/)?.[1]
    if (!m_json) throw Error(`gagal match regex json`)
    const json = JSON.parse(m_json)
    const ddjsKey = html.match(/window\.ddjskey = '(.+?)';/)?.[1]
    const track_authorization = json?.[7]?.data?.track_authorization
    const stream_url = json?.[7]?.data?.media?.transcodings?.[3]?.url
    if (!ddjsKey || !track_authorization || !stream_url) throw Error('data tidak lengkap')
    const title = json?.[7]?.data?.title || `no title`
    const image = html.match(/og:image" content="(.+?)">/)?.[1]
    const username = json?.[7]?.data?.user?.username
    const playbackCount = json?.[7]?.data?.playback_count || 0
    const likesCount = json?.[7]?.data.likes_count || 0
    const commentsCount = json?.[7]?.data?.comment_count || 0
    const displayDate = json?.[7].data.display_date
    return { ddjsKey, track_authorization, stream_url, soundMetadata: { title, image, username, playbackCount, likesCount, commentsCount, displayDate } }
  },

  async getDatadome({ ddjsKey }) {
    const headers = { "Referer": "https://soundcloud.com/", ...this.baseHeaders }
    const body = new URLSearchParams({ ddk: ddjsKey })
    const url = 'https://dwt.soundcloud.com/js/'
    const { data: json } = await this._tools.hit(`get datadome`, url, { headers, body, method: "post" }, `json`)
    const value = json?.cookie?.split("; ")?.[0]?.split('=')?.[1]
    if (!value) throw Error(`datadome kosong`)
    return { datadome: value }
  },

  async getClientId() {
    const { data: js } = await this._tools.hit(`client id`, 'https://a-v2.sndcdn.com/assets/0-b9979956.js', { headers: this.baseHeaders })
    const client_id = js.match(/"client_id=(.+?)"\)/)?.[1]
    if (!client_id) throw Error('client id kosong')
    return { client_id }
  },

  async getHls(obj1, obj2, obj3) {
    const { datadome, stream_url, client_id, track_authorization } = { ...obj1, ...obj2, ...obj3 }
    const headers = { "x-datadome-clientid": datadome, ...this.baseHeaders }
    const url = new URL(stream_url)
    url.search = new URLSearchParams({ client_id, track_authorization })
    const { data: json } = await this._tools.hit(`get hls`, url, { headers }, `json`)
    return json
  },

  async download(trackUrl) {
    this._tools.validateString(`track url`, trackUrl)
    const obj1 = await this.getTrackAuthAndStreamUrlAndKey(trackUrl)
    const obj2 = await this.getClientId()
    const obj3 = await this.getDatadome(obj1)
    const hls = await this.getHls(obj1, obj2, obj3)
    const { soundMetadata } = obj1
    const { url } = hls
    return { ...soundMetadata, url }
  }
}

let handler = async (m, { DinzBotz, args }) => {
  if (!args[0]) throw 'Url nya mana bg?, contoh : .soundcloudl https://soundcloud.com/nocopyrightsounds/stars-ncs-release'
  m.reply('wett')
  try {
    let res = await sc.download(args[0])
    const audioRes = await fetch(res.url)
    const audioBuffer = await audioRes.buffer()
    await DinzBotz.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      fileName: `${res.title}.mp3`,
      ptt: false,
      contextInfo: {
        forwardingScore: 999999,
        isForwarded: true,
        externalAdReply: {
          title: `Soundcloud - Downloader`,
          body: `${res.title} | username: ${res.username} | playbackCount: ${res.playbackCount?.toLocaleString('id-ID') || '-'}`,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: res.image,
          sourceUrl: args[0]
        }
      }
    }, { quoted: m })
  } catch (e) {
    m.reply(`Eror kak : ${e.message}`)
  }
}

handler.help = ['soundcloudl <url>']
handler.tags = ['downloader']
handler.command = ['soundcloudl', 'scdl']

module.exports = handler