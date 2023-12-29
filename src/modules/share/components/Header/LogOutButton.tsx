"use client";

import { Power } from "@phosphor-icons/react";

export function LogOutButton() {
  return (
    <a href="/api/auth/logout">
      <Power size={24} weight="bold" className="text-red-400" />
    </a>
  );
}
