# ai-logs
import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "confidence", label: "Confidence", emoji: "✦", color: "#FF6B6B", bg: "from-[#FF6B6B] to-[#FF8E53]" },
  { id: "gratitude",  label: "Gratitude",  emoji: "✿", color: "#FFD93D", bg: "from-[#FFD93D] to-[#FF9A3C]" },
  { id: "love",       label: "Love",       emoji: "♡", color: "#FF85A1", bg: "from-[#FF85A1] to-[#FF6B9D]" },
  { id: "success",    label: "Success",    emoji: "◈", color: "#6BCB77", bg: "from-[#6BCB77] to-[#4D9DE0]" },
  { id: "health",     label: "Health",     emoji: "◉", color: "#4ECDC4", bg: "from-[#4ECDC4] to-[#44A08D]" },
  { id: "peace",      label: "Peace",      emoji: "◌", color: "#A29BFE", bg: "from-[#A29BFE] to-[#6C5CE7]" },
];

const AFFIRMATIONS = {
  confidence: [
    "I am enough, exactly as I am right now.",
    "I trust myself completely and deeply.",
    "I radiate confidence in everything I do.",
    "My voice matters and deserves to be heard.",
    "I am worthy of all the good life has to offer.",
    "I face challenges with courage and grace.",
    "I believe in my ability to figure things out.",
    "I am becoming more powerful every single day.",
  ],
  gratitude: [
    "I am grateful for the miracle of this breath.",
    "Every day holds a gift waiting to be found.",
    "I overflow with appreciation for my life.",
    "I find beauty in the ordinary moments.",
    "My heart is open to receive all life's blessings.",
    "I am thankful for the lessons hidden in struggle.",
    "Abundance flows freely through my grateful heart.",
    "I celebrate the small victories that shape my days.",
  ],
  love: [
    "I am deeply loved and worthy of love.",
    "Love enters my life effortlessly and naturally.",
    "I give and receive love with an open heart.",
    "I attract relationships that nurture my soul.",
    "I love myself completely, flaws and all.",
    "My heart is a sanctuary of warmth and compassion.",
    "I deserve a love that feels like coming home.",
    "Love is the foundation of everything I do.",
  ],
  success: [
    "Success flows to me from all directions.",
    "I am magnetic to opportunities and abundance.",
    "Everything I touch transforms into gold.",
    "I create my reality with intention and action.",
    "My dreams are valid and within my reach.",
    "I am a powerful creator of my own destiny.",
    "Prosperity is my natural state of being.",
    "I succeed because I never stop trying.",
  ],
  health: [
    "My body is a vessel of vitality and strength.",
    "Every cell in my body vibrates with good health.",
    "I nourish myself with love, rest, and good food.",
    "I am becoming stronger, healthier, and more vibrant.",
    "My body heals itself naturally and effortlessly.",
    "I honor my body by listening to its wisdom.",
    "Energy and wellness are my natural birthright.",
    "I am grateful for this strong and capable body.",
  ],
  peace: [
    "I am the calm center of my own universe.",
    "Peace lives within me and radiates outward.",
    "I release what no longer serves my highest good.",
    "Stillness is my superpower.",
    "I choose peace over perfection every single time.",
    "My mind is quiet, clear, and at ease.",
    "I trust the timing of my unfolding life.",
    "Serenity is not found — it is cultivated within.",
  ],
};

const GRADIENT_THEMES = [
  { bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", card: "rgba(255,255,255,0.05)", accent: "#e94560" },
  { bg: "linear-gradient(135deg, #0d0d0d 0%, #1a0a00 50%, #2d1200 100%)", card: "rgba(255,180,80,0.08)", accent: "#FF8C42" },
  { bg: "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #1b2a4a 100%)", card: "rgba(100,200,255,0.06)", accent: "#4ECDC4" },
  { bg: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", card: "rgba(160,140,255,0.08)", accent: "#A29BFE" },
  { bg: "linear-gradient(135deg, #0d1a10 0%, #0a2010 50%, #0f2a18 100%)", card: "rgba(100,200,120,0.07)", accent: "#6BCB77" },
  { bg: "linear-gradient(135deg, #1a0010 0%, #2d0025 50%, #1a0018 100%)", card: "rgba(255,130,160,0.08)", accent: "#FF85A1" },
];

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getStreak(history) {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (history[key]) streak++;
    else break;
  }
  return streak;
}

function getLast30Days() {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 15,
    opacity: Math.random() * 0.4 + 0.1,
  }));
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            bottom: "-10px",
            background: "rgba(255,255,255,0.6)",
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  );
}

