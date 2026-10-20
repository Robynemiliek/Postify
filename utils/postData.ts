export interface PostData {
  id: string;
  title: string;
  description: string;
  hashtags: string;
  author: string;
  category: string;
  bookmarks?: string[];
  comments?: string[];
  likes?: string[];
  imageUrls?: string[];
}
