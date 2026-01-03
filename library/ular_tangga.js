const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

class gameUlarTangga {
  constructor() {
    this.games = {};
    this.boardLayout = this.generateBoardLayout();
    
    // Posisi ular dan tangga
    this.snakes = {
      98: 28, 95: 24, 93: 68, 87: 54,
      64: 19, 62: 18, 56: 3, 49: 11,
      47: 9, 16: 6
    };
    this.ladders = {
      1: 38, 4: 14, 9: 31, 21: 42,
      28: 84, 36: 44, 51: 67, 71: 91,
      80: 100
    };
    
    // Warna dan nama pemain
    this.playerColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
    this.playerNames = ['P1', 'P2', 'P3', 'P4'];
    
    // Warna kotak papan
    this.cellColors = [
      '#FF9999', '#99FF99', '#9999FF', '#FFFF99',
      '#FF99FF', '#99FFFF', '#FFCC99', '#CCFF99',
      '#99CCFF', '#FF99CC', '#99FFCC', '#CC99FF'
    ];
  }

  generateBoardLayout() {
    const layout = [];
    // Mulai dari baris bawah (nomor 1-10) ke atas (nomor 91-100)
    for (let row = 9; row >= 0; row--) {
      if (row % 2 === 1) {
        // Baris ganjil (kanan ke kiri): 10→9→8...→1
        for (let col = 9; col >= 0; col--) {
          layout.push((row * 10) + col + 1);
        }
      } else {
        // Baris genap (kiri ke kanan): 1→2→3...→10
        for (let col = 0; col < 10; col++) {
          layout.push((row * 10) + col + 1);
        }
      }
    }
    return layout;
  }

  async mulaiGame(chatId) {
    if (this.games[chatId]) {
      return { error: '❗ Sudah ada game yang berjalan di grup ini!' };
    }
    
    this.games[chatId] = {
      pemain: [],
      sudahJoin: {},
      posisi: {},
      giliran: 0,
      mulai: false,
      sudahDapat1: {},
      terakhirAktif: Date.now()
    };
    
    return { 
      sukses: true, 
      pesan: '🎲 *Game Ular Tangga Dimulai!*\n\nKetik .join untuk bergabung (2-4 pemain)\n\n📌 *Peraturan:*\n- Harus dapat dadu 1 dulu untuk mulai\n- Dapat 6 bisa lempar lagi' 
    };
  }

  async joinGame(chatId, userId, namaUser) {
    const game = this.games[chatId];
    if (!game) return { error: '❗ Tidak ada game yang berjalan!' };
    if (game.sudahJoin[userId]) return { error: `❗ ${namaUser} sudah bergabung!` };
    if (game.pemain.length >= 4) return { error: '❗ Game sudah penuh (maks 4 pemain)!' };
    
    game.pemain.push({ userId, nama: namaUser });
    game.sudahJoin[userId] = true;
    game.posisi[userId] = 0;
    game.sudahDapat1[userId] = false;
    game.terakhirAktif = Date.now();
    
    if (game.pemain.length >= 2 && !game.mulai) {
      game.mulai = true;
      const gambarPapan = await this.renderPapan(chatId);
      return {
        sukses: true,
        respon: {
          image: gambarPapan,
          caption: `🎲 *GAME DIMULAI!*\nPemain:\n${game.pemain.map((p, i) => `- ${p.nama} (${this.playerNames[i]})`).join('\n')}\n\nGiliran pertama: ${game.pemain[0].nama}\nKetik .lempar untuk bermain\n\n📌 Harus dapat dadu 1 dulu!`
        }
      };
    }
    
    return { sukses: true, pesan: `✅ ${namaUser} bergabung! (${game.pemain.length}/4 pemain)` };
  }

