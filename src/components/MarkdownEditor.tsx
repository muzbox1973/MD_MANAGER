"use client";

import React, { useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "@/store/useStore";
import { findNodeById, isMarkdownFile } from "@/lib/utils";

function EditorToolbar() {
  const { editorState, setEditorMode, selectedFileId, tree } = useStore();
  const selectedNode = selectedFileId ? findNodeById(tree, selectedFileId) : null;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-editor-border">
      <div className="flex items-center gap-2">
        {selectedNode && (
          <>
            <span className="text-sm font-medium text-gray-700">{selectedNode.name}</span>
            {isMarkdownFile(selectedNode.name) && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">MD</span>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-0.5">
        <button
          onClick={() => setEditorMode("edit")}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            editorState.mode === "edit"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          편집
        </button>
        <button
          onClick={() => setEditorMode("split")}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            editorState.mode === "split"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          분할
        </button>
        <button
          onClick={() => setEditorMode("preview")}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            editorState.mode === "preview"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          미리보기
        </button>
      </div>
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none p-6 overflow-y-auto h-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

function TextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed text-gray-800 bg-white"
      placeholder="여기에 내용을 입력하세요..."
      spellCheck={false}
    />
  );
}

export default function MarkdownEditor() {
  const { tree, selectedFileId, editorState, updateContent } = useStore();

  const selectedNode = useMemo(
    () => (selectedFileId ? findNodeById(tree, selectedFileId) : null),
    [tree, selectedFileId]
  );

  const handleContentChange = useCallback(
    (value: string) => {
      if (selectedFileId) {
        updateContent(selectedFileId, value);
      }
    },
    [selectedFileId, updateContent]
  );

  if (!selectedNode || selectedNode.type === "folder") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">파일을 선택하세요</p>
            <p className="text-sm mt-1">좌측 트리에서 파일을 선택하면 여기에 표시됩니다</p>
          </div>
        </div>
      </div>
    );
  }

  const content = selectedNode.content || "";
  const isMd = isMarkdownFile(selectedNode.name);
  const { mode } = editorState;

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar />
      <div className="flex-1 flex overflow-hidden">
        {mode === "edit" && (
          <div className="flex-1">
            <TextEditor content={content} onChange={handleContentChange} />
          </div>
        )}

        {mode === "preview" && (
          <div className="flex-1 overflow-y-auto">
            {isMd ? (
              <MarkdownPreview content={content} />
            ) : (
              <pre className="p-6 text-sm text-gray-800 whitespace-pre-wrap font-mono">{content}</pre>
            )}
          </div>
        )}

        {mode === "split" && (
          <>
            <div className="flex-1 border-r border-editor-border">
              <TextEditor content={content} onChange={handleContentChange} />
            </div>
            <div className="flex-1 overflow-y-auto">
              {isMd ? (
                <MarkdownPreview content={content} />
              ) : (
                <pre className="p-6 text-sm text-gray-800 whitespace-pre-wrap font-mono">{content}</pre>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
