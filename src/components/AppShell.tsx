"use client";

import React, { useEffect } from "react";
import { useStore } from "@/store/useStore";
import TreeView from "./TreeView";
import MarkdownEditor from "./MarkdownEditor";
import ResizeHandle from "./ResizeHandle";

export default function AppShell() {
  const { initTree, sidebarWidth } = useStore();

  useEffect(() => {
    initTree();
  }, [initTree]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-sidebar-bg border-b border-sidebar-hover shrink-0">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-base font-bold text-sidebar-text tracking-wider">
            마크다운 관리자
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-sidebar-muted">
            Ctrl+S 자동저장
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="shrink-0 overflow-hidden" style={{ width: sidebarWidth }}>
          <TreeView />
        </div>

        {/* Resize Handle */}
        <ResizeHandle />

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <MarkdownEditor />
        </div>
      </div>
    </div>
  );
}
