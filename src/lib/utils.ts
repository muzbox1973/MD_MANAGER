import { TreeNode } from "@/types";

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function createFile(
  name: string,
  parentId: string | null,
  content: string = ""
): TreeNode {
  const now = Date.now();
  return {
    id: generateId(),
    name,
    type: "file",
    content,
    parentId,
    createdAt: now,
    updatedAt: now,
  };
}

export function createFolder(
  name: string,
  parentId: string | null
): TreeNode {
  const now = Date.now();
  return {
    id: generateId(),
    name,
    type: "folder",
    children: [],
    parentId,
    isExpanded: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function findNodeById(
  nodes: TreeNode[],
  id: string
): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function removeNodeById(
  nodes: TreeNode[],
  id: string
): TreeNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: node.children ? removeNodeById(node.children, id) : undefined,
    }));
}

export function addNodeToParent(
  nodes: TreeNode[],
  parentId: string | null,
  newNode: TreeNode
): TreeNode[] {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map((node) => {
    if (node.id === parentId && node.type === "folder") {
      return {
        ...node,
        children: [...(node.children || []), newNode],
        isExpanded: true,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addNodeToParent(node.children, parentId, newNode),
      };
    }
    return node;
  });
}

export function updateNodeContent(
  nodes: TreeNode[],
  id: string,
  content: string
): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, content, updatedAt: Date.now() };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeContent(node.children, id, content),
      };
    }
    return node;
  });
}

export function renameNode(
  nodes: TreeNode[],
  id: string,
  newName: string
): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, name: newName, updatedAt: Date.now() };
    }
    if (node.children) {
      return {
        ...node,
        children: renameNode(node.children, id, newName),
      };
    }
    return node;
  });
}

export function toggleExpand(
  nodes: TreeNode[],
  id: string
): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === id && node.type === "folder") {
      return { ...node, isExpanded: !node.isExpanded };
    }
    if (node.children) {
      return {
        ...node,
        children: toggleExpand(node.children, id),
      };
    }
    return node;
  });
}

export function getFileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

export function isMarkdownFile(name: string): boolean {
  const ext = getFileExtension(name).toLowerCase();
  return ext === "md" || ext === "markdown";
}
