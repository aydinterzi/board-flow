import React from "react";
import BoardsSidebar from "@/components/BoardsSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-65px)]">
      <BoardsSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
