// Animated Weather Scene Illustrations
// Девочка на качелях, дождь, снег и т.д.

interface SceneProps {
    weatherCode: number;
    isDay: boolean;
}

export function WeatherScene({ weatherCode, isDay }: SceneProps) {
    // Select scene based on weather
    if (weatherCode >= 71 && weatherCode <= 86) {
        return <SnowScene isDay={isDay} />;
    }
    if (weatherCode >= 61 && weatherCode <= 67 || weatherCode >= 80 && weatherCode <= 82) {
        return <RainScene isDay={isDay} />;
    }
    if (weatherCode >= 95) {
        return <StormScene />;
    }
    if (weatherCode === 45 || weatherCode === 48) {
        return <FogScene />;
    }
    if (weatherCode <= 1 && isDay) {
        return <SunnyScene />;
    }
    if (!isDay) {
        return <NightScene />;
    }
    return <CloudyScene />;
}

// ===== RAIN SCENE - Girl with umbrella =====
function RainScene({ isDay }: { isDay: boolean }) {
    const bgColor = isDay ? '#3a4a6b' : '#1a2a4a';

    return (
        <svg viewBox="0 0 200 120" className="weather-scene">
            <style>{`
        .rain-drop { animation: rainDrop 1s linear infinite; }
        .rain-drop:nth-child(2) { animation-delay: 0.2s; }
        .rain-drop:nth-child(3) { animation-delay: 0.4s; }
        .rain-drop:nth-child(4) { animation-delay: 0.6s; }
        .rain-drop:nth-child(5) { animation-delay: 0.8s; }
        .umbrella { animation: umbrellaMove 2s ease-in-out infinite; transform-origin: 100px 80px; }
        .puddle { animation: puddle 0.8s ease-in-out infinite; }
        @keyframes rainDrop { 0% { transform: translateY(-20px); opacity: 1; } 100% { transform: translateY(100px); opacity: 0; } }
        @keyframes umbrellaMove { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        @keyframes puddle { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(1.1); } }
      `}</style>

            {/* Sky */}
            <rect width="200" height="120" fill={bgColor} />

            {/* Rain drops */}
            <g stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
                <line className="rain-drop" x1="30" y1="0" x2="25" y2="20" />
                <line className="rain-drop" x1="60" y1="0" x2="55" y2="20" />
                <line className="rain-drop" x1="90" y1="0" x2="85" y2="20" />
                <line className="rain-drop" x1="130" y1="0" x2="125" y2="20" />
                <line className="rain-drop" x1="170" y1="0" x2="165" y2="20" />
            </g>

            {/* Ground */}
            <rect x="0" y="100" width="200" height="20" fill="rgba(0,0,0,0.3)" />

            {/* Puddle */}
            <ellipse className="puddle" cx="100" cy="105" rx="40" ry="6" fill="rgba(100,150,200,0.3)" />

            {/* Girl silhouette with umbrella */}
            <g className="umbrella">
                {/* Umbrella */}
                <path d="M70 50 Q100 20 130 50 L100 50 Z" fill="#e74c3c" />
                <line x1="100" y1="50" x2="100" y2="95" stroke="#5a4a42" strokeWidth="3" />

                {/* Head */}
                <circle cx="100" cy="78" r="8" fill="#ffdbac" />

                {/* Body */}
                <path d="M100 86 L100 100 M100 90 L92 100 M100 90 L108 100" stroke="#4a4a6a" strokeWidth="3" strokeLinecap="round" />
            </g>
        </svg>
    );
}

