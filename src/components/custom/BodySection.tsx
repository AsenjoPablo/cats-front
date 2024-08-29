import React from "react";

export default function BodySection({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-300 flex-1 flex flex-col">
      <section className="flex flex-col bg-white shadow-xl gap-8 p-12 mx-auto max-w-7xl flex-1 w-full">
        {children}
      </section>
    </div>
  );
}
