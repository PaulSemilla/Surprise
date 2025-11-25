import React, { useRef, useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import gradPhoto from "./assets/IMG_2129.JPG";
import music from "./assets/music.mp3";

// Polaroid photos
import memory1 from "./assets/memory 1.JPG";
import memory2 from "./assets/memory 2.JPG";
import memory3 from "./assets/memory 3.JPG";
import memory4 from "./assets/memory 4.JPG";
import memory5 from "./assets/memory 5.JPG";
import memory6 from "./assets/memory 6.JPG";
import memory7 from "./assets/memory 7.JPG";
import memory8 from "./assets/memory 8.JPG";

const CONFETTI_COLORS = ["#22c55e", "#4ade80", "#facc15", "#fde68a", "#a3e635"];

export default function App() {
  const audioRef = useRef(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeTab, setActiveTab] = useState("me");
  const [showExplosion, setShowExplosion] = useState(true);

  // photos array for collage
  const memoryPhotos = [memory1, memory2, memory3, memory4, memory5, memory6, memory7, memory8];

  // rotations & vertical offsets to mimic the sample layout
  const rotations = [-6, 4, -3, 5, -5, 3, -4, 6];
  const offsets = [0, 16, -8, 24, 8, -4, 18, 6]; // px

  // 🔥 Attempt autoplay immediately on mount (iOS allows silent autoplay)
  useEffect(() => {
    const tryAutoplay = async () => {
      if (!audioRef.current) return;

      try {
        await audioRef.current.play();
      } catch (e) {
        const tapHandler = () => {
          audioRef.current.play().catch(() => {});
          window.removeEventListener("touchend", tapHandler);
        };
        window.addEventListener("touchend", tapHandler);
      }
    };

    tryAutoplay();

    // Hide explosion after animation completes
    const timer = setTimeout(() => setShowExplosion(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Confetti
  const confetti = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        key: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
      })),
    []
  );

  // Explosion confetti (burst from center)
  const explosionConfetti = useMemo(
    () =>
      Array.from({ length: 200 }).map((_, i) => {
        const angle = (i / 200) * Math.PI * 2;
        const velocity = 150 + Math.random() * 400;
        return {
          key: `explosion-${i}`,
          angle,
          velocity,
          size: Math.random() * 12 + 5,
          rotation: Math.random() * 360,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        };
      }),
    []
  );

  // Multiple explosion points across screen
  const multiExplosions = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        key: `multi-explosion-${i}`,
        left: `${10 + (i % 4) * 25}%`,
        top: `${15 + Math.floor(i / 4) * 40}%`,
        delay: i * 0.15,
        particles: Array.from({ length: 50 }).map((_, j) => {
          const angle = (j / 50) * Math.PI * 2;
          const velocity = 100 + Math.random() * 200;
          return {
            angle,
            velocity,
            size: Math.random() * 10 + 4,
            rotation: Math.random() * 360,
            color: CONFETTI_COLORS[j % CONFETTI_COLORS.length],
          };
        }),
      })),
    []
  );

  // Fireworks bursts
  const fireworks = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => ({
        key: `firework-${i}`,
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 60}%`,
        delay: i * 0.2 + Math.random() * 0.3,
        particles: Array.from({ length: 40 }).map((_, j) => {
          const angle = (j / 40) * Math.PI * 2;
          return {
            angle,
            distance: 60 + Math.random() * 80,
            size: Math.random() * 8 + 3,
            color: CONFETTI_COLORS[j % CONFETTI_COLORS.length],
          };
        }),
      })),
    []
  );

  // Falling confetti from top
  const fallingConfetti = useMemo(
    () =>
      Array.from({ length: 150 }).map((_, i) => ({
        key: `falling-${i}`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    []
  );

  const messages = {
    me: [
      ,
    ],
    sister: [`Congrats RN! You did it!! I always knew you would!! Tapos na ang stress at kaba!! Makakatulog ka na ng mahaba haha. So so proud of you!
`],
    parents: [``],
  };

  const currentMessageParagraphs = messages[activeTab] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-yellow-700 flex flex-col items-center justify-start px-4 md:px-6 lg:px-10 py-8 relative overflow-hidden">
      {/* MUSIC (autoplays silently on iPad) */}
      <audio ref={audioRef} src={music} loop />

      {/* EXPLOSION CONFETTI (on page load) */}
      {showExplosion &&
        explosionConfetti.map((c) => {
          const x = Math.cos(c.angle) * c.velocity;
          const y = Math.sin(c.angle) * c.velocity;
          return (
            <motion.div
              key={c.key}
              className="absolute rounded-sm"
              style={{
                left: "50%",
                top: "50%",
                width: c.size,
                height: c.size * 1.5,
                backgroundColor: c.color,
                originX: 0.5,
                originY: 0.5,
              }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: c.rotation }}
              animate={{
                x: [0, x],
                y: [0, y, y + 300],
                opacity: [1, 1, 0],
                rotate: [c.rotation, c.rotation + 360],
              }}
              transition={{
                duration: 2.5,
                ease: [0.33, 1, 0.68, 1],
              }}
            />
          );
        })}

      {/* MULTI-POINT EXPLOSIONS */}
      {showExplosion &&
        multiExplosions.map((explosion) => (
          <motion.div
            key={explosion.key}
            className="absolute"
            style={{ left: explosion.left, top: explosion.top }}
          >
            {explosion.particles.map((p, idx) => {
              const x = Math.cos(p.angle) * p.velocity;
              const y = Math.sin(p.angle) * p.velocity;
              return (
                <motion.div
                  key={idx}
                  className="absolute rounded-sm"
                  style={{
                    width: p.size,
                    height: p.size * 1.5,
                    backgroundColor: p.color,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: p.rotation }}
                  animate={{
                    x: [0, x],
                    y: [0, y, y + 200],
                    opacity: [1, 1, 0],
                    rotate: [p.rotation, p.rotation + 360],
                  }}
                  transition={{
                    duration: 2,
                    delay: explosion.delay,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                />
              );
            })}
          </motion.div>
        ))}

      {/* FALLING CONFETTI FROM TOP */}
      {showExplosion &&
        fallingConfetti.map((c) => (
          <motion.div
            key={c.key}
            className="absolute rounded-sm"
            style={{
              left: c.left,
              top: "-20px",
              width: c.size,
              height: c.size * 1.5,
              backgroundColor: c.color,
            }}
            initial={{ y: -20, opacity: 0, rotate: c.rotation }}
            animate={{
              y: [0, window.innerHeight + 50],
              opacity: [0, 1, 1, 0],
              rotate: [c.rotation, c.rotation + 720],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: "easeIn",
            }}
          />
        ))}

      {/* FIREWORKS */}
      {showExplosion &&
        fireworks.map((fw) => (
          <motion.div
            key={fw.key}
            className="absolute"
            style={{ left: fw.left, top: fw.top }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: fw.delay }}
          >
            {fw.particles.map((p, idx) => {
              const x = Math.cos(p.angle) * p.distance;
              const y = Math.sin(p.angle) * p.distance;
              return (
                <motion.div
                  key={idx}
                  className="absolute rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: [0, x],
                    y: [0, y],
                    opacity: [1, 1, 0],
                    scale: [0, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: fw.delay,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </motion.div>
        ))}

      {/* Glow Overlay */}
      <motion.div
        className="absolute inset-0 opacity-40 mix-blend-soft-light pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(16,185,129,0.6), transparent 55%)",
            "radial-gradient(circle at 80% 60%, rgba(234,179,8,0.7), transparent 55%)",
            "radial-gradient(circle at 50% 80%, rgba(6,95,70,0.7), transparent 65%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* CONFETTI */}
      {confetti.map((c, index) => (
        <motion.div
          key={c.key}
          className="absolute rounded-sm"
          style={{
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size * 1.5,
            backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [c.rotation, c.rotation + 180, c.rotation + 360],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: c.delay,
          }}
        />
      ))}

      {/* FLOATING ICONS */}
      <motion.div
        className="absolute text-yellow-300 text-4xl"
        animate={{ y: [-10, -40, -10], x: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ left: "8%", bottom: "10%", opacity: 0.9 }}
      >
        🎉
      </motion.div>

      <motion.div
        className="absolute text-emerald-300 text-5xl"
        animate={{ y: [-15, -50, -15], x: [0, -12, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        style={{ left: "84%", bottom: "18%", opacity: 0.75 }}
      >
        🩺
      </motion.div>

      <motion.div
        className="absolute text-yellow-200 text-3xl"
        animate={{ y: [-5, -30, -5], x: [0, 6, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        style={{ right: "16%", top: "15%", opacity: 0.8 }}
      >
        🎓
      </motion.div>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl md:max-w-2xl bg-emerald-950/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.9)] border border-emerald-700/70 p-7 md:p-9 lg:p-10 text-center overflow-hidden"
      >
        {/* Polaroid Frame for main grad photo */}
        <motion.div
          className="relative mx-auto w-[240px] md:w-[260px] lg:w-[280px] bg-white rounded-xl shadow-xl border border-gray-200"
          style={{ padding: "14px 14px 50px 14px" }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 250 }}
        >
          <img
            src={gradPhoto}
            alt="Julienne Khrizia Cuevas"
            className="w-full h-auto object-cover rounded-md shadow-md"
          />

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center w-full">
            <p
              className="text-2xl font-normal text-yellow-700 tracking-wide"
              style={{ fontFamily: '"Lora", serif' }}
            >
              RN 2025! 💚💛
            </p>
          </div>
        </motion.div>

        {/* Titles */}
        <motion.h1
          className="mt-7 text-3xl md:text-4xl font-black leading-tight"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-emerald-200 via-yellow-100 to-emerald-100 bg-clip-text text-transparent">
            Congratulations!
          </span>
          <span className="block text-2xl md:text-3xl mt-1 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
            Julienne Khrizia DC. Cuevas
          </span>
        </motion.h1>

        {/* Badges */}
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            className="px-5 py-2.5 rounded-2xl bg-emerald-800/80 border border-emerald-400/70 text-xs md:text-sm text-emerald-50 font-semibold flex items-center gap-2 shadow-md shadow-black/50"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            🩺 Board Passer 2025
          </motion.span>

          <motion.span
            className="px-5 py-2.5 rounded-2xl bg-yellow-500/90 border border-yellow-300/90 text-xs md:text-sm text-emerald-950 font-semibold flex items-center gap-2 shadow-md shadow-yellow-900/60"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            🎓 Cum Laude Graduate
          </motion.span>
        </motion.div>

        {/* Short message */}
        <motion.p
          className="mt-6 text-base md:text-[17px] text-white/90 leading-relaxed font-medium px-3 md:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          You made it!{" "}
          <span className="font-bold text-yellow-300">
            We are all so proud of you!
          </span>
        </motion.p>

        {/* Button */}
        <motion.button
          onClick={() => {
            setActiveTab("me");
            setShowMessageModal(true);
          }}
          className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-yellow-400 text-emerald-950 text-sm md:text-base font-bold shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.95)] transition-all duration-300 relative overflow-hidden group"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Click me! 💌
        </motion.button>

        {/* Footer */}
        <motion.div
          className="mt-8 pt-6 border-t border-emerald-700/70 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-xs md:text-sm text-emerald-100 font-semibold flex items-center justify-center gap-2">
            🏅 Pinakamaangas na nurse sa buong Manila 🏅
          </p>
        </motion.div>
      </motion.div>

      {/* PHOTO COLLAGE – POLAROID STYLE, NO TEXT */}
      <motion.section
        className="relative z-10 w-full max-w-4xl mt-10 mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-7">
          {memoryPhotos.map((src, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-[18px] shadow-xl border border-gray-200 p-2 pb-5 overflow-hidden"
              style={{
                width: "120px",
                marginTop: offsets[index] || 0,
              }}
              initial={{ rotate: rotations[index] || 0 }}
              whileHover={{ rotate: 0, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
            >
              <div className="rounded-[12px] overflow-hidden h-36 md:h-40">
                <img
                  src={src}
                  alt={`memory ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* blank bottom space to look like polaroid – no text */}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* MESSAGE MODAL */}
      {showMessageModal && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-emerald-950 rounded-3xl max-w-lg w-full p-7 md:p-8 shadow-2xl border-2 border-emerald-500/80 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <motion.button
              onClick={() => setShowMessageModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-emerald-800 text-emerald-100 hover:bg-emerald-700 text-xl font-bold flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>

            <h2 className="relative text-2xl font-black text-yellow-200 text-center mb-6 flex items-center justify-center gap-2">
              From Loved Ones ❤️
            </h2>

            {/* Tabs */}
            <div className="relative flex flex-wrap justify-center gap-2 mb-6 text-xs md:text-sm">
              {["me", "sister", "parents"].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 rounded-xl border-2 font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-emerald-500 to-yellow-400 text-emerald-950 border-yellow-400 shadow-lg shadow-black/60"
                      : "bg-emerald-900/80 text-emerald-100 border-emerald-600 hover:bg-emerald-800"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab === "me"
                    ? "From Kervy"
                    : tab === "sister"
                    ? "From Ate Dianne"
                    : "From Mama and Papa"}
                </motion.button>
              ))}
            </div>

            {/* Message content */}
            <motion.div
              className="relative text-sm text-emerald-50 leading-relaxed space-y-4 max-h-72 md:max-h-80 overflow-y-auto px-2 py-1 flex-1"
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              {currentMessageParagraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="bg-emerald-900/80 rounded-xl p-4 border border-emerald-700 shadow-sm"
                >
                  {p}
                </p>
              ))}
            </motion.div>

            <div className="relative mt-6 flex justify-center">
              <motion.button
                onClick={() => setShowMessageModal(false)}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-yellow-400 text-emerald-950 text-sm md:text-base font-bold shadow-lg shadow-black/70 hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close 💕
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