// ===== SNOW SCENE - Snowman =====
function SnowScene({ isDay }: { isDay: boolean }) {
    const bgColor = isDay ? '#5a6a7a' : '#2a3a4a';

    return (
        <svg viewBox="0 0 200 120" className="weather-scene">
            <style>{`
        .snowflake { animation: snowFall 3s linear infinite; }
        .snowflake:nth-child(2) { animation-delay: 0.5s; }
        .snowflake:nth-child(3) { animation-delay: 1s; }
        .snowflake:nth-child(4) { animation-delay: 1.5s; }
        .snowflake:nth-child(5) { animation-delay: 2s; }
        .snowman { animation: snowmanWobble 3s ease-in-out infinite; transform-origin: 100px 100px; }
        @keyframes snowFall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100px) rotate(360deg); opacity: 0; } }
        @keyframes snowmanWobble { 0%, 100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
      `}</style>

            {/* Sky */}
            <rect width="200" height="120" fill={bgColor} />

            {/* Snowflakes */}
            <g fill="white" opacity="0.8">
                <circle className="snowflake" cx="30" cy="10" r="3" />
                <circle className="snowflake" cx="70" cy="15" r="2" />
                <circle className="snowflake" cx="120" cy="5" r="3" />
                <circle className="snowflake" cx="160" cy="12" r="2" />
                <circle className="snowflake" cx="180" cy="8" r="3" />
            </g>

            {/* Ground - Snow */}
            <rect x="0" y="95" width="200" height="25" fill="rgba(255,255,255,0.9)" />
            <ellipse cx="50" cy="95" rx="30" ry="5" fill="rgba(255,255,255,0.9)" />
            <ellipse cx="150" cy="95" rx="25" ry="4" fill="rgba(255,255,255,0.9)" />

            {/* Snowman */}
            <g className="snowman">
                {/* Body */}
                <circle cx="100" cy="90" r="15" fill="white" />
                <circle cx="100" cy="70" r="12" fill="white" />
                <circle cx="100" cy="55" r="9" fill="white" />

                {/* Face */}
                <circle cx="97" cy="53" r="1.5" fill="#333" />
                <circle cx="103" cy="53" r="1.5" fill="#333" />
                <path d="M100 56 L103 58" stroke="orange" strokeWidth="2" />

                {/* Hat */}
                <rect x="92" y="42" width="16" height="5" fill="#333" />
                <rect x="95" y="35" width="10" height="8" fill="#333" />

                {/* Arms */}
                <line x1="85" y1="70" x2="70" y2="60" stroke="#5a4a3a" strokeWidth="2" />
                <line x1="115" y1="70" x2="130" y2="60" stroke="#5a4a3a" strokeWidth="2" />
            </g>
        </svg>
    );
}

// ===== STORM SCENE - Lightning =====
function StormScene() {
    return (
        <svg viewBox="0 0 200 120" className="weather-scene">
            <style>{`
        .lightning { animation: lightningFlash 2s ease-in-out infinite; }
        .cloud-dark { animation: cloudMove 4s ease-in-out infinite; }
        @keyframes lightningFlash { 0%, 45%, 55%, 100% { opacity: 0; } 48%, 52% { opacity: 1; } }
        @keyframes cloudMove { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
      `}</style>

            {/* Sky */}
            <rect width="200" height="120" fill="#1a1a2a" />

            {/* Dark clouds */}
            <g className="cloud-dark" fill="#2a2a3a">
                <ellipse cx="50" cy="30" rx="40" ry="20" />
                <ellipse cx="100" cy="25" rx="50" ry="25" />
                <ellipse cx="160" cy="30" rx="35" ry="18" />
            </g>

            {/* Lightning */}
            <polygon className="lightning" points="100,35 90,60 98,60 88,90 115,55 105,55 115,35" fill="#ffd700" />

            {/* Ground */}
            <rect x="0" y="100" width="200" height="20" fill="rgba(0,0,0,0.4)" />

            {/* House silhouette */}
            <g fill="#1a1a25">
                <rect x="130" y="70" width="40" height="30" />
                <polygon points="130,70 150,50 170,70" />
                <rect x="145" y="80" width="10" height="20" fill="#3a3a4a" />
            </g>
        </svg>
    );
}

