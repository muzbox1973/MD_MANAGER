"use client";

import { create } from "zustand";
import { TreeNode, EditorState } from "@/types";
import {
  createFile,
  createFolder,
  removeNodeById,
  addNodeToParent,
  updateNodeContent,
  renameNode,
  toggleExpand,
} from "@/lib/utils";

const STORAGE_KEY = "md-manager-tree";

function loadTree(): TreeNode[] {
  if (typeof window === "undefined") return getDefaultTree();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return getDefaultTree();
}

function saveTree(tree: TreeNode[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  } catch {}
}

function getDefaultTree(): TreeNode[] {
  const now = Date.now();
  return [
    {
      id: "welcome-folder",
      name: "시작하기",
      type: "folder",
      parentId: null,
      isExpanded: true,
      createdAt: now,
      updatedAt: now,
      children: [
        {
          id: "welcome-file",
          name: "환영합니다.md",
          type: "file",
          parentId: "welcome-folder",
          content: `# 마크다운 관리자에 오신 것을 환영합니다!

이 앱은 마크다운 및 텍스트 파일을 **트리 구조**로 관리할 수 있는 도구입니다.

## 주요 기능

- **폴더/파일 관리**: 좌측 트리에서 폴더와 파일을 생성, 수정, 삭제할 수 있습니다
- **마크다운 편집**: 실시간 마크다운 미리보기를 지원합니다
- **편집 모드**: 편집, 미리보기, 분할 보기 모드를 선택할 수 있습니다
- **자동 저장**: 모든 변경사항은 브라우저에 자동 저장됩니다

## 마크다운 문법 예시

### 텍스트 서식

**굵은 글씨**, *기울임 글씨*, ~~취소선~~

### 목록

1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

- 순서 없는 목록
- 항목 2
- 항목 3

### 코드

\`\`\`javascript
function hello() {
  console.log("안녕하세요!");
}
\`\`\`

### 인용

> 마크다운은 간단하면서도 강력한 문서 작성 도구입니다.

### 표

| 기능 | 설명 |
|------|------|
| 트리 | 폴더/파일 구조 관리 |
| 편집기 | 마크다운 실시간 편집 |
| 미리보기 | 렌더링된 문서 보기 |

---

좌측 트리에서 새 파일이나 폴더를 만들어 보세요!
`,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "sample-txt",
          name: "메모.txt",
          type: "file",
          parentId: "welcome-folder",
          content: "이것은 일반 텍스트 파일입니다.\n\n텍스트 파일도 관리할 수 있습니다.",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
  ];
}

interface AppStore {
  tree: TreeNode[];
  selectedFileId: string | null;
  editorState: EditorState;
  sidebarWidth: number;
  contextMenuTarget: string | null;

  initTree: () => void;
  addFile: (name: string, parentId: string | null) => void;
  addFolder: (name: string, parentId: string | null) => void;
  deleteNode: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  renameNodeAction: (id: string, newName: string) => void;
  toggleExpandAction: (id: string) => void;
  selectFile: (id: string | null) => void;
  setEditorMode: (mode: EditorState["mode"]) => void;
  setSidebarWidth: (width: number) => void;
  setContextMenuTarget: (id: string | null) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  tree: [],
  selectedFileId: null,
  editorState: { mode: "split" },
  sidebarWidth: 280,
  contextMenuTarget: null,

  initTree: () => {
    const tree = loadTree();
    set({ tree, selectedFileId: "welcome-file" });
  },

  addFile: (name: string, parentId: string | null) => {
    const newFile = createFile(name, parentId);
    const tree = addNodeToParent(get().tree, parentId, newFile);
    saveTree(tree);
    set({ tree, selectedFileId: newFile.id });
  },

  addFolder: (name: string, parentId: string | null) => {
    const newFolder = createFolder(name, parentId);
    const tree = addNodeToParent(get().tree, parentId, newFolder);
    saveTree(tree);
    set({ tree });
  },

  deleteNode: (id: string) => {
    const tree = removeNodeById(get().tree, id);
    saveTree(tree);
    set({
      tree,
      selectedFileId: get().selectedFileId === id ? null : get().selectedFileId,
    });
  },

  updateContent: (id: string, content: string) => {
    const tree = updateNodeContent(get().tree, id, content);
    saveTree(tree);
    set({ tree });
  },

  renameNodeAction: (id: string, newName: string) => {
    const tree = renameNode(get().tree, id, newName);
    saveTree(tree);
    set({ tree });
  },

  toggleExpandAction: (id: string) => {
    const tree = toggleExpand(get().tree, id);
    saveTree(tree);
    set({ tree });
  },

  selectFile: (id: string | null) => {
    set({ selectedFileId: id });
  },

  setEditorMode: (mode: EditorState["mode"]) => {
    set({ editorState: { mode } });
  },

  setSidebarWidth: (width: number) => {
    set({ sidebarWidth: Math.max(200, Math.min(500, width)) });
  },

  setContextMenuTarget: (id: string | null) => {
    set({ contextMenuTarget: id });
  },
}));
