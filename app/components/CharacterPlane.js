import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useTransition,
} from 'react';
import { SVGComponents, renderSVG } from './svgs';
import { debounce } from 'lodash';
import { memo } from 'react';
import { Permanent_Marker } from 'next/font/google';
import randomColor from 'randomcolor';

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
});

const ZOOM_SPEED = {
  desktop: 0.14,
  mobile: 2,
};
const PAN_SPEED = {
  desktop: 1.5,
  mobile: 3.5,
};
const CULLING_MARGIN = {
  desktop: 500,
  mobile: 800
};

const speechOptions = [
  'Bags are mooning',
  '51% win rate brah!',
  'I ❤️ memecoins',
  'I copy trade OSF',
  'Screw VC coins',
  'The trenches are calling',
  "I'am streaming on Pump",
  'I am a TA god',
  "I am Binance Listing Intern",
  "The dev burn 69% of the supply",
  "King of the hills",
  'Bull goes mooo 🐂',
  '69,000% PNL',
  'I bought $SOL at $8',
  "megacycle!",
  'I am the dev',
  'I Choose rich!',
  'I am my bag and my bag is me',
  'Hail to the Kabal!',
  "🎵Dont you know pump it up🎵",
  'I am just a chillguy',
  '🎵I snipe, I pump, I dump it up🎵',
  'Truth Terminal is my mate',
  'I am a $WOD whale',
  'The hat stays on',
  'I ❤️ $WOD',
  'I am a cryptofluencer',
  'ChatGPT created me',
  'I bought $PNUT at $20k',
  'Streaming till $100M',
  'Mr. Siriuss invstooorr',
  "I was born in the tranches, I'll die in the tranches",
  'Respect the pump brah',
  "I'm a pump and dump artist",
  'I am going to memecon!',
  "I hold the floor",
  "I short the tops",
  "The ticker is $WOD",
  "I'm in it for the tech",
  "I'm an insider",
  'I am an AI agent',
  'I am a serious investor',
  'I take profits',
  'I never sell',
  "Trust the process",
  'Bounded!',
  'GM brah'
];
const sadSpeechOptions = [
  'Frank just bought',
  'I hold ETH',
  'I only buy Becker coins',
  'Funds are SAFU',
  '1% float, $1B FDV',
  'I FOMO at the top',
  'I long tops',
  'I short bottoms',
  'Twenty bandos',
  'wen Binance',
  'I always buy the top',
  'My bag is only Murad coins',
  'I wish I was Ansem',
  'I got MEVed',
  'I am a Cardano community member',
  'Bitboy is my dad',
  'I invest in DeFi',
  "I wish I had Farokh's hairs",
  'Dev rugged me',
  'I am an airdrop farmer',
  'aww! It went to $0',
  'I round tripped BAYC',
  'I have a BAYC PFP',
  'I faded memecoins',
  'E. Warren is my gf',
  'I am a cardano dev',
  'God hates memecoins',
  'I copy traded Frank',
  "I am Tate's gf",
  'Sure, Metamask support, here is my PK',
  'I am a VC',
  'I voted Kamala',
  'Garry Gensler is my dad',
  'Dev holds 99%',
  'I am a community member'
];

