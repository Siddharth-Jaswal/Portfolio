import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeetCode from "@/components/LeetCode";

export default function CodingProfile() {
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return localStorage.getItem("cp:collapsed") === "1"; } catch (_) { return false; }
  });
  React.useEffect(() => {
    try { localStorage.setItem("cp:collapsed", collapsed ? "1" : "0"); } catch (_) {}
  }, [collapsed]);

  return (
    <section id="coding-profile" className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between pb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Coding Profile</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          aria-controls="coding-profile-content"
          className="inline-flex items-center gap-2"
        >
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          {collapsed ? "Expand" : "Collapse"}
        </Button>
      </div>
      {!collapsed && (
        <div id="coding-profile-content" className="grid grid-cols-1 gap-6">
          <LeetCode embed />
        </div>
      )}
    </section>
  );
}
