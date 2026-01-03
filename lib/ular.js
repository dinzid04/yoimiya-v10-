const Jimp = require('jimp');
const axios = require('axios');

class SnakeAndLadderGame {
  constructor(DinzBotz) {
    this.DinzBotz = DinzBotz;
    this.players = [];
    this.boardSize = 100;
    this.snakesAndLadders = [
      {start: 29, end: 7, type: 'ular'}, 
      {start: 24, end: 12, type: 'ular'},
      {start: 15, end: 37, type: 'tangga'}, 
      {start: 23, end: 41, type: 'tangga'},
      {start: 72, end: 36, type: 'ular'}, 
      {start: 49, end: 86, type: 'tangga'},
      {start: 90, end: 56, type: 'ular'}, 
      {start: 75, end: 64, type: 'ular'},
      {start: 74, end: 95, type: 'tangga'}, 
      {start: 91, end: 72, type: 'ular'},
      {start: 97, end: 78, type: 'ular'}
    ];
    this.currentPositions = {};
    this.currentPlayerIndex = 0;
    this.bgImageUrl = 'https://i.pinimg.com/originals/2f/68/a7/2f68a7e1eee18556b055418f7305b3c0.jpg';
    this.player1ImageUrl = 'https://i.pinimg.com/originals/75/33/22/7533227c53f6c270a96d364b595d6dd5.jpg';
    this.player2ImageUrl = 'https://i.pinimg.com/originals/be/68/13/be6813a6086681070b0f886d33ca4df9.jpg';
    this.bgImage = null;
    this.player1Image = null;
    this.player2Image = null;
    this.cellWidth = 40;
    this.cellHeight = 40;
    this.keyId = null;
    this.started = false;
  }

  initializeGame() {
    for (const player of this.players) {
      this.currentPositions[player] = 1;
    }
    this.currentPlayerIndex = 0;
    this.started = true;
  }

  rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  async movePlayer(player, steps) {
    const currentPosition = this.currentPositions[player];
    let newPosition = currentPosition + steps;
    
    // Cek jika menginjak pemain lain
    for (const otherPlayer of this.players) {
      if (otherPlayer !== player && this.currentPositions[otherPlayer] === newPosition) {
        await this.DinzBotz.sendMessage(this.DinzBotz.chat, {
          text: `😱 @${player.split('@')[0]} menginjak @${otherPlayer.split('@')[0]}! Kembali ke kotak 1!`,
          mentions: [player, otherPlayer]
        });
        newPosition = 1;
        break;
      }
    }
    
    // Cek ular atau tangga
    const snakeOrLadder = this.snakesAndLadders.find(s => s.start === newPosition);
    if (snakeOrLadder) {
      const action = snakeOrLadder.type === 'ular' ? '🐍 Kena ular! Turun ke' : '🪜 Naik tangga! Melonjak ke';
      await this.DinzBotz.sendMessage(this.DinzBotz.chat, {
        text: `${action} kotak ${snakeOrLadder.end}`,
        mentions: [player]
      });
      newPosition = snakeOrLadder.end;
    }
    
    this.currentPositions[player] = Math.min(newPosition, this.boardSize);
    return newPosition;
  }

