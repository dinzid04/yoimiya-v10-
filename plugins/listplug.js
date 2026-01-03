const fs = require("fs")
const path = require('path');

let handler = async (m, { DinzTheCreator, text, reply, example }) => {
if (!DinzTheCreator) return reply('khusus owner')
let dir = fs.readdirSync('./plugins')
if (dir.length < 1) return reply("Tidak ada file plugins")
let teks = "\n"
for (let e of dir) {
teks += `* ${e}\n`
}
reply(teks)
}

handler.command = ["listplugin", "listplugins"]

module.exports = handler