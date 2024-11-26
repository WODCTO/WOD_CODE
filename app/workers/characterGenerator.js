function convertStringToNumber(seed) {
  if (typeof seed === 'string') {
    seed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }
  return seed;
}

function mulberry32(seed) {
  seed = convertStringToNumber(seed);
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

self.onmessage = function(e) {
  const { data } = e.data;

  const positions = data
    .map((item, index) => {
      const { holderID, size } = item;
      const rand = mulberry32(holderID);
      
      // Position calculation logic
      const maxRadius = Math.sqrt(data.length) * 500;
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));

      // Adjust base radius based on character size
      const sizeScale = 1 + (size * 2); // Increased size impact (changed from 0.5 to 2)
      let angle = index * goldenAngle;
      let radius = maxRadius * Math.sqrt(index / data.length) * sizeScale; // Multiply by sizeScale

      // Scale perturbations based on character size
      const anglePerturbation = (rand() - 0.5) * 0.1;
      const radiusPerturbation = (rand() - 0.5) * ((maxRadius*0.9) / data.length) * 2 * sizeScale;

      angle += anglePerturbation;
      radius += radiusPerturbation;

      // Calculate center position
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      // Base character dimensions
      const baseSize = 600;
      
      // Calculate actual dimensions after scaling
      const scaledWidth = baseSize * size;
      const scaledHeight = baseSize * size;
      
      return {
        x: x,
        y: y,
        sizeParameter: size,
        paramSeed: convertStringToNumber(holderID),
        walletAddress: holderID,
        boundingBox: {
          left: x - scaledWidth/2,
          right: x + scaledWidth/2,
          top: y - scaledHeight/2,
          bottom: y + scaledHeight/2,
          width: scaledWidth,
          height: scaledHeight
        }
      };
    });

  self.postMessage({ positions, isComplete: true });
}; 