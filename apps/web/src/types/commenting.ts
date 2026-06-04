export type Commenter =
  | {
      role: "admin";
      displayName: string;
    }
  | {
      role: "user";
      id: number;
      username: string;
      displayName: string;
    };

export type CommentNode = {
  id: number;
  parentId: number | null;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: Date;
  replies: CommentNode[];
};
