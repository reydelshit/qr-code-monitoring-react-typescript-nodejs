import { create } from 'zustand';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostStore {
  post: Post | null;
  loading: boolean;
  error: string | null;
  postData: (url: string, payload: Omit<Post, 'id'>) => Promise<void>;
}

const usePostStore = create<PostStore>((set) => ({
  post: null,
  loading: false,
  error: null,
  postData: async (url, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<Post>(url, payload);
      set({ post: response.data, loading: false });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || error.message,
          loading: false,
        });
      } else {
        set({ error: 'An unknown error occurred', loading: false });
      }
    }
  },
}));