  async lemparDadu(chatId, userId) {
    const game = this.games[chatId];
    if (!game?.mulai) return { error: '❗ Game belum dimulai!' };
    
    const pemainGiliran = game.pemain[game.giliran];
    if (userId !== pemainGiliran.userId) {
      return { error: `❗ Sekarang giliran ${pemainGiliran.nama}!` };
    }
    
    const nilaiDadu = Math.floor(Math.random() * 6) + 1;
    const gambarDadu = await this.generateGambarDadu(nilaiDadu);
    
    // Jika belum dapat dadu 1 untuk mulai
    if (!game.sudahDapat1[userId]) {
      if (nilaiDadu === 1) {
        game.sudahDapat1[userId] = true;
        game.posisi[userId] = 1;
        
        const gambarPapan = await this.renderPapan(chatId);
        return {
          nilaiDadu,
          gambarDadu,
          gambarPapan,
          pesan: `🎲 ${pemainGiliran.nama} dapat 1! Mulai bermain dari kotak 1.\n\n⚡ Anda bisa lempar dadu lagi!`,
          bisaLemparLagi: true
        };
      } else {
        game.giliran = (game.giliran + 1) % game.pemain.length;
        return {
          nilaiDadu,
          gambarDadu,
          pesan: `🎲 ${pemainGiliran.nama} dapat ${nilaiDadu} (Butuh dadu 1 untuk mulai)\n\nGiliran selanjutnya: ${game.pemain[game.giliran].nama}`,
          bisaLemparLagi: false
        };
      }
    }
    
    // Jika sudah dapat 1, main normal
    let posisiBaru = game.posisi[userId] + nilaiDadu;
    let pesanKhusus = '';
    
    if (posisiBaru > 100) {
      posisiBaru = game.posisi[userId];
      pesanKhusus = '❌ Melebihi 100, tetap di posisi sekarang';
    } else if (posisiBaru === 100) {
      const gambarPapan = await this.renderPapan(chatId);
      delete this.games[chatId];
      return {
        nilaiDadu,
        gambarDadu,
        gambarPapan,
        pesan: `🎲 ${pemainGiliran.nama} dapat ${nilaiDadu} dan mencapai 100!\n\n🎉 *${pemainGiliran.nama} MENANG!*`,
        gameBerakhir: true,
        pemenang: pemainGiliran.nama
      };
    } else {
      if (this.snakes[posisiBaru]) {
        const posisiEkor = this.snakes[posisiBaru];
        pesanKhusus = `🐍 Kena ular! Turun ke ${posisiEkor}`;
        posisiBaru = posisiEkor;
      } else if (this.ladders[posisiBaru]) {
        const posisiAtas = this.ladders[posisiBaru];
        pesanKhusus = `🪜 Naik tangga! Ke ${posisiAtas}`;
        posisiBaru = posisiAtas;
      }
    }
    
    game.posisi[userId] = posisiBaru;
    const bisaLemparLagi = nilaiDadu === 6;
    if (!bisaLemparLagi) {
      game.giliran = (game.giliran + 1) % game.pemain.length;
    }
    
    game.terakhirAktif = Date.now();
    const gambarPapan = await this.renderPapan(chatId);
    
    return {
      nilaiDadu,
      gambarDadu,
      gambarPapan,
      pesan: `${pesanKhusus ? pesanKhusus + '\n\n' : ''}🎲 ${pemainGiliran.nama} dapat ${nilaiDadu}, sekarang di ${posisiBaru}\n\n${bisaLemparLagi ? '🎉 Dapat 6! Bisa lempar lagi!' : `Giliran selanjutnya: ${game.pemain[game.giliran].nama}`}`,
      bisaLemparLagi
    };
  }

