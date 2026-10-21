export interface CommentData {
  authorId: string;
  comment: string;
}

export interface CommentObject {
  id: string;
  comment: CommentData;
}
