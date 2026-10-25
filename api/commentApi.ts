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
import { getAuth } from "firebase/auth";

function requireAuth() {
  const user = getAuth().currentUser;

  if (!user) {
    throw new Error("You must be logged in to perform this action.");
  }

  return user;
}

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
  postId: string,
  comment: CommentData,
): Promise<string> {
  const user = requireAuth();

  const commentRef = await addDoc(collection(db, "comments"), {
    ...comment,
    authorId: user.uid,
  });

  await updateDoc(doc(db, "posts", postId), {
    comments: arrayUnion(commentRef.id),
  });

  return commentRef.id;
}

// rediger en kommentar
export async function updateComment(
  commentId: string,
  text: string,
): Promise<void> {
  const user = requireAuth();

  const commentRef = doc(db, "comments", commentId);
  const commentSnap = await getDoc(commentRef);

  if (!commentSnap.exists()) {
    throw new Error("Comment not found.");
  }

  if (commentSnap.data().authorId !== user.uid) {
    throw new Error("You can only edit your own comments.");
  }

  await updateDoc(commentRef, {
    comment: text,
  });
}

// Sletter en kommentar
export async function deleteComment(
  commentId: string,
  postId: string,
): Promise<void> {
  const user = requireAuth();

  const commentRef = doc(db, "comments", commentId);
  const commentSnap = await getDoc(commentRef);

  if (!commentSnap.exists()) {
    throw new Error("Comment not found.");
  }

  if (commentSnap.data().authorId !== user.uid) {
    throw new Error("You can only delete your own comments.");
  }

  await updateDoc(doc(db, "posts", postId), {
    comments: arrayRemove(commentId),
  });

  await deleteDoc(commentRef);
}
