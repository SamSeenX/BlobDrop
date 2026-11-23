// Anime Cel-Shaded Chibi Ball Sprite Generator

export function drawAnimeBall(ctx, tier, r, center) {
  // 1. Base flat pastel fill
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, r, 0, Math.PI * 2);
  ctx.fillStyle = tier.color;
  ctx.fill();

  // 2. Crisp 2-tone Anime Cel Shadow
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.beginPath();
  ctx.arc(center + r * 0.12, center + r * 0.22, r * 0.88, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(74, 29, 62, 0.14)';
  ctx.fill();

  // Bottom rim light bounce
  ctx.beginPath();
  ctx.arc(center, center + r * 0.1, r * 0.95, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = Math.max(1.5, r * 0.08);
  ctx.stroke();
  ctx.restore();

  // 3. Chibi Anime Pink Blush
  const blushRadius = Math.max(2, r * 0.13);
  const blushY = center + r * 0.16;
  ctx.fillStyle = 'rgba(251, 113, 133, 0.38)';

  ctx.beginPath();
  ctx.arc(center - r * 0.52, blushY, blushRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(center + r * 0.52, blushY, blushRadius, 0, Math.PI * 2);
  ctx.fill();

  // 4. Signature Anime Bubble Gleams (Crisp white speculars)
  // Primary pill highlight
  ctx.save();
  ctx.translate(center - r * 0.34, center - r * 0.36);
  ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.22, r * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Secondary star/dot highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(center - r * 0.15, center - r * 0.52, Math.max(1.5, r * 0.065), 0, Math.PI * 2);
  ctx.fill();

  // 5. Anime Cel Ink Outline
  ctx.beginPath();
  ctx.arc(center, center, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#3b1d38';
  ctx.lineWidth = Math.max(2, r * 0.075);
  ctx.stroke();

  // 6. Anime Sticker Number Label
  const fontSize = Math.max(9, Math.round(r * 0.44));
  ctx.font = `700 ${fontSize}px 'Fredoka', 'Outfit', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Sticker white outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = Math.max(3, r * 0.12);
  ctx.lineJoin = 'round';
  ctx.strokeText(tier.name, center, center + 1);

  // Sticker dark plum text
  ctx.fillStyle = '#3b1d38';
  ctx.fillText(tier.name, center, center + 1);

  ctx.restore();
}
