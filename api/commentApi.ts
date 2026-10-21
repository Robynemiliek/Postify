import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

import { db } from "@/firebaseConfig";
import { CommentData, CommentObject } from "@/utils/commentData";

// Henter kommentarer for et spesifikt innlegg
export async function getComments(
  commentIds: string[],
): Promise<CommentObject[]> {
  const comments: CommentObject[] = [];

  for (const id of commentIds) {
    const commentRef = doc(db, "comments", id);
    const commentSnap = await getDoc(commentRef);

    if (commentSnap.exists()) {
      comments.push({
        id: commentSnap.id,
        comment: commentSnap.data() as CommentData,
      });
    }
  }
  return comments;
}

// legger til kommentarer
export async function addComment(
  posId: string,
  comment: CommentData,
): Promise<string> {
  const commentRef = await addDoc(collection(db, "comments"), comment);

  await updateDoc(doc(db, "posts", posId), {
    comments: arrayUnion(commentRef.id),
  });

  return commentRef.id;
}

// rediger en kommentar
export async function updateComment(
  commentId: string,
  text: string,
): Promise<void> {
  await updateDoc(doc(db, "comments", commentId), {
    text: text,
  });
}

// Sletter en kommentar
export async function deleteComment(
  commentId: string,
  postId: string,
): Promise<void> {
  await updateDoc(doc(db, "posts", postId), {
    comments: arrayRemove(commentId),
  });

  await deleteDoc(doc(db, "comments", commentId));
}
