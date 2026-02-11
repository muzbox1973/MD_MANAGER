"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export default function ResizeHandle() {
  const { sidebarWidth, setSidebarWidth } = useStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setSidebarWidth(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, setSidebarWidth]);

  return (
    <div
      className={`w-1 cursor-col-resize hover:bg-blue-400 transition-colors shrink-0 ${
        isDragging ? "bg-blue-500" : "bg-gray-200"
      }`}
      onMouseDown={handleMouseDown}
    />
  );
}