// ===== FOG SCENE =====
function FogScene() {
    return (
        <svg viewBox="0 0 200 120" className="weather-scene">
            <style>{`
        .fog-layer { animation: fogMove 5s ease-in-out infinite; }
        .fog-layer:nth-child(2) { animation-delay: 1s; animation-direction: reverse; }
        .fog-layer:nth-child(3) { animation-delay: 2s; }
        @keyframes fogMove { 0%, 100% { transform: translateX(0); opacity: 0.6; } 50% { transform: translateX(10px); opacity: 0.9; } }
      `}</style>

            {/* Sky */}
            <rect width="200" height="120" fill="#4a5a6a" />

            {/* Trees - silhouettes */}
            <g fill="rgba(30,40,50,0.5)">
                <polygon points="30,100 40,50 50,100" />
                <polygon points="70,100 85,40 100,100" />
                <polygon points="150,100 165,55 180,100" />
            </g>

            {/* Fog layers */}
            <rect className="fog-layer" x="-20" y="60" width="240" height="20" fill="rgba(200,210,220,0.4)" rx="10" />
            <rect className="fog-layer" x="-10" y="75" width="220" height="15" fill="rgba(200,210,220,0.5)" rx="8" />
            <rect className="fog-layer" x="0" y="88" width="200" height="12" fill="rgba(200,210,220,0.6)" rx="6" />

            {/* Ground */}
            <rect x="0" y="100" width="200" height="20" fill="rgba(40,50,60,0.5)" />
        </svg>
    );
}

// ===== SUNNY SCENE - Girl on swing =====
function SunnyScene() {
    return (
        <svg viewBox="0 0 200 120" className="weather-scene">
            <style>{`
        .sun-glow { animation: sunPulse 3s ease-in-out infinite; }
        .swing { animation: swingMove 2s ease-in-out infinite; transform-origin: 100px 20px; }
        .bird { animation: birdFly 4s ease-in-out infinite; }
        @keyframes sunPulse { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.05); opacity: 1; } }
        @keyframes swingMove { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }
        @keyframes birdFly { 0%, 100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(20px) translateY(-5px); } }
      `}</style>

            {/* Sky */}
            <linearGradient id="sunnyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87ceeb" />
                <stop offset="100%" stopColor="#b8e0f0" />
            </linearGradient>
            <rect width="200" height="120" fill="url(#sunnyGrad)" />

            {/* Sun */}
            <g className="sun-glow">
                <circle cx="160" cy="30" r="25" fill="#ffd93d" />
                <circle cx="160" cy="30" r="35" fill="rgba(255,217,61,0.3)" />
            </g>

            {/* Birds */}
            <g className="bird" fill="none" stroke="#333" strokeWidth="1.5">
                <path d="M30 35 Q35 30 40 35 M40 35 Q45 30 50 35" />
                <path d="M60 25 Q65 20 70 25 M70 25 Q75 20 80 25" />
            </g>

            {/* Ground - Grass */}
            <rect x="0" y="95" width="200" height="25" fill="#7cb342" />

            {/* Tree */}
            <rect x="95" y="20" width="10" height="80" fill="#5d4037" />
            <circle cx="100" cy="25" r="20" fill="#388e3c" />

            {/* Swing */}
            <g className="swing">
                {/* Ropes */}
                <line x1="90" y1="20" x2="85" y2="70" stroke="#8b7355" strokeWidth="2" />
                <line x1="110" y1="20" x2="115" y2="70" stroke="#8b7355" strokeWidth="2" />

                {/* Seat */}
                <rect x="80" y="68" width="40" height="5" fill="#5d4037" rx="2" />

                {/* Girl */}
                <circle cx="100" cy="58" r="6" fill="#ffdbac" /> {/* Head */}
                <ellipse cx="100" cy="64" rx="8" ry="5" fill="#e91e63" /> {/* Dress */}
                <line x1="92" y1="60" x2="85" y2="55" stroke="#ffdbac" strokeWidth="2" /> {/* Arm */}
                <line x1="108" y1="60" x2="115" y2="55" stroke="#ffdbac" strokeWidth="2" /> {/* Arm */}
            </g>

            {/* Flowers */}
            <circle cx="30" cy="100" r="3" fill="#ff6b6b" />
            <circle cx="60" cy="102" r="3" fill="#ffe66d" />
            <circle cx="140" cy="100" r="3" fill="#ff6b6b" />
            <circle cx="170" cy="103" r="3" fill="#c792ea" />
        </svg>
    );
}

