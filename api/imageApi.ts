import { storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadImage = async (uri: string): Promise<string> => {
  // 1. Hent bildet fra telefonen
  const response = await fetch(uri);
  const blob = await response.blob();

  // 2. Lag et unikt filnavn i firebase storage
  const filename = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const imageRef = ref(storage, filename);

  // 3. Last opp bildet
  await uploadBytes(imageRef, blob, {
    contentType: blob.type || "image/jpeg",
  });

  // 4. Hent URL-en til bildet
  const downloadURL = await getDownloadURL(imageRef);

  return downloadURL;
};
