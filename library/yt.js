const fs = require('fs')
const path = './database/youtube.json'

class YoutubeDB {
  constructor() {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify({ users: {} }, null, 2))
    }
    this.dbPath = path
  }

  readDB() {
    try {
      return JSON.parse(fs.readFileSync(this.dbPath))
    } catch (error) {
      console.error('Error reading database:', error)
      return { users: {} }
    }
  }

  saveDB(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2))
  }

  getUser(userId) {
    const db = this.readDB()
    if (!db.users[userId]) {
      db.users[userId] = this.createDefaultUser()
      this.saveDB(db)
    }
    return db.users[userId]
  }

  createDefaultUser() {
    return {
      channelName: '',
      subscribers: 0,
      likes: 0,
      viewers: 0,
      playButton: 0,
      lastLive: 0
    }
  }

  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  static msToTime(duration) {
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
    const seconds = Math.floor((duration / 1000) % 60)
    return `${minutes}m ${seconds}s`
  }
}

module.exports = YoutubeDB