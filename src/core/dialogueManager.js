export class DialogueManager {
  constructor() {
    this.activeDialogue = null; // { heroId, text, timer }
    this.idleTimer = 0;
    this.lastSpeaker = null;

    this.quotes = {
      erik: {
        idle: ["Vamos logo!", "Eu corro mais rápido que o vento, mas você me prende aqui.", "Cadê a saída?"],
        success: ["Fácil demais!", "Abram alas!", "Ninguém me segura!"],
        hurt: ["Ai!", "Ei, cuidado!", "Isso não estava no plano!"]
      },
      baleog: {
        idle: ["Minha espada está enferrujando.", "Apareça, inimigo!", "Onde está a luta?"],
        success: ["Um verdadeiro guerreiro não falha.", "Hah! Tolo quem cruzar meu caminho.", "Mais um obstáculo destruído."],
        hurt: ["Argh!", "Isso é só um arranhão!", "Você vai pagar por isso!"]
      },
      olaf: {
        idle: ["Alguém trouxe comida?", "Meu escudo está pesado...", "Acho que vou tirar uma soneca."],
        success: ["O trabalho duro sempre compensa.", "Conseguimos, amigos!", "Pelo menos meu escudo está intacto."],
        hurt: ["Ugh!", "Meu escudo não cobriu isso...", "Ouch!"]
      }
    };
  }

  update(dt, activeHeroId, state) {
    // Process active dialogue bubble
    if (this.activeDialogue) {
      this.activeDialogue.timer -= dt;
      if (this.activeDialogue.timer <= 0) {
        this.activeDialogue = null;
      }
    }

    // Process Idle Chatter
    const vx = state.heroes.find(h => h.id === activeHeroId)?.vx || 0;
    const vy = state.heroes.find(h => h.id === activeHeroId)?.vy || 0;

    if (Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01 && !state.keys["ArrowLeft"] && !state.keys["ArrowRight"]) {
      this.idleTimer += dt;
      if (this.idleTimer > 10000) { // 10 seconds of idle
         this.triggerDialogue(activeHeroId, "idle");
         this.idleTimer = 0;
      }
    } else {
      this.idleTimer = 0;
    }
  }

  triggerDialogue(heroId, type) {
    if (this.activeDialogue) return; // Don't interrupt

    const heroQuotes = this.quotes[heroId];
    if (heroQuotes && heroQuotes[type]) {
      const texts = heroQuotes[type];
      const text = texts[Math.floor(Math.random() * texts.length)];
      this.activeDialogue = {
        heroId,
        text,
        timer: 3000 // Show for 3 seconds
      };
    }
  }

  draw(ctx, heroes, camera) {
    if (!this.activeDialogue) return;

    const hero = heroes.find(h => h.id === this.activeDialogue.heroId);
    if (!hero) return;

    const text = this.activeDialogue.text;
    
    ctx.save();
    ctx.font = "10px 'Courier New', Courier, monospace";
    const textWidth = ctx.measureText(text).width;
    
    const bubbleX = hero.x - camera.x + 16;
    const bubbleY = hero.y - camera.y - 30;

    // Draw bubble
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    
    // Bubble box
    const padding = 6;
    const boxW = textWidth + padding * 2;
    const boxH = 20;
    const boxX = bubbleX - boxW / 2;
    const boxY = bubbleY - boxH;

    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Little triangle pointing to hero
    ctx.beginPath();
    ctx.moveTo(bubbleX - 4, boxY + boxH);
    ctx.lineTo(bubbleX + 4, boxY + boxH);
    ctx.lineTo(bubbleX, boxY + boxH + 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, bubbleX, boxY + boxH / 2);

    ctx.restore();
  }
}
