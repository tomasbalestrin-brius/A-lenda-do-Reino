import { describe, it, expect, vi } from "vitest";
import { Particle, ParticleSystem } from "../particleSystem";

describe("Particle & ParticleSystem", () => {
  it("should initialize Particle with correct physics and config options", () => {
    const particle = new Particle(100, 200, {
      vxMin: 5,
      vxMax: 5,
      vyMin: -10,
      vyMax: -10,
      sizeMin: 4,
      sizeMax: 4,
      lifeMin: 500,
      lifeMax: 500,
      gravity: 0.1,
      drag: 0.95,
      color: "#ff0000",
      shape: "circle"
    });

    expect(particle.x).toBe(100);
    expect(particle.y).toBe(200);
    expect(particle.vx).toBe(5);
    expect(particle.vy).toBe(-10);
    expect(particle.size).toBe(4);
    expect(particle.life).toBe(500);
    expect(particle.maxLife).toBe(500);
    expect(particle.gravity).toBe(0.1);
    expect(particle.drag).toBe(0.95);
    expect(particle.color).toBe("#ff0000");
    expect(particle.shape).toBe("circle");
  });

  it("should select random color if colors array is supplied", () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff"];
    const particle = new Particle(0, 0, { colors });
    
    expect(colors).toContain(particle.color);
  });

  it("should update Particle coordinates, apply gravity, decay and check life status", () => {
    const particle = new Particle(100, 200, {
      vxMin: 10,
      vxMax: 10,
      vyMin: -5,
      vyMax: -5,
      sizeMin: 2,
      sizeMax: 2,
      lifeMin: 300,
      lifeMax: 300,
      gravity: 0.1,
      drag: 1.0 // no drag decay
    });

    // Update with dt = 100ms
    const alive = particle.update(100);
    
    // vy = initial_vy + gravity * dt = -5 + 0.1 * 100 = 5
    // x = initial_x + vx * dt = 100 + 10 * 100 = 1100
    // y = initial_y + vy * dt = 200 + -5 * 100 = -300
    // wait! The physics implementation does:
    // this.vy += this.gravity * dt;
    // this.vx *= Math.pow(this.drag, dt);
    // this.vy *= Math.pow(this.drag, dt);
    // this.x += this.vx * dt;
    // this.y += this.vy * dt;
    // this.life -= dt;
    
    // For dt = 100:
    // vy = -5 + 0.1 * 100 = 5
    // y = 200 + 5 * 100 = 700
    // x = 100 + 10 * 100 = 1100
    // life = 300 - 100 = 200
    
    expect(alive).toBe(true);
    expect(particle.life).toBe(200);
    expect(particle.x).toBe(1100);
    expect(particle.y).toBe(700);
    expect(particle.vy).toBe(5);
  });

  it("should return false when particle life decays to or below 0", () => {
    const particle = new Particle(0, 0, { lifeMin: 100, lifeMax: 100 });
    const alive = particle.update(150);
    
    expect(alive).toBe(false);
    expect(particle.life).toBeLessThanOrEqual(0);
  });

  it("should spawn correct amount of particles in ParticleSystem", () => {
    const system = new ParticleSystem();
    expect(system.particles.length).toBe(0);

    system.spawn(150, 150, 10, { color: "#ffffff" });
    expect(system.particles.length).toBe(10);
    system.particles.forEach(p => {
      expect(p.x).toBe(150);
      expect(p.y).toBe(150);
      expect(p.color).toBe("#ffffff");
    });
  });

  it("should update all active particles and purge dead ones in ParticleSystem", () => {
    const system = new ParticleSystem();
    
    // Spawn 3 short-lived particles and 2 long-lived ones
    system.spawn(0, 0, 3, { lifeMin: 50, lifeMax: 50 });
    system.spawn(0, 0, 2, { lifeMin: 500, lifeMax: 500 });
    expect(system.particles.length).toBe(5);

    // Update by 100ms: short-lived ones should die
    system.update(100);
    expect(system.particles.length).toBe(2);
    system.particles.forEach(p => {
      expect(p.maxLife).toBe(500);
    });

    // Update by another 500ms: all should be dead
    system.update(500);
    expect(system.particles.length).toBe(0);
  });

  it("should clear the active particles list when requested", () => {
    const system = new ParticleSystem();
    system.spawn(0, 0, 5);
    expect(system.particles.length).toBe(5);

    system.clear();
    expect(system.particles.length).toBe(0);
  });
});
