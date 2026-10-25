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

export async function createPost(data: NewPost): Promise<void> {
  await addDoc(collection(db, POSTS_COLLECTION), {
    ...data,
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
  authorName: string,
  sortOrder: "asc" | "desc" = "desc",
): Promise<PostData[]> {
  if (!authorName?.trim()) {
    throw new Error("Author name is required.");
  }

  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where("author", "==", authorName.trim()),
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
    console.error("Failed to fetch the author's posts:", error);
    throw new Error("Could not load the author's posts.");
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
  await updateDoc(doc(db, POSTS_COLLECTION, id), data);
}

// DELETE
export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, POSTS_COLLECTION, id));
}

// BOOKMARK
export async function toggleBookmark(
  id: string,
  authorName: string,
  currentlyBookmarked: boolean,
): Promise<void> {
  await updateDoc(doc(db, POSTS_COLLECTION, id), {
    bookmarks: currentlyBookmarked
      ? arrayRemove(authorName)
      : arrayUnion(authorName),
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
