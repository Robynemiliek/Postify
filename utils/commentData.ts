export interface CommentData {
  author?: string;
  authorId: string;
  comment: string;
}

export interface CommentObject {
  id: string;
  comment: CommentData;
}
