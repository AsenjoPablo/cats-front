import React from "react";

export default function BodySection({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen flex-col gap-8 p-24">{children}</main>
  );
}