  async renderPapan(chatId) {
    const game = this.games[chatId];
    const canvas = createCanvas(1000, 1000);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gambar grid
    const cellSize = 80;
    const marginX = 100;
    const marginY = 100;
    
    // Gambar kotak-kotak dari bawah ke atas
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const index = row * 10 + col;
        const pos = this.boardLayout[index];
        const colorIdx = (row + col) % this.cellColors.length;
        ctx.fillStyle = this.cellColors[colorIdx];
        
        // Hitung koordinat x (zig-zag)
        const x = row % 2 === 0 
          ? marginX + col * cellSize 
          : marginX + (9 - col) * cellSize;
        
        // Hitung koordinat y (dari bawah ke atas)
        const y = canvas.height - marginY - (row * cellSize) - cellSize;
        
        // Gambar kotak
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        // Nomor kotak
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pos.toString(), x + cellSize/2, y + cellSize/2);
      }
    }
    
    // Gambar ular dan tangga
    this.drawSnakesAndLadders(ctx, marginX, canvas.height - marginY, cellSize);
    
    // Gambar token pemain
    for (let i = 0; i < game.pemain.length; i++) {
      const pemain = game.pemain[i];
      const posisi = game.posisi[pemain.userId];
      
      if (posisi > 0) {
        const { x, y } = this.hitungKoordinat(posisi, marginX, canvas.height - marginY, cellSize);
        
        ctx.fillStyle = this.playerColors[i];
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.playerNames[i], x, y);
      }
    }
    
    // Judul
    ctx.fillStyle = '#000';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ULAR TANGGA', canvas.width/2, 50);
    
    // Simpan gambar
    const pathGambar = path.join(__dirname, 'temp', `papan_${chatId}.png`);
    await fs.ensureDir(path.dirname(pathGambar));
    await fs.writeFile(pathGambar, canvas.toBuffer('image/png'));
    return pathGambar;
  }

  drawSnakesAndLadders(ctx, marginX, baseY, cellSize) {
    // Gambar tangga
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8;
    
    for (const [bawah, atas] of Object.entries(this.ladders)) {
      const start = this.hitungKoordinat(parseInt(bawah), marginX, baseY, cellSize);
      const end = this.hitungKoordinat(parseInt(atas), marginX, baseY, cellSize);
      
      ctx.beginPath();
      ctx.moveTo(start.x - 15, start.y);
      ctx.lineTo(end.x - 15, end.y);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(start.x + 15, start.y);
      ctx.lineTo(end.x + 15, end.y);
      ctx.stroke();
      
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x1 = start.x - 15 + (end.x - start.x) * t;
        const y1 = start.y + (end.y - start.y) * t;
        const x2 = start.x + 15 + (end.x - start.x) * t;
        const y2 = start.y + (end.y - start.y) * t;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
    
    // Gambar ular
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 10;
    
    for (const [kepala, ekor] of Object.entries(this.snakes)) {
      const start = this.hitungKoordinat(parseInt(kepala), marginX, baseY, cellSize);
      const end = this.hitungKoordinat(parseInt(ekor), marginX, baseY, cellSize);
      
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const ctrlX = midX + (end.y - start.y) * 0.3;
      const ctrlY = midY - (end.x - start.x) * 0.3;
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(ctrlX, ctrlY, end.x, end.y);
      ctx.stroke();
      
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.arc(start.x, start.y, 12, 0, Math.PI * 2);
      ctx.fill();
      
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(
        start.x + Math.cos(angle) * 8 - Math.sin(angle) * 5,
        start.y + Math.sin(angle) * 8 + Math.cos(angle) * 5,
        3, 0, Math.PI * 2
      );
      ctx.arc(
        start.x + Math.cos(angle) * 8 + Math.sin(angle) * 5,
        start.y + Math.sin(angle) * 8 - Math.cos(angle) * 5,
        3, 0, Math.PI * 2
      );
      ctx.fill();
      
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(
        start.x + Math.cos(angle) * 20,
        start.y + Math.sin(angle) * 20
      );
      ctx.stroke();
    }
  }

  hitungKoordinat(posisi, marginX, baseY, cellSize) {
    const index = this.boardLayout.indexOf(posisi);
    const row = Math.floor(index / 10);
    const col = index % 10;
    
    // Hitung x (zig-zag)
    const x = row % 2 === 0
      ? marginX + col * cellSize + cellSize/2
      : marginX + (9 - col) * cellSize + cellSize/2;
      
    // Hitung y (dari bawah ke atas)
    const y = baseY - (row * cellSize) - cellSize/2;
    
    return { x, y };
  }

  async generateGambarDadu(nilai) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(50, 50, 100, 100, 15);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#000';
    const titik = this.polaTitikDadu(nilai);
    titik.forEach(t => {
      ctx.beginPath();
      ctx.arc(t.x, t.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
    
    const pathGambar = path.join(__dirname, 'temp', `dadu_${Date.now()}.png`);
    await fs.ensureDir(path.dirname(pathGambar));
    await fs.writeFile(pathGambar, canvas.toBuffer('image/png'));
    return pathGambar;
  }

  polaTitikDadu(nilai) {
    const pola = [
      [],
      [{x:100, y:100}],
      [{x:75, y:75}, {x:125, y:125}],
      [{x:75, y:75}, {x:100, y:100}, {x:125, y:125}],
      [{x:75, y:75}, {x:75, y:125}, {x:125, y:75}, {x:125, y:125}],
      [{x:75, y:75}, {x:75, y:125}, {x:100, y:100}, {x:125, y:75}, {x:125, y:125}],
      [{x:75, y:75}, {x:75, y:100}, {x:75, y:125}, {x:125, y:75}, {x:125, y:100}, {x:125, y:125}]
    ];
    return pola[nilai] || [];
  }

  async akhiriGame(chatId, userId) {
    const game = this.games[chatId];
    if (!game) return { error: '❗ Tidak ada game yang berjalan!' };
    
    const pemain = game.pemain.find(p => p.userId === userId);
    if (!pemain) return { error: '❗ Kamu bukan peserta game ini!' };
    
    const peringkat = game.pemain
      .map(p => ({ nama: p.nama, posisi: game.posisi[p.userId] }))
      .sort((a, b) => b.posisi - a.posisi);
    
    delete this.games[chatId];
    
    let pesan = `🎲 *Game diakhiri oleh ${pemain.nama}*\n\n`;
    pesan += '🏆 **Hasil Akhir**:\n';
    peringkat.forEach((p, i) => {
      pesan += `${i+1}. ${p.nama}: Posisi ${p.posisi}\n`;
    });
    
    return { sukses: true, pesan };
  }
}

module.exports = new gameUlarTangga();