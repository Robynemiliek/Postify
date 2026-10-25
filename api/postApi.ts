import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { PostData } from "@/utils/postData";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";

const POSTS_COLLECTION = "posts";

// CREATE
export type NewPost = {
  title: string;
  description: string;
  hashtags: string;
  author: string;
  authorId: string;
  category?: string;
};

function requireAuth() {
  const user = getAuth().currentUser;

  if (!user) {
    throw new Error("You must be logged in to perform this action.");
  }

  return user;
}

export async function createPost(data: NewPost): Promise<void> {
  const user = requireAuth();

  await addDoc(collection(db, POSTS_COLLECTION), {
    ...data,
    authorId: user.uid,
    createdAt: serverTimestamp(),
  });
}

// READ ALL
export async function getAllPosts(
  sortOrder: "asc" | "desc" = "desc",
): Promise<PostData[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    orderBy("createdAt", sortOrder),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      }) as PostData,
  );
}

// READ MY POSTS
export async function getAllMyPosts(
  authorId: string,
  sortOrder: "asc" | "desc" = "desc",
): Promise<PostData[]> {
  if (!authorId?.trim()) {
    throw new Error("Author ID is required.");
  }

  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where("authorId", "==", authorId),
      orderBy("createdAt", sortOrder),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
        }) as PostData,
    );
  } catch (error) {
    console.error("Firebase error:", error);
    throw error;
  }
}

// READ ONE
export async function getPostById(id: string): Promise<PostData | null> {
  const snap = await getDoc(doc(db, POSTS_COLLECTION, id));

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  } as PostData;
}

// UPDATE
export async function updatePost(
  id: string,
  data: Partial<NewPost>,
): Promise<void> {
  const user = requireAuth();

  const postRef = doc(db, POSTS_COLLECTION, id);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) {
    throw new Error("Post not found.");
  }

  if (postSnap.data().authorId !== user.uid) {
    throw new Error("You can only edit your own posts.");
  }

  const { authorId, ...updateData } = data;

  await updateDoc(postRef, updateData);
}

// DELETE
export async function deletePost(id: string): Promise<void> {
  const user = requireAuth();

  const postRef = doc(db, POSTS_COLLECTION, id);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) {
    throw new Error("Post not found.");
  }

  if (postSnap.data().authorId !== user.uid) {
    throw new Error("You can only delete your own posts.");
  }

  await deleteDoc(postRef);
}

// BOOKMARK
export async function toggleBookmark(
  id: string,
  authorName: string,
  currentlyBookmarked: boolean,
): Promise<void> {
  const user = requireAuth();

  await updateDoc(doc(db, POSTS_COLLECTION, id), {
    bookmarks: currentlyBookmarked
      ? arrayRemove(user.uid)
      : arrayUnion(user.uid),
  });
}

export async function getBookmarkedPosts(
  authorName: string,
): Promise<PostData[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where("bookmarks", "array-contains", authorName),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      }) as PostData,
  );
}
