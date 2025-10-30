"use client";

import { Button } from "@/components/button";
import UncontrolledTextField from "@/components/UncontrolledTextField";
import { Shield, LogIn } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  return (
    <div className="w-full max-w-sm">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm shadow-blue-900/10">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            MRP
          </span>
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">
          Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <UncontrolledTextField
            id="email"
            name="email"
            type="email"
            label="Alamat email"
            autoComplete="email"
            required
          />
          <UncontrolledTextField
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <LogIn className="mr-2 h-4 w-4" /> Masuk
          </Button>
          <Button
            type="reset"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Link
              href='http://localhost:3000/dashboard'
            >
              <LogIn className="mr-2 h-4 w-4" /> Bypass
            </Link>
          </Button>
        </form>

        <p className="mt-10 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} BrokerCRM • Internal dashboard.
        </p>
      </div>
    </div>
  );
}