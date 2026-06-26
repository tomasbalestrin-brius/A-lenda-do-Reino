import { describe, it, expect } from "vitest";

// Proximity detection algorithm implemented in CanvasGame.jsx
function checkSignpostProximity(activeHero, signposts, currentMapId) {
  if (!activeHero) return null;
  
  return signposts.find(s => 
    s.mapId === currentMapId &&
    Math.abs(activeHero.gridX - s.gridX) + Math.abs(activeHero.gridY - s.gridY) <= 1
  ) || null;
}

describe("Interactive Signposts & Proximity Dialogs", () => {
  const mockSignposts = [
    {
      mapId: "village",
      gridX: 5,
      gridY: 3,
      title: "VILLAGE SIGN",
      text: "Welcome to the village!"
    },
    {
      mapId: "forest",
      gridX: 10,
      gridY: 10,
      title: "FOREST SIGN",
      text: "Danger lies ahead!"
    }
  ];

  it("should trigger dialogue when active hero is adjacent to the signpost", () => {
    // Standing at [5, 4] is adjacent to [5, 3] (distance = 1)
    const activeHero = { gridX: 5, gridY: 4 };
    const sign = checkSignpostProximity(activeHero, mockSignposts, "village");
    
    expect(sign).not.toBeNull();
    expect(sign.title).toBe("VILLAGE SIGN");
  });

  it("should trigger dialogue when active hero stands exactly on the signpost", () => {
    // Standing at [5, 3] is on the signpost (distance = 0)
    const activeHero = { gridX: 5, gridY: 3 };
    const sign = checkSignpostProximity(activeHero, mockSignposts, "village");
    
    expect(sign).not.toBeNull();
    expect(sign.title).toBe("VILLAGE SIGN");
  });

  it("should not trigger dialogue if hero is on a different map", () => {
    const activeHero = { gridX: 5, gridY: 3 };
    const sign = checkSignpostProximity(activeHero, mockSignposts, "forest");
    
    expect(sign).toBeNull(); // No sign at [5, 3] in forest
  });

  it("should not trigger dialogue if hero is too far from the signpost", () => {
    // Standing at [5, 5] (distance = 2)
    const activeHero = { gridX: 5, gridY: 5 };
    const sign = checkSignpostProximity(activeHero, mockSignposts, "village");
    
    expect(sign).toBeNull();
  });

  it("should return null if no active hero is available", () => {
    const sign = checkSignpostProximity(null, mockSignposts, "village");
    expect(sign).toBeNull();
  });
});
