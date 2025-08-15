// Animated Blue Ring Background
// Option A: High‑performance Canvas ring (no heavy deps)
// Drop <BlueRingBackground /> at the top of your page (positioned absolute) behind content.

import { useEffect, useRef } from "react";

export default function BlueRingBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(DPR, DPR);

    const CENTER = { x: w / 2, y: h / 2 };

    // Particle ring params (tuned for desktop + mobile)
    const particles = 900; // increase for denser ring (cost: fill calls)
    const baseRadius = Math.min(w, h) * 0.27; // ring radius
    const thickness = Math.min(w, h) * 0.11; // ring thickness

    // Precompute angles for the ring points
    const pts = new Array(particles).fill(0).map((_, i) => {
      const a = (i / particles) * Math.PI * 2;
      return { a, n: Math.random() * 1000 };
    });

    let t = 0;
    function noise1d(x: number) {
      // Very cheap pseudo-noise (sin blend)
      return (
        Math.sin(x * 1.3) * 0.5 +
        Math.sin(x * 0.7 + 10) * 0.3 +
        Math.sin(x * 2.7 + 3) * 0.2
      );
    }

    function render() {
      t += 0.0035; // animation speed
      ctx.clearRect(0, 0, w, h);

      // background vignette (subtle)
      const grd = ctx.createRadialGradient(
        CENTER.x,
        CENTER.y,
        Math.min(w, h) * 0.1,
        CENTER.x,
        CENTER.y,
        Math.max(w, h)
      );
      grd.addColorStop(0, "rgba(2, 6, 23, 0.2)"); // slate-950 at low alpha
      grd.addColorStop(1, "rgba(2, 6, 23, 0.75)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // soft glow underlayer
      ctx.save();
      ctx.globalCompositeOperation = "lighter"; // add
      for (let i = 0; i < pts.length; i++) {
        const { a, n } = pts[i];
        // wobble radius with cheap noise to simulate fluid motion
        const rNoise = noise1d(a * 1.2 + t * 2 + n) * (thickness * 0.33);
        const r = baseRadius + rNoise;

        const x = CENTER.x + Math.cos(a) * r;
        const y = CENTER.y + Math.sin(a) * r;

        // thickness falloff to shape the torus band
        const band = (noise1d(a * 2.1 - t * 1.2 + n) + 1) * 0.5; // 0..1
        const size = 0.8 + band * 2.2; // px

        // blue/cyan mix gradient per point
        const hue = 205 + band * 35; // 205 (cyan) -> 240 (indigo)
        const alpha = 0.06 + band * 0.07;
        ctx.fillStyle = `hsla(${hue}, 88%, 60%, ${alpha})`;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // soft blur overlay via canvas shadow (cheap-ish)
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.filter = "blur(6px)";
      ctx.drawImage(canvas, 0, 0, w, h);
      ctx.restore();

      rafRef.current = requestAnimationFrame(render);
    }

    function onResize() {
      w = window.innerWidth;
      h = window.innerHeight;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
      CENTER.x = w / 2; // TS will complain: CENTER is const
      CENTER.y = h / 2; // but we’re mutating fields; suppress with //@ts-ignore
      // @ts-ignore
      CENTER.x = w / 2;
      // @ts-ignore
      CENTER.y = h / 2;
    }

    window.addEventListener("resize", onResize);
    render();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full [contain:layout_paint_size]"
    />
  );
}

// ---------------------------------------------------------------------------
// Option B: Lightweight video loop (author an MP4/WebM of your ring and loop it)
// Usage: place <BackgroundVideo srcMp4="/ring.mp4" srcWebm="/ring.webm" />
// Pros: zero CPU once decoded, very crisp art‑directed visual. Cons: adds MBs.

// export function BackgroundVideo({ srcMp4, srcWebm }: { srcMp4?: string; srcWebm?: string }) {
//   return (
//     <video
//       className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
//       autoPlay
//       playsInline
//       muted
//       loop
//       preload="auto"
//       poster="/ring-poster.jpg" // fallback image
//     >
//       {srcWebm && <source src={srcWebm} type="video/webm" />}
//       {srcMp4 && <source src={srcMp4} type="video/mp4" />}
//     </video>
//   );
// }

// Integration tips:
// 1) If you want the background only behind hero, wrap it in a relative section and use absolute positioning instead of fixed.
// 2) Keep particles <= 1200 for mobile. The Canvas version is ~1–2ms/frame on modern laptops.
// 3) For a darker/stronger look, draw a second ring (different baseRadius) or increase thickness.
