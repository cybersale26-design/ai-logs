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
...
