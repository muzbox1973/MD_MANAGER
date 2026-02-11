"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { TreeNode } from "@/types";
import { findNodeById, isMarkdownFile } from "@/lib/utils";

function FileIcon({ name }: { name: string }) {
  if (isMarkdownFile(name)) {
    return (
      <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function FolderIcon({ isExpanded }: { isExpanded: boolean }) {
  if (isExpanded) {
    return (
      <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      className={`w-3 h-3 text-sidebar-muted shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId: string;
  nodeType: "file" | "folder";
  onClose: () => void;
}

function ContextMenu({ x, y, nodeId, nodeType, onClose }: ContextMenuProps) {
  const { deleteNode, addFile, addFolder, setContextMenuTarget } = useStore();
  const [showRename, setShowRename] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { renameNodeAction } = useStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if ((showRename || showNewFile || showNewFolder) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showRename, showNewFile, showNewFolder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (showRename) {
      renameNodeAction(nodeId, inputValue.trim());
    } else if (showNewFile) {
      const name = inputValue.trim().includes(".") ? inputValue.trim() : inputValue.trim() + ".md";
      addFile(name, nodeType === "folder" ? nodeId : null);
    } else if (showNewFolder) {
      addFolder(inputValue.trim(), nodeType === "folder" ? nodeId : null);
    }
    setContextMenuTarget(null);
    onClose();
  };

  const showInput = showRename || showNewFile || showNewFolder;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px]"
      style={{ left: x, top: y }}
    >
      {showInput ? (
        <form onSubmit={handleSubmit} className="px-3 py-2">
          <label className="block text-xs text-gray-500 mb-1">
            {showRename ? "새 이름" : showNewFile ? "파일 이름" : "폴더 이름"}
          </label>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder={showRename ? "이름 입력..." : showNewFile ? "파일명.md" : "폴더명"}
          />
          <div className="flex gap-1 mt-2">
            <button type="submit" className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
              확인
            </button>
            <button type="button" onClick={onClose} className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          {nodeType === "folder" && (
            <>
              <button
                onClick={() => { setShowNewFile(true); setInputValue(""); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 파일
              </button>
              <button
                onClick={() => { setShowNewFolder(true); setInputValue(""); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                새 폴더
              </button>
              <div className="border-t border-gray-100 my-1" />
            </>
          )}
          <button
            onClick={() => { setShowRename(true); setInputValue(""); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            이름 변경
          </button>
          <button
            onClick={() => {
              if (confirm("정말 삭제하시겠습니까?")) {
                deleteNode(nodeId);
                onClose();
              }
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            삭제
          </button>
        </>
      )}
    </div>
  );
}

interface TreeItemProps {
  node: TreeNode;
  depth: number;
}

function TreeItem({ node, depth }: TreeItemProps) {
  const { selectedFileId, selectFile, toggleExpandAction } = useStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const isSelected = selectedFileId === node.id;
  const isFolder = node.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      toggleExpandAction(node.id);
    } else {
      selectFile(node.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer select-none text-sm transition-colors
          ${isSelected ? "bg-sidebar-active text-white" : "text-sidebar-text hover:bg-sidebar-hover"}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {isFolder && <ChevronIcon isExpanded={node.isExpanded || false} />}
        {!isFolder && <span className="w-3" />}
        {isFolder ? (
          <FolderIcon isExpanded={node.isExpanded || false} />
        ) : (
          <FileIcon name={node.name} />
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {isFolder && node.isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={node.id}
          nodeType={node.type}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}

export default function TreeView() {
  const { tree, addFile, addFolder } = useStore();
  const [showNewInput, setShowNewInput] = useState<"file" | "folder" | null>(null);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showNewInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNewInput]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setShowNewInput(null);
      return;
    }
    if (showNewInput === "file") {
      const name = newName.trim().includes(".") ? newName.trim() : newName.trim() + ".md";
      addFile(name, null);
    } else {
      addFolder(newName.trim(), null);
    }
    setNewName("");
    setShowNewInput(null);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar-bg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-hover">
        <h2 className="text-sm font-semibold text-sidebar-text tracking-wide">파일 탐색기</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setShowNewInput("file")}
            className="p-1 rounded hover:bg-sidebar-hover text-sidebar-muted hover:text-sidebar-text transition-colors"
            title="새 파일"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => setShowNewInput("folder")}
            className="p-1 rounded hover:bg-sidebar-hover text-sidebar-muted hover:text-sidebar-text transition-colors"
            title="새 폴더"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {showNewInput && (
          <form onSubmit={handleCreate} className="px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => { setShowNewInput(null); setNewName(""); }}
              className="w-full px-2 py-1 text-sm bg-sidebar-hover text-sidebar-text border border-sidebar-active rounded focus:outline-none focus:border-blue-500"
              placeholder={showNewInput === "file" ? "파일명.md" : "폴더명"}
            />
          </form>
        )}
        {tree.map((node) => (
          <TreeItem key={node.id} node={node} depth={0} />
        ))}
        {tree.length === 0 && !showNewInput && (
          <div className="px-4 py-8 text-center text-sidebar-muted text-sm">
            <p>파일이 없습니다.</p>
            <p className="mt-1 text-xs">상단 버튼으로 새 파일이나 폴더를 만드세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
