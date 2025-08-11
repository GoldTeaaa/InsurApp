"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Shield, LogIn } from "lucide-react";
import Link from "next/link";

// Lean, light-only welcome page (no theme toggle)
export default function WelcomeLanding() {
  const [timeOfDay, setTimeOfDay] = useState("Halo");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("Selamat pagi");
    else if (hour < 18) setTimeOfDay("Selamat sore");
    else setTimeOfDay("Selamat malam");
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-white to-white text-slate-900 antialiased">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm shadow-blue-900/10">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold tracking-tight">BrokerCRM</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <LogIn className="mr-2 h-4 w-4" /> Masuk
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-14 md:pt-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
              {timeOfDay}, kelola polis & nasabah dengan UI <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">minimal</span> yang tetap <span className="bg-gradient-to-r from-cyan-600 to-indigo-500 bg-clip-text text-transparent">dinamis</span>.
            </h1>

            <Link href="/dashboard" className="flex gap-3">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <LogIn className="mr-2 h-5 w-5" /> Masuk
              </Button>
            </Link>
            <div className="flex items-center gap-6 pt-2 opacity-90">
              <Stat label="Akurasi input" value="99%" />
              <Stat label="Waktu input" value="-42%" />
              <Stat label="Staf awal" value="5" />
            </div>
          </motion.div>

          {/* Playful 3D-ish orb */}
          <Orb3D />
        </div>

        {/* Divider */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      </section>

      {/* Minimal features strip */}
      {/* <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-3 md:grid-cols-3">
          <MiniFeature title="Pencarian Cepat" desc="Filter nama nasabah, perusahaan, no polis secara instan." />
          <MiniFeature title="Validasi Kuat" desc="Zod + React Hook Form, bebas typo & format salah." />
          <MiniFeature title="Siap Power BI" desc="View SQL terindeks, refresh manual hemat biaya." />
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/60 py-8 text-sm text-slate-600">
        <div className="mx-auto max-w-7xl px-4">© {new Date().getFullYear()} BrokerCRM • Internal dashboard.</div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function MiniFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="border-slate-200/60 bg-white/70 backdrop-blur">
      <CardContent className="p-5">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-sm text-slate-600">{desc}</div>
      </CardContent>
    </Card>
  );
}

function Orb3D() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [0, 1], [12, -12]);
  const rotateY = useTransform(mx, [0, 1], [-12, 12]);

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mx.set(x);
        my.set(y);
      }}
      className="relative mx-auto grid w-full max-w-lg place-items-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.05 }}
    >
      {/* Soft background glow */}
      <motion.div
        className="absolute -z-10 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-300 to-cyan-300 blur-2xl"
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 3D-ish interactive orb */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" as any }}
        className="relative h-72 w-72 rounded-full border border-slate-200/80 bg-white shadow-2xl shadow-blue-500/10 ring-1 ring-blue-100/60"
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ background: "conic-gradient(from 0deg, #38bdf8, #2563eb, #06b6d4, #3b82f6, #38bdf8)" }}
        />
        <div className="absolute inset-[10%] rounded-full bg-white" />
        {/* small floating badges */}
        <motion.div
          className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-blue-600 px-2 py-1 text-[10px] text-white shadow"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Validasi Zod
        </motion.div>
        <motion.div
          className="absolute bottom-3 left-3 rounded-full bg-cyan-600 px-2 py-1 text-[10px] text-white shadow"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          TanStack Table
        </motion.div>
        <motion.div
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-2 py-1 text-[10px] text-white shadow"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Power BI Ready
        </motion.div>
      </motion.div>
    </motion.div>
  );
}