  async fetchImage(url) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return await Jimp.read(Buffer.from(response.data, 'binary'));
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  }

  async getBoardBuffer() {
    const board = new Jimp(420, 420);
    this.bgImage.resize(420, 420);
    board.composite(this.bgImage, 0, 0);
    
    for (const player of this.players) {
      const playerPosition = this.currentPositions[player];
      const playerImage = player === this.players[0] ? this.player1Image : this.player2Image;
      const playerX = ((playerPosition - 1) % 10) * this.cellWidth + 10;
      const playerY = (9 - Math.floor((playerPosition - 1) / 10)) * this.cellHeight + 10;
      board.composite(playerImage.clone().resize(this.cellWidth, this.cellHeight), playerX, playerY);
    }
    
    return board.getBufferAsync(Jimp.MIME_PNG);
  }

  async startGame(m, player1, player2) {
    await this.DinzBotz.sendMessage(m.chat, {
      text: `🐍🎲 *PERMAINAN ULAR TANGGA DIMULAI!* 🎲🐍\n\nPemain 1: @${player1.split('@')[0]}\nPemain 2: @${player2.split('@')[0]}\n\nGiliran pertama: @${player1.split('@')[0]}`,
      mentions: [player1, player2]
    });
    
    this.players = [player1, player2];
    this.initializeGame();
    
    this.bgImage = await this.fetchImage(this.bgImageUrl);
    this.player1Image = await this.fetchImage(this.player1ImageUrl);
    this.player2Image = await this.fetchImage(this.player2ImageUrl);
    
    const boardBuffer = await this.getBoardBuffer();
    const { key } = await this.DinzBotz.sendMessage(m.chat, { image: boardBuffer });
    this.keyId = key;
  }

  async playTurn(m, player) {
    if (!this.players.length) {
      await this.DinzBotz.sendMessage(m.chat, { text: '🛑 Tidak ada permainan aktif!' });
      return;
    }
    
    const diceRoll = this.rollDice();
    const currentPosition = this.currentPositions[player];
    
    // Kirim notifikasi lempar dadu
    await this.DinzBotz.sendMessage(m.chat, {
      text: `🎲 @${player.split('@')[0]} melempar dadu dan mendapatkan: *${diceRoll}*`,
      mentions: [player]
    });
    
    // Jika belum dapat 1 untuk mulai
    if (!this.started && diceRoll !== 1) {
      await this.DinzBotz.sendMessage(m.chat, {
        text: `@${player.split('@')[0]} perlu dapat angka 1 dulu untuk mulai bermain!`,
        mentions: [player]
      });
      this.switchPlayer();
      return;
    }
    
    const newPosition = await this.movePlayer(player, diceRoll);
    
    // Cek jika menang
    if (newPosition === this.boardSize) {
      await this.DinzBotz.sendMessage(m.chat, {
        text: `🎉 @${player.split('@')[0]} mencapai kotak 100 dan MENANG! Selamat! 🎉`,
        mentions: [player]
      });
      this.resetSession();
      return;
    }
    
    // Update papan permainan
    const boardBuffer = await this.getBoardBuffer();
    if (this.keyId) {
      await this.DinzBotz.sendMessage(m.chat, { delete: this.keyId });
    }
    const { key } = await this.DinzBotz.sendMessage(m.chat, { image: boardBuffer });
    this.keyId = key;
    
    // Notifikasi giliran selanjutnya
    if (diceRoll === 6) {
      await this.DinzBotz.sendMessage(m.chat, {
        text: `🎲 @${player.split('@')[0]} dapat 6! Giliranmu masih berlanjut!`,
        mentions: [player]
      });
    } else {
      this.switchPlayer();
      const nextPlayer = this.players[this.currentPlayerIndex];
      await this.DinzBotz.sendMessage(m.chat, {
        text: `🔄 Giliran selanjutnya: @${nextPlayer.split('@')[0]}`,
        mentions: [nextPlayer]
      });
    }
  }

  addPlayer(player) {
    if (this.players.length < 2 && !this.players.includes(player)) {
      this.players.push(player);
      return true;
    }
    return false;
  }

  switchPlayer() {
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
  }

  resetSession() {
    this.players = [];
    this.currentPositions = {};
    this.currentPlayerIndex = 0;
    this.started = false;
    this.keyId = null;
  }

  isGameStarted() {
    return this.started;
  }
}

class gameUlarTangga {
  constructor() {
    this.sessions = {};
  }
  
  getGame(chatId, DinzBotz) {
    if (!this.sessions[chatId]) {
      this.sessions[chatId] = {
        game: new SnakeAndLadderGame(DinzBotz),
        state: false
      };
    }
    return this.sessions[chatId];
  }
}

module.exports = new gameUlarTangga();