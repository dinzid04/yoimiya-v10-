const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generateWelcomeCard({
  title = 'WELCOME',
  avatar = null,
  name = null,
  number = '+62 851-8912-0415',
  message,
  outputPath
}) {
  if (!message) {
    message = title.toLowerCase() === 'welcome'
      ? 'I hope you enjoy it here'
      : title.toLowerCase() === 'goodbye'
      ? 'Bye, see you later'
      : '';
  }

  const canvas = createCanvas(1280, 576);
  const ctx = canvas.getContext('2d');

  // Set text alignment to center
  ctx.textAlign = 'center';

  // Background
  const bg = await loadImage(path.resolve(__dirname, '../src/media/welcome.jpg'));
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

// Avatar
try {
  const avatarImg = await loadImage(avatar || 'https://i.ibb.co/Yt4qfP1/user-circle.png');
  
  const avatarX = 640;
  const avatarY = 88;
  const avatarRadius = 65;

  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.drawImage(avatarImg, avatarX - 65, avatarY - 65, 130, 130); // 130x130 pas nutup bulat
  ctx.restore();
} catch (e) {
  console.log('[!] Gagal muat avatar.');
}

  // Title
  ctx.font = 'bold 48px sans-serif';
  ctx.fillStyle = 'white';
  ctx.fillText(title.toUpperCase(), canvas.width / 2, 230);

  // Nama / Nomor
  ctx.font = 'bold 38px sans-serif';
  ctx.fillStyle = '#8ed6f7';
  ctx.fillText(name || number, canvas.width / 2, 290);

  // Pesan
  ctx.font = '30px sans-serif';
  ctx.fillStyle = 'white';
  ctx.fillText(message, canvas.width / 2, 340);

  // Output
  const folder = './database/sampah';
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const filename = `card-${Date.now()}.png`;
  const finalPath = outputPath || path.join(folder, filename);

  fs.writeFileSync(finalPath, canvas.toBuffer('image/png'));
  return finalPath;
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

module.exports = { generateWelcomeCard };