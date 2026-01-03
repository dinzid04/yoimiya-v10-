const axios = require('axios')
const { createCanvas, loadImage, registerFont } = require('canvas')
const path = require('path')

// Register font
registerFont(path.join(__dirname, 'fonts/Poppins-Bold.ttf'), { family: 'Poppins', weight: 'bold' })
registerFont(path.join(__dirname, 'fonts/Poppins-Regular.ttf'), { family: 'Poppins' })

async function getGenshinData(uid) {
  const url = `https://api.fasturl.link/stalk/genshin/advanced?uid=${uid}&media=true&avatarInfo=false&cardImage=false`
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw new Error('Gagal mengambil data dari API')
  }
}

async function createProfileCard(data) {
  const canvas = createCanvas(1200, 1800)
  const ctx = canvas.getContext('2d')

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 1800)
  gradient.addColorStop(0, '#1a2a6c')
  gradient.addColorStop(1, '#b21f1f')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1200, 1800)

  // Load character icon
  try {
    const charIcon = await loadImage(data.result.player.iconUrl)
    // Draw character icon (circle mask)
    ctx.save()
    ctx.beginPath()
    ctx.arc(600, 200, 100, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(charIcon, 500, 100, 200, 200)
    ctx.restore()
  } catch (e) {
    console.error('Error loading character icon:', e)
  }

  // Player info
  ctx.font = 'bold 42px Poppins'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.fillText(data.result.player.nickname, 600, 350)

  ctx.font = '28px Poppins'
  ctx.fillText(`UID: ${data.result.player.uid} | AR ${data.result.player.level}`, 600, 400)
  ctx.fillText(`Server: ${data.result.player.server.toUpperCase()} | WL ${data.result.player.worldLevel}`, 600, 440)

  // Stats box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.roundRect(100, 500, 1000, 400, 20)
  ctx.fill()

  // Stats text
  ctx.font = 'bold 36px Poppins'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#ffcc00'
  ctx.fillText('Player Statistics', 150, 550)

  ctx.font = '28px Poppins'
  ctx.fillStyle = '#ffffff'
  const stats = [
    `Days Active: ${data.result.player.detail.activeDays}`,
    `Achievements: ${data.result.player.detail.achievements}`,
    `Characters: ${data.result.player.detail.characters}`,
    `Spiral Abyss: ${data.result.player.detail.spiralAbyss.maxFloor}`,
    `Total Chests: ${data.result.player.detail.chests}`
  ]

  stats.forEach((stat, i) => {
    ctx.fillText(stat, 150, 600 + (i * 60))
  })

  // Exploration progress
  ctx.font = 'bold 36px Poppins'
  ctx.fillStyle = '#ffcc00'
  ctx.fillText('Exploration Progress', 150, 950)

  const regions = {
    'Mondstadt': data.result.player.detail.exploration['1'],
    'Liyue': data.result.player.detail.exploration['2'],
    'Inazuma': data.result.player.detail.exploration['3'],
    'Sumeru': data.result.player.detail.exploration['4'],
    'Fontaine': data.result.player.detail.exploration['5']
  }

  let yPos = 1000
  for (const [region, progress] of Object.entries(regions)) {
    if (progress > 0) {
      // Progress bar background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.fillRect(150, yPos, 800, 30)
      
      // Progress bar fill
      ctx.fillStyle = '#4CAF50'
      ctx.fillRect(150, yPos, 800 * progress, 30)
      
      // Text
      ctx.fillStyle = '#ffffff'
      ctx.fillText(`${region}: ${(progress * 100).toFixed(1)}%`, 150, yPos - 10)
      
      yPos += 60
    }
  }

  // Character showcase
  ctx.font = 'bold 36px Poppins'
  ctx.fillStyle = '#ffcc00'
  ctx.fillText('Character Showcase', 150, yPos + 50)

  const characters = data.result.characterBuilds.slice(0, 4) // Limit to 4 chars
  const charWidth = 250
  const charHeight = 350

  for (let i = 0; i < characters.length; i++) {
    const x = 150 + (i * (charWidth + 20))
    const y = yPos + 100

    // Character card background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.roundRect(x, y, charWidth, charHeight, 15)
    ctx.fill()

    try {
      // Character image
      const charImg = await loadImage(characters[i].weapon.iconUrl.replace('Awaken', ''))
      ctx.drawImage(charImg, x + 25, y + 20, 200, 200)
    } catch (e) {
      console.error('Error loading character image:', e)
    }

    // Character info
    ctx.font = 'bold 24px Poppins'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(characters[i].characterName, x + (charWidth/2), y + 240)

    ctx.font = '20px Poppins'
    ctx.fillText(`Lv. ${characters[i].level.split('/')[0].trim()}`, x + (charWidth/2), y + 270)
    ctx.fillText(`C${characters[i].constellation}`, x + (charWidth/2), y + 300)
  }

  return canvas.toBuffer()
}

module.exports = {
  getGenshinData,
  createProfileCard
}