// ===== NIGHT SCENE - Stars and moon =====
function NightScene() {
    return (
        <svg viewBox="0 0 200 120" className="weather-scene">
            <style>{`
        .star { animation: twinkle 2s ease-in-out infinite; }
        .star:nth-child(2) { animation-delay: 0.3s; }
        .star:nth-child(3) { animation-delay: 0.6s; }
        .star:nth-child(4) { animation-delay: 0.9s; }
        .star:nth-child(5) { animation-delay: 1.2s; }
        .moon { animation: moonGlow 4s ease-in-out infinite; }
        .cat { animation: catTail 1s ease-in-out infinite; transform-origin: 55px 95px; }
        @keyframes twinkle { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes moonGlow { 0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,200,0.5)); } 50% { filter: drop-shadow(0 0 15px rgba(255,255,200,0.8)); } }
        @keyframes catTail { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
      `}</style>

            {/* Sky */}
            <rect width="200" height="120" fill="#0a0a1a" />

            {/* Stars */}
            <g fill="white">
                <circle className="star" cx="30" cy="20" r="1.5" />
                <circle className="star" cx="70" cy="35" r="1" />
                <circle className="star" cx="120" cy="15" r="1.5" />
                <circle className="star" cx="150" cy="40" r="1" />
                <circle className="star" cx="180" cy="25" r="1.5" />
            </g>

            {/* Moon */}
            <g className="moon">
                <circle cx="160" cy="35" r="18" fill="#f5f5dc" />
                <circle cx="155" cy="32" r="3" fill="rgba(200,200,180,0.3)" />
                <circle cx="165" cy="40" r="4" fill="rgba(200,200,180,0.3)" />
            </g>

            {/* Ground */}
            <rect x="0" y="95" width="200" height="25" fill="#1a1a2a" />

            {/* House */}
            <g fill="#2a2a3a">
                <rect x="20" y="65" width="50" height="35" />
                <polygon points="20,65 45,45 70,65" />
                <rect x="35" y="80" width="12" height="20" fill="#ffd700" opacity="0.8" /> {/* Window light */}
            </g>

            {/* Cat on roof */}
            <g className="cat" fill="#1a1a25">
                <ellipse cx="55" cy="60" rx="8" ry="5" />
                <circle cx="48" cy="58" r="4" />
                {/* Ears */}
                <polygon points="45,55 47,50 49,55" />
                <polygon points="47,55 49,50 51,55" />
                {/* Tail */}
                <path d="M63 60 Q70 55 68 65" stroke="#1a1a25" strokeWidth="3" fill="none" />
            </g>
        </svg>
    );
}

// ===== CLOUDY SCENE =====
function CloudyScene() {
    return (
        <svg viewBox="0 0 200 120" className="weather-scene">
            <style>{`
        .cloud1 { animation: cloudDrift 8s ease-in-out infinite; }
        .cloud2 { animation: cloudDrift 10s ease-in-out infinite reverse; }
        .cloud3 { animation: cloudDrift 6s ease-in-out infinite; animation-delay: 2s; }
        .kite { animation: kiteFly 3s ease-in-out infinite; transform-origin: 160px 80px; }
        @keyframes cloudDrift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
        @keyframes kiteFly { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
      `}</style>

            {/* Sky */}
            <rect width="200" height="120" fill="#8fa4b8" />

            {/* Clouds */}
            <g fill="rgba(255,255,255,0.9)">
                <ellipse className="cloud1" cx="40" cy="30" rx="30" ry="15" />
                <ellipse className="cloud1" cx="55" cy="25" rx="20" ry="12" />

                <ellipse className="cloud2" cx="130" cy="40" rx="35" ry="18" />
                <ellipse className="cloud2" cx="150" cy="35" rx="25" ry="14" />

                <ellipse className="cloud3" cx="80" cy="55" rx="25" ry="12" />
            </g>

            {/* Ground */}
            <rect x="0" y="95" width="200" height="25" fill="#6b8e4e" />

            {/* Kid with kite */}
            <g>
                {/* Kid */}
                <circle cx="160" cy="82" r="5" fill="#ffdbac" />
                <ellipse cx="160" cy="92" rx="6" ry="8" fill="#3498db" />
                <line x1="165" y1="88" x2="175" y2="75" stroke="#333" strokeWidth="1" /> {/* String */}

                {/* Kite */}
                <g className="kite">
                    <polygon points="175,45 185,55 175,65 165,55" fill="#e74c3c" />
                    <line x1="175" y1="65" x2="175" y2="75" stroke="#333" strokeWidth="1" />
                </g>
            </g>
        </svg>
    );
}

export default WeatherScene;
