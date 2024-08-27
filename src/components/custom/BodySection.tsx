import React from "react";

export default function BodySection({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-300">
      <section className="flex min-h-screen flex-col bg-white shadow-xl gap-8 p-12 mx-auto max-w-7xl">
        {children}
      </section>
    </div>
  );
}
