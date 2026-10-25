export interface PostData {
  id: string;
  title: string;
  description: string;
  hashtags: string;
  author: string;
  authorId?: string; // Firebase UID til forfatteren
  category: string;
  bookmarks?: string[];
  comments?: string[];
  likes?: string[];
  imageUrls?: string[];
}