function CategoryPill({ cat, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
      style={{
        background: active ? cat.color : "rgba(255,255,255,0.08)",
        color: active ? "#000" : "rgba(255,255,255,0.6)",
        boxShadow: active ? `0 0 20px ${cat.color}60` : "none",
        transform: active ? "scale(1.05)" : "scale(1)",
      }}
    >
      <span style={{ fontSize: 12 }}>{cat.emoji}</span>
      {cat.label}
    </button>
  );
}

function AffirmationCard({ text, category, themeIdx, isFavorite, onFavorite, onNext, onPrev }) {
  const cat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const theme = GRADIENT_THEMES[themeIdx % GRADIENT_THEMES.length];
  const [swipeState, setSwipeState] = useState({ startX: 0, dx: 0, active: false });
  const [leaving, setLeaving] = useState(null); // "left" | "right" | null
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, [text]);

  const handleTouchStart = e => {
    setSwipeState({ startX: e.touches[0].clientX, dx: 0, active: true });
  };
  const handleTouchMove = e => {
    if (!swipeState.active) return;
    const dx = e.touches[0].clientX - swipeState.startX;
    setSwipeState(s => ({ ...s, dx }));
  };
  const handleTouchEnd = () => {
    if (Math.abs(swipeState.dx) > 60) {
      const dir = swipeState.dx < 0 ? "left" : "right";
      setLeaving(dir);
      setTimeout(() => {
        setLeaving(null);
        if (dir === "left") onNext();
        else onPrev();
      }, 300);
    }
    setSwipeState({ startX: 0, dx: 0, active: false });
  };

  const rotate = swipeState.dx * 0.04;
  const translateX = swipeState.dx;

  return (
    <div
      className="relative w-full select-none"
      style={{ height: "62vh", minHeight: 340 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          background: theme.bg,
          border: "1px solid rgba(255,255,255,0.08)",
          transform: leaving === "left"
            ? "translateX(-120%) rotate(-15deg)"
            : leaving === "right"
            ? "translateX(120%) rotate(15deg)"
            : `translateX(${translateX}px) rotate(${rotate}deg)`,
          opacity: mounted ? 1 : 0,
          transition: leaving
            ? "transform 0.3s ease, opacity 0.3s ease"
            : swipeState.active
            ? "none"
            : "transform 0.4s cubic-bezier(.17,.67,.35,1.2), opacity 0.5s ease",
          boxShadow: `0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }}
        />

        {/* Glow orb */}
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 200,
            height: 200,
            top: "10%",
            right: "-10%",
            background: cat.color,
            opacity: 0.12,
          }}
        />
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 150,
            height: 150,
            bottom: "15%",
            left: "-5%",
            background: theme.accent,
            opacity: 0.08,
          }}
        />

        {/* Category badge */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1 rounded-full"
            style={{
              background: `${cat.color}20`,
              color: cat.color,
              border: `1px solid ${cat.color}40`,
            }}
          >
            {cat.emoji} {cat.label}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={onFavorite}
          className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            background: isFavorite ? "rgba(255,100,100,0.2)" : "rgba(255,255,255,0.06)",
            border: isFavorite ? "1px solid rgba(255,100,100,0.4)" : "1px solid rgba(255,255,255,0.1)",
            transform: isFavorite ? "scale(1.1)" : "scale(1)",
          }}
        >
          <span style={{ fontSize: 16 }}>{isFavorite ? "♥" : "♡"}</span>
        </button>

        {/* Main text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <p
            className="text-center leading-relaxed"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              letterSpacing: "0.01em",
              lineHeight: 1.55,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            {text}
          </p>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>
            SWIPE TO EXPLORE
          </p>
        </div>
      </div>
    </div>
  );
}

function FavoriteCard({ text, category, onRemove }) {
  const cat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  return (
    <div
      className="relative rounded-2xl p-4 mb-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: `3px solid ${cat.color}`,
      }}
    >
      <p style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.5 }}>
        {text}
      </p>
      <div className="flex items-center justify-between mt-2">
        <span style={{ fontSize: 11, color: cat.color, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {cat.emoji} {cat.label}
        </span>
        <button
          onClick={onRemove}
          style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function StreakCalendar({ history }) {
  const days = getLast30Days();
  return (
    <div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {days.map(d => {
          const done = !!history[d];
          const isToday = d === getTodayKey();
          return (
            <div
              key={d}
              className="aspect-square rounded-lg flex items-center justify-center"
              style={{
                background: done ? "#6BCB77" : "rgba(255,255,255,0.04)",
                border: isToday ? "1.5px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.06)",
                fontSize: 9,
                color: done ? "#fff" : "rgba(255,255,255,0.2)",
              }}
            >
              {done ? "✓" : ""}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 8 }}>
        Last 30 days
      </p>
    </div>
  );
}

function NotificationModal({ onClose }) {
  const [time, setTime] = useState("08:00");
  const [saved, setSaved] = useState(false);
  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl p-6 pb-10"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", marginBottom: 8 }}>
          Daily Reminder
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
          Set a time to receive your daily affirmation reminder.
        </p>
        <div
          className="rounded-2xl p-4 mb-6 flex items-center justify-between"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Reminder time</span>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              outline: "none",
              fontFamily: "monospace",
            }}
          />
        </div>
        <button
          onClick={() => { setSaved(true); setTimeout(onClose, 800); }}
          className="w-full py-4 rounded-2xl font-semibold text-black transition-all"
          style={{
            background: saved ? "#6BCB77" : "linear-gradient(135deg, #FFD93D, #FF8C42)",
            fontSize: 15,
            letterSpacing: "0.05em",
          }}
        >
          {saved ? "✓ Reminder Set!" : "Set Reminder"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [category, setCategory] = useState("confidence");
  const [cardIndex, setCardIndex] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [favorites, setFavorites] = useState({});   // key: "cat:idx" → { text, category }
  const [history, setHistory] = useState(() => ({ [getTodayKey()]: true }));
  const [showNotif, setShowNotif] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const cards = AFFIRMATIONS[category] || [];
  const currentText = cards[cardIndex % cards.length];
  const favKey = `${category}:${cardIndex % cards.length}`;
  const isFav = !!favorites[favKey];
  const streak = getStreak(history);

  const goNext = useCallback(() => {
    setCardIndex(i => i + 1);
    setThemeIndex(t => t + 1);
    setHistory(h => ({ ...h, [getTodayKey()]: true }));
  }, []);

  const goPrev = useCallback(() => {
    setCardIndex(i => Math.max(0, i - 1));
    setThemeIndex(t => Math.max(0, t - 1));
  }, []);

  const toggleFav = () => {
    setFavorites(f => {
      if (f[favKey]) {
        const next = { ...f };
        delete next[favKey];
        return next;
      }
      return { ...f, [favKey]: { text: currentText, category } };
    });
  };

  const favList = Object.entries(favorites).map(([k, v]) => ({ key: k, ...v }));

  return (
    <div
      className="min-h-screen w-full overflow-hidden"
      style={{
        background: "#080810",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        maxWidth: 430,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: var(--op); }
          50% { opacity: calc(var(--op) * 1.5); }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
        }
      `}</style>

      <Particles />

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-6 pt-12 pb-4"
        style={{
          opacity: mounted ? 1 : 0,
          animation: mounted ? "fadeIn 0.6s ease" : "none",
        }}
      >
        <div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long" })}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#fff", fontWeight: 500, lineHeight: 1.1 }}>
            I Am
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,180,50,0.12)", border: "1px solid rgba(255,180,50,0.2)" }}
          >
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#FFD93D" }}>{streak}</span>
          </div>
          {/* Notification bell */}
          <button
            onClick={() => setShowNotif(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span style={{ fontSize: 16 }}>🔔</span>
          </button>
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "home" && (
        <div
          className="px-5 pb-32"
          style={{ animation: "slideUp 0.5s ease" }}
        >
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-5" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <CategoryPill
                key={cat.id}
                cat={cat}
                active={category === cat.id}
                onClick={() => { setCategory(cat.id); setCardIndex(0); setThemeIndex(0); }}
              />
            ))}
          </div>

          {/* Card */}
          <AffirmationCard
            text={currentText}
            category={category}
            themeIdx={themeIndex}
            isFavorite={isFav}
            onFavorite={toggleFav}
            onNext={goNext}
            onPrev={goPrev}
          />

          {/* Nav buttons */}
          <div className="flex items-center justify-center gap-6 mt-5">
            <button
              onClick={goPrev}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 18 }}
            >
              ←
            </button>
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-6 h-12 rounded-full font-medium transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: 14,
                letterSpacing: "0.05em",
              }}
            >
              Next Affirmation →
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {cards.slice(0, 8).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === cardIndex % cards.length ? 16 : 6,
                  height: 6,
                  background: i === cardIndex % cards.length
                    ? CATEGORIES.find(c => c.id === category)?.color || "#fff"
                    : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>

          {/* Quick inspiration grid */}
          <div className="mt-6">
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
              Other Categories
            </p>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.filter(c => c.id !== category).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setCardIndex(0); }}
                  className="rounded-2xl p-3 text-left transition-all active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}05)`,
                    border: `1px solid ${cat.color}25`,
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.emoji}</div>
                  <p style={{ fontSize: 11, color: cat.color, fontWeight: 600, letterSpacing: "0.05em" }}>{cat.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="px-5 pb-32" style={{ animation: "slideUp 0.4s ease" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", marginBottom: 20 }}>
            Saved Affirmations
          </h2>
          {favList.length === 0 ? (
            <div
              className="rounded-3xl flex flex-col items-center justify-center py-16"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span style={{ fontSize: 40, marginBottom: 16, opacity: 0.5 }}>♡</span>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, textAlign: "center" }}>
                Tap ♡ on any affirmation{"\n"}to save it here
              </p>
            </div>
          ) : (
            <div>
              {favList.map(item => (
                <FavoriteCard
                  key={item.key}
                  text={item.text}
                  category={item.category}
                  onRemove={() => setFavorites(f => { const n = { ...f }; delete n[item.key]; return n; })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "streak" && (
        <div className="px-5 pb-32" style={{ animation: "slideUp 0.4s ease" }}>
          {/* Big streak number */}
          <div
            className="rounded-3xl p-6 mb-5 flex items-center gap-6"
            style={{
              background: "linear-gradient(135deg, rgba(255,180,50,0.12), rgba(255,100,50,0.08))",
              border: "1px solid rgba(255,180,50,0.15)",
            }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
              style={{ background: "rgba(255,180,50,0.15)", animation: "pulseRing 3s ease infinite" }}
            >
              <span style={{ fontSize: 30 }}>🔥</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#FFD93D", lineHeight: 1 }}>{streak}</span>
            </div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff" }}>
                Day Streak
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                Keep going — you're building{"\n"}a powerful habit.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Total Sessions", value: Object.keys(history).length, icon: "◈" },
              { label: "Favorites Saved", value: favList.length, icon: "♥" },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p style={{ fontSize: 22, marginBottom: 2 }}>{stat.icon}</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{stat.value}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 14, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 11 }}>
              Activity Calendar
            </p>
            <StreakCalendar history={history} />
          </div>

          {/* Motivational quote */}
          <div
            className="rounded-2xl p-5 mt-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "3px solid #6BCB77",
            }}
          >
            <p style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.7)", fontSize: 14, fontStyle: "italic", lineHeight: 1.6 }}>
              "The secret of your future is hidden in your daily routine."
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>— Mike Murdock</p>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="px-5 pb-32" style={{ animation: "slideUp 0.4s ease" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", marginBottom: 24 }}>
            Settings
          </h2>

          {[
            { icon: "🔔", title: "Daily Reminder", sub: "Get notified to affirm daily", action: () => setShowNotif(true) },
            { icon: "🌙", title: "Dark Mode", sub: "Always on — designed for night", action: null },
            { icon: "✦", title: "Affirmation Style", sub: "Poetic & introspective", action: null },
            { icon: "♡", title: "Favorites Count", sub: `${favList.length} saved affirmations`, action: () => setActiveTab("favorites") },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center gap-4 p-4 rounded-2xl mb-3 text-left transition-all active:scale-99"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                cursor: item.action ? "pointer" : "default",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.06)", fontSize: 18 }}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{item.title}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 1 }}>{item.sub}</p>
              </div>
              {item.action && <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 18 }}>›</span>}
            </button>
          ))}

          <div
            className="rounded-2xl p-5 mt-2"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "rgba(255,255,255,0.6)", textAlign: "center", fontStyle: "italic" }}>
              I Am — Daily Affirmations
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 4, letterSpacing: "0.1em" }}>
              VERSION 1.0 · MADE WITH INTENTION
            </p>
          </div>
        </div>
      )}

      {/* ── Bottom Nav ── */}
      <div
        className="fixed bottom-0 left-1/2 w-full max-w-sm"
        style={{
          transform: "translateX(-50%)",
          background: "rgba(8,8,16,0.9)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingBottom: "env(safe-area-inset-bottom, 16px)",
        }}
      >
        <div className="flex items-center justify-around py-3 px-4">
          {[
            { id: "home",      icon: "✦", label: "Today" },
            { id: "favorites", icon: "♡", label: "Saved" },
            { id: "streak",    icon: "🔥", label: "Streak" },
            { id: "settings",  icon: "◎", label: "Settings" },
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200"
                style={{ opacity: active ? 1 : 0.4 }}
              >
                <span
                  style={{
                    fontSize: tab.icon.length > 1 ? 18 : 16,
                    filter: active ? "none" : "grayscale(1)",
                    transition: "transform 0.2s",
                    transform: active ? "scale(1.15)" : "scale(1)",
                    display: "block",
                  }}
                >
                  {tab.icon}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#fff" : "rgba(255,255,255,0.5)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {tab.label}
                </span>
                {active && (
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: CATEGORIES.find(c => c.id === category)?.color || "#fff" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Notification Modal ── */}
      {showNotif && <NotificationModal onClose={() => setShowNotif(false)} />}
    </div>
  );
}

I Am — Daily Affirmations is a elegant, immersive React web application designed to help users cultivate positivity, mindfulness, and self-growth through daily affirmations.
Built with a soothing dark aesthetic, smooth animations, and intuitive touch interactions, this app transforms your screen into a personal sanctuary of empowerment. Users can explore six thoughtfully curated categories — Confidence, Gratitude, Love, Success, Health, and Peace — each featuring unique poetic affirmations paired with stunning gradient themes that shift dynamically with every swipe.
Key features include fully gesture-enabled swipeable affirmation cards (with smooth physics and transitions), a robust favorites system to save meaningful messages, comprehensive daily streak tracking with a visual 30-day calendar, and progress statistics. The app automatically logs daily engagement and celebrates consistency with a prominent streak counter.
Additional highlights include quick category switching via elegant pills, a daily reminder setup modal with time picker, and a clean four-tab navigation (Today, Saved, Streak, Settings). The interface is fully responsive and optimized for mobile use, delivering a premium, app-like experience directly in the browser.
Technically, the project showcases modern React development using hooks (useState, useEffect, useRef, useCallback), custom CSS with advanced animations, glassmorphism effects, and carefully crafted micro-interactions. No external UI libraries are used — every detail from particle backgrounds to card rotation physics was built from scratch for maximum performance and visual polish.
Whether you're starting your morning routine, practicing gratitude, or seeking motivation during challenging times, I Am provides a beautiful digital space for self-affirmation and personal development. The clean codebase and component architecture make it an excellent reference for developers interested in building engaging, habit-forming wellness applications.
Perfect for mindfulness enthusiasts, personal growth seekers, and React developers looking for inspiration in UI/UX design.
Made with intention for mental wellness.