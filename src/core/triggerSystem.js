import { checkAABB } from "./physics";

export class TriggerSystem {
  constructor() {
    this.triggers = [];
    this.onStateChanged = null; // callback to PuzzleManager
  }

  registerTrigger(trigger) {
    this.triggers.push({ ...trigger, activated: false, cooldown: 0, collected: false, timer: 0 });
  }
  
  loadLevelTriggers(mapTriggers) {
    this.triggers = [];
    if (mapTriggers) {
      mapTriggers.forEach(t => this.registerTrigger(t));
    }
  }

  checkTriggers(characters, projectiles, dt, interactiveObjects = []) {
    let stateChanged = false;

    this.triggers.forEach(trigger => {
      if (trigger.cooldown > 0) {
        trigger.cooldown -= dt;
        return; 
      }
      
      if (trigger.type === "TIMED_SWITCH" && trigger.activated) {
         trigger.timer -= dt;
         if (trigger.timer <= 0) {
            trigger.activated = false;
            if (this.onStateChanged) this.onStateChanged(`${trigger.id}_ativo`, false);
            stateChanged = true;
         }
         return; // Ignore new triggers while timing down
      }

      let triggered = false;
      const tBox = { x: trigger.x * 32, y: trigger.y * 32, w: trigger.width * 32, h: trigger.height * 32 };

      if (trigger.type === "SWITCH" || trigger.type === "TIMED_SWITCH") {
         const charsOnSwitch = characters.filter(c => !c.isDead && checkAABB(tBox, {
            x: c.x + c.hitbox.offsetX, y: c.y + c.hitbox.offsetY, w: c.hitbox.w, h: c.hitbox.h
         }));
         
         const projectilesOnSwitch = projectiles.filter(p => p.active && checkAABB(tBox, {
            x: p.x, y: p.y, w: p.width, h: p.height
         }));

         if (charsOnSwitch.length > 0) {
            triggered = true;
         }
         
         if (projectilesOnSwitch.length > 0) {
            triggered = true;
            // Destroy the projectile that hit the switch
            projectilesOnSwitch.forEach(p => p.active = false);
         }
      } else if (trigger.type === "PRESSURE_PLATE") {
         const charsOnPlate = characters.filter(c => !c.isDead && checkAABB(tBox, {
            x: c.x + c.hitbox.offsetX, y: c.y + c.hitbox.offsetY, w: c.hitbox.w, h: c.hitbox.h
         }));
         const pushablesOnPlate = interactiveObjects.filter(obj => obj.type === 'PUSHABLE' && checkAABB(tBox, {
            x: obj.x, y: obj.y, w: obj.width, h: obj.height
         }));
         if (charsOnPlate.length > 0 || pushablesOnPlate.length > 0) triggered = true;
      } else if (trigger.type === "EXIT") {
         const charsInExit = characters.filter(c => !c.isDead && checkAABB(tBox, {
            x: c.x + c.hitbox.offsetX, y: c.y + c.hitbox.offsetY, w: c.hitbox.w, h: c.hitbox.h
         }));
         if (charsInExit.length === characters.length && characters.length > 0) triggered = true;
      } else if (trigger.type === "COLLECTIBLE" && !trigger.collected) {
         const charOnItem = characters.filter(c => !c.isDead && checkAABB(tBox, {
            x: c.x + c.hitbox.offsetX, y: c.y + c.hitbox.offsetY, w: c.hitbox.w, h: c.hitbox.h
         }));
         if (charOnItem.length > 0) {
            trigger.collected = true;
            if (this.onStateChanged) this.onStateChanged(`${trigger.id}_coletado`, true);
            stateChanged = true;
         }
      }

      // Handle activation toggle
      if (triggered && !trigger.activated && trigger.type !== "COLLECTIBLE") {
         trigger.activated = trigger.type !== "PRESSURE_PLATE"; // plate only active while standing
         if (trigger.type === "SWITCH") trigger.cooldown = 1000;
         if (trigger.type === "TIMED_SWITCH") trigger.timer = trigger.duration || 3000;
         
         if (this.onStateChanged) this.onStateChanged(`${trigger.id}_ativo`, true);
         stateChanged = true;
      } else if (!triggered && trigger.activated && trigger.type === "PRESSURE_PLATE") {
         trigger.activated = false;
         if (this.onStateChanged) this.onStateChanged(`${trigger.id}_ativo`, false);
         stateChanged = true;
      }
    });

    return stateChanged;
  }
}