const GradientSwatch = memo(
  ({ gradient, onClick, isActive }) => (
    <button
      onClick={() => onClick(gradient)}
      onTouchEnd={(e) => {
        e.preventDefault();
        onClick(gradient);
      }}
      className={`
        md:w-10 md:h-10
        w-6 h-6
        rounded-lg shadow-md hover:scale-110 active:scale-95 transition-transform 
        ${isActive ? 'ring-1 ring-white ring-offset-1' : ''}
      `}
      style={{
        background: `linear-gradient(45deg, ${gradient.colors[0]}, ${gradient.colors[1]})`,
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label={`Set background to ${gradient.name}`}
      title={gradient.name}
    />
  ),
  (prevProps, nextProps) =>
    prevProps.isActive === nextProps.isActive &&
    prevProps.gradient.name === nextProps.gradient.name,
);

const FIXED_VIEWPORT = {
  width: 1920, // Standard desktop width
  height: 1080, // Standard desktop height
  centerX: 1920 / 2,
  centerY: 1080 / 2,
};

const CharacterBody = memo(({ bodyIndex, baseSize, bodyColor }) => (
  <use
    href={`#body-${bodyIndex}`}
    transform={`translate(${-baseSize * 2}, ${-baseSize})`}
    style={{ color: bodyColor }}
  />
));

const CharacterHead = memo(({ mood, headIndex, baseSize, headOffset = 0 }) => (
  <use
    href={`#head-${mood}-${headIndex}`}
    transform={`translate(${-baseSize * 2}, ${-(baseSize + headOffset)})`}
  />
));

const INITIAL_ZOOM = {
  desktop: 0.2,
  mobile: 0.4
};

const CharacterPlane = () => {
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [loading, setLoading] = useState(true);
  const [characterPositions, setCharacterPositions] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [viewBox, setViewBox] = useState({ 
    x: 0, 
    y: 0, 
    scale: isMobile ? INITIAL_ZOOM.mobile : INITIAL_ZOOM.desktop 
  });
  const panStateRef = useRef(null);
  const workerRef = useRef(null);
  const processedDataRef = useRef(false);
  const lastTouchDistance = useRef(null);
  const svgRef = useRef();
  const [isPending, startTransition] = useTransition();

  const gradientPresets = useMemo(
    () => [
      { colors: ['#e9f9ff', '#87ceeb'], name: 'Baby' },
      { colors: ['#ffdde1', '#ffdde1'], name: 'Ping' },
      { colors: ['#D3CCE3', '#E9E4F0'], name: 'Delicate' },
      { colors: ['#ffffff', '#ffffff'], name: 'White' },
    ],
    [],
  );

  const [currentGradient, setCurrentGradient] = useState(gradientPresets[0]);

  const debouncedSetViewBox = useCallback(
    debounce((newViewBox) => {
      setViewBox(newViewBox);
    }, 16),
    [],
  );

  const viewport = FIXED_VIEWPORT;

  const isCharacterVisible = useCallback(
    (x, y) => {
      const screenX = FIXED_VIEWPORT.centerX + viewBox.x;
      const screenY = FIXED_VIEWPORT.centerY + viewBox.y;
      const scaledX = x * viewBox.scale + screenX;
      const scaledY = y * viewBox.scale + screenY;

      const margin = isMobile ? CULLING_MARGIN.mobile : CULLING_MARGIN.desktop;

      return (
        scaledX >= -margin &&
        scaledX <= FIXED_VIEWPORT.width + margin &&
        scaledY >= -margin &&
        scaledY <= FIXED_VIEWPORT.height + margin
      );
    },
    [viewBox, isMobile],
  );

  useEffect(() => {
    const fetchData = async () => {
      if (processedDataRef.current) return;

      setLoading(true);
      try {
        const response = await fetch('/api/hello');
        const data = await response.json();
        const formattedData = data.holders.map((holder) => ({
          holderID: holder.owner,
          size: holder.normalizedSize,
        }));
        generateCharacterPositions(formattedData);
      } catch (error) {
        console.error('Error fetching holder data:', error);
      }
    };

    fetchData();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  function convertStringToNumber(seed) {
    if (typeof seed === 'string') {
      seed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }
    return seed;
  }

  function mulberry32(seed) {
    seed = convertStringToNumber(seed);
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const generateCharacterPositions = useCallback((data) => {
    if (processedDataRef.current) return;
    processedDataRef.current = true;

    if (window.Worker) {
      if (workerRef.current) {
        workerRef.current.terminate();
      }

      workerRef.current = new Worker(
        new URL('../workers/characterGenerator.js', import.meta.url),
      );

      workerRef.current.onmessage = (e) => {
        const { positions, isComplete } = e.data;

        if (isComplete) {
          startTransition(() => {
            setCharacterPositions(positions);
            setLoading(false);
          });
          workerRef.current.terminate();
          workerRef.current = null;
        }
      };

      workerRef.current.postMessage({ data });
    }
  }, []);

  const characterIndex = useMemo(() => {
    const index = new Map();
    characterPositions.forEach((char) => {
      index.set(char.walletAddress, char);
    });
    return index;
  }, [characterPositions]);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const character = characterIndex.get(searchInput);

      if (character) {
        const startX = viewBox.x;
        const startY = viewBox.y;
        const startScale = viewBox.scale;

        const targetX = -character.x - 100;
        const targetY = -character.y - 50;
        const targetScale = 1;

        const duration = 1000; // Animation duration in ms
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function for smooth animation
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          const newX = startX + (targetX - startX) * easeProgress;
          const newY = startY + (targetY - startY) * easeProgress;
          const newScale = startScale + (targetScale - startScale) * easeProgress;

          setViewBox({
            x: newX,
            y: newY,
            scale: newScale,
          });

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      } else {
        alert('Character not found');
      }
    },
    [searchInput, characterIndex, viewBox],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (panStateRef.current?.isPanning) {
        e.preventDefault();
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const speed = isMobile ? PAN_SPEED.mobile : PAN_SPEED.desktop;
        const dx = ((e.clientX - panStateRef.current.startX)) * speed;
        const dy = ((e.clientY - panStateRef.current.startY)) * speed;

        requestAnimationFrame(() => {
          setViewBox((prev) => ({
            ...prev,
            x: panStateRef.current.startViewBoxX + dx,
            y: panStateRef.current.startViewBoxY + dy,
          }));
        });
      }
    },
    [viewBox.scale],
  );

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const speed = isMobile ? ZOOM_SPEED.mobile : ZOOM_SPEED.desktop;
      const scaleFactor = 1 - Math.sign(e.deltaY) * speed;

      setViewBox((prev) => {
        const newScale = prev.scale * scaleFactor;

        // Calculate mouse position relative to viewport center
        const mouseX = e.clientX - viewport.centerX;
        const mouseY = e.clientY - viewport.centerY;

        // Calculate the point we want to zoom towards in world space
        const worldX = (mouseX - prev.x) / prev.scale;
        const worldY = (mouseY - prev.y) / prev.scale;

        // Calculate new position that keeps the point under mouse
        return {
          scale: newScale,
          x: prev.x - worldX * (scaleFactor - 1) * prev.scale,
          y: prev.y - worldY * (scaleFactor - 1) * prev.scale,
        };
      });
    },
    [viewport.centerX, viewport.centerY],
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button === 0) {
        panStateRef.current = {
          isPanning: true,
          startX: e.clientX,
          startY: e.clientY,
          startViewBoxX: viewBox.x,
          startViewBoxY: viewBox.y,
        };
      }
    },
    [viewBox.x, viewBox.y],
  );

  const handleMouseUp = useCallback(() => {
    if (panStateRef.current) {
      panStateRef.current.isPanning = false;
    }
  }, []);

  const handleTouchStart = useCallback(
    (e) => {
      if (e.touches.length === 2) {
        // Store initial distance for pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
      } else if (e.touches.length === 1) {
        // Single touch for panning
        handleMouseDown({
          button: 0,
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        });
      }
    },
    [handleMouseDown],
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault(); // Prevent default zoom behavior

        // Calculate new distance
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (lastTouchDistance.current) {
          // Calculate zoom factor based on pinch distance change
          const scale = distance / lastTouchDistance.current;
          // Use ZOOM_SPEED.mobile to control zoom sensitivity
          const zoomChange = (scale - 1) * ZOOM_SPEED.mobile;
          const scaleFactor = 1 + zoomChange;

          // Calculate center point of the pinch
          const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

          setViewBox((prev) => {
            const newScale = prev.scale * scaleFactor;

            // Calculate the point we want to zoom towards in world space
            const mouseX = centerX - viewport.centerX;
            const mouseY = centerY - viewport.centerY;
            const worldX = (mouseX - prev.x) / prev.scale;
            const worldY = (mouseY - prev.y) / prev.scale;

            // Calculate new position that keeps the point under the pinch center
            return {
              scale: newScale,
              x: prev.x - worldX * (scaleFactor - 1) * prev.scale,
              y: prev.y - worldY * (scaleFactor - 1) * prev.scale,
            };
          });
        }

        lastTouchDistance.current = distance;
      } else if (e.touches.length === 1) {
        // Single touch for panning
        handlePointerMove({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
          preventDefault: () => e.preventDefault(),
        });
      }
    },
    [handlePointerMove, viewport.centerX, viewport.centerY],
  );

  const handleTouchEnd = useCallback(() => {
    lastTouchDistance.current = null;
    handleMouseUp();
  }, [handleMouseUp]);

  const SVGDefinitions = useMemo(() => {
    const definitions = [];

    // Add speech bubble definition
    definitions.push(
      <g key="speech-bubble" id="speech-bubble">
        {React.cloneElement(renderSVG(SVGComponents.speech[0]), {
          fill: 'white',
          stroke: 'black',
          strokeWidth: '2',
        })}
      </g>,
    );

    // Add body definitions
    SVGComponents.bodies.forEach((BodyComponent, index) => {
      definitions.push(
        <g key={`body-${index}`} id={`body-${index}`}>
          {React.cloneElement(renderSVG(BodyComponent), { fill: 'currentColor' })}
        </g>,
      );
    });

    // Add head definitions for each mood - preserve original colors
    ['happy', 'sad'].forEach((mood) => {
      SVGComponents.heads[mood].forEach((HeadComponent, index) => {
        definitions.push(
          <g key={`head-${mood}-${index}`} id={`head-${mood}-${index}`}>
            {renderSVG(HeadComponent)}
          </g>,
        );
      });
    });

    return <defs>{definitions}</defs>;
  }, []);

  const maxLineLength = 15; // Adjust based on your speech bubble size

  const drawCharacter = useCallback(
    (character) => {
      const { x, y, sizeParameter, paramSeed, walletAddress } = character;
      const rand = mulberry32(paramSeed * 37);
      const mood = rand() < 0.6 ? 'happy' : 'sad';

      // Adjust size scaling to use normalized values directly
      const normalizedSize = 0.8 + Math.pow(sizeParameter, 2) * 1.2; // Range of 0.8x to 2.0x

      // Select speech text based on mood
      const speechText =
        mood === 'happy'
          ? speechOptions[Math.floor(rand() * speechOptions.length)]
          : sadSpeechOptions[Math.floor(rand() * sadSpeechOptions.length)];

      const bodyIndex = Math.floor(rand() * SVGComponents.bodies.length);
      const headIndex = Math.floor(rand() * SVGComponents.heads[mood].length);

      const bodyColor = mood === 'happy'
        ? randomColor({ luminosity: 'bright', seed: paramSeed + '1' }) // Add '1' to create a different but consistent seed
        : randomColor({
          luminosity: 'light',
          seed: paramSeed + '1',
        });

      // Base sizes for character
      const baseSize = 400; // SVG's natural size

      // Split speech text into lines that fit the speech bubble
      const words = speechText.split(' ');
      const lines = [];
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length > maxLineLength) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) {
        lines.push(currentLine);
      }

      // Calculate scaling factor for speech bubble height based on line count
      const lineCount = lines.length;
      const bubbleScaleY = 1 + (lineCount - 1) * 0.5; // Adjust the multiplier as needed
      const bubbleYOffset = (lineCount - 1) * 30; // Adjust vertical offset as needed

      return (
        <g key={walletAddress}>
          {/* Character group - separate from bounding box */}
          <g transform={`translate(${x}, ${y}) scale(${normalizedSize})`}>
            {/* Body - centered at origin */}
            <CharacterBody
              bodyIndex={bodyIndex}
              baseSize={baseSize}
              bodyColor={bodyColor}
            />

            {/* Head - positioned relative to body */}
            <CharacterHead
              mood={mood}
              headIndex={headIndex}
              baseSize={baseSize}
            />

            {/* Speech bubble with scaled height and centered text */}
            <g
              transform={`
                translate(${-baseSize * 0.8}, ${-(baseSize + bubbleYOffset)
                })
                scale(0.6, ${0.6 * bubbleScaleY})
              `}
            >
              <use href="#speech-bubble" />
            </g>

            {/* Text group with centered positioning */}
            <g transform={`translate(${baseSize * 1.5}, ${-baseSize * 0.85})`}>
              <text
                y="0"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="54px"
                fill="black"
                className={permanentMarker.className}
                style={{
                  letterSpacing: '1px',
                }}
              >
                {lines.map((line, index) => (
                  <tspan key={index} x="0" dy={`${index === 0 ? '0' : '1.2em'}`}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>

            {/* Optional: Wallet address */}
            {walletAddress && (
              <text
                x={baseSize * 0.55}
                y={baseSize * 1.65}
                textAnchor="middle"
                style={{
                  fontSize: `${18 / normalizedSize}px`,
                  fill: '#666',
                  fontFamily: 'monospace',
                }}
              >
                {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
              </text>
            )}
          </g>
        </g>
      );
    },
    [maxLineLength],
  );

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const handleWheelWithOptions = (e) => {
      e.preventDefault();
      handleWheel(e);
    };

    svgElement.addEventListener('wheel', handleWheelWithOptions, { passive: false });

    return () => {
      svgElement.removeEventListener('wheel', handleWheelWithOptions);
    };
  }, [handleWheel]);

  // Ensure visibleCharacters is declared before it's used
  const visibleCharacters = useMemo(() => {
    return characterPositions.filter((char) => isCharacterVisible(char.x, char.y));
  }, [characterPositions, isCharacterVisible]);

  // Remove react-window virtualization
  // Memoize character rendering to prevent unnecessary re-renders
  const characterElements = useMemo(() => {
    return visibleCharacters.map((character) => drawCharacter(character));
  }, [visibleCharacters, drawCharacter]);

  return (
    <div className="relative w-full h-screen select-none">
      {loading && (
        <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF0091]"></div>
        </div>
      )}

      <div className={`
        fixed z-30 p-2
        md:right-4 md:top-4 md:flex-col md:h-fit
        right-2 bottom-20 flex-row
        flex gap-2 bg-black/20 rounded-xl backdrop-blur-sm
      `}>
        {gradientPresets.map((gradient) => (
          <GradientSwatch
            key={gradient.name}
            gradient={gradient}
            onClick={setCurrentGradient}
            isActive={currentGradient.name === gradient.name}
          />
        ))}
      </div>

      <form
        onSubmit={handleSearch}
        className="absolute z-10 p-4 left-4 top-4 bg-black/30 rounded-lg"
      >
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 select-text"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>

      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${FIXED_VIEWPORT.width} ${FIXED_VIEWPORT.height}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={handleMouseDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: 'none',
          background: `linear-gradient(${currentGradient.colors[0]}, ${currentGradient.colors[1]})`,
        }}
      >
        {SVGDefinitions}
        <g
          transform={`translate(${FIXED_VIEWPORT.centerX + viewBox.x}, ${FIXED_VIEWPORT.centerY + viewBox.y
            }) scale(${viewBox.scale})`}
        >
          {/* Render characters directly */}
          {characterElements}
        </g>
      </svg>

      <div className="fixed bottom-0 left-0 right-0 bg-[#FF0091] h-16 flex justify-between items-center px-8 z-20">
        <h1 className="text-white text-2xl font-bold">WORLD OF DEGENS</h1>
        <div className="flex flex-col gap-2">
          <a
            href="https://x.com/world_of_degen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </a>
          <a
            href={`https://pump.fun/coin/${process.env.NEXT_PUBLIC_PROGRAM_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200"
          >
            <img
              src="https://pump.fun/_next/image?url=%2Flogo.png&w=32&q=75"
              alt="Pump.fun"
              className="w-6 h-6"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default memo(CharacterPlane);