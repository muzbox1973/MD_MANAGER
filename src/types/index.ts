export interface TreeNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: TreeNode[];
  parentId: string | null;
  isExpanded?: boolean;
  createdAt: number;
  updatedAt: number;
}

export type FileType = "md" | "txt";

export interface EditorState {
  mode: "edit" | "preview" | "split";
}
