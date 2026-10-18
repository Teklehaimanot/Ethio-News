import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKMARK_KEY = "bookmarked_posts";

// Get all bookmarks
export const getBookmarks = async () => {
  try {
    const bookmarks = await AsyncStorage.getItem(BOOKMARK_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error("Error getting bookmarks:", error);
    return [];
  }
};

// Add a bookmark
export const addBookmark = async (postId) => {
  try {
    const bookmarks = await getBookmarks();
    if (!bookmarks.includes(postId)) {
      const updatedBookmarks = [...bookmarks, postId];
      await AsyncStorage.setItem(
        BOOKMARK_KEY,
        JSON.stringify(updatedBookmarks)
      );
    }
  } catch (error) {
    console.error("Error adding bookmark:", error);
  }
};

// Remove a bookmark
export const removeBookmark = async (postId) => {
  try {
    const bookmarks = await getBookmarks();
    const updatedBookmarks = bookmarks.filter((id) => id !== postId);
    await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error("Error removing bookmark:", error);
  }
};

// Check if a post is bookmarked
export const isBookmarked = async (postId) => {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.includes(postId);
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
};

export const clearBookmarks = async () => {
  try {
    await AsyncStorage.removeItem(BOOKMARK_KEY);
    console.log("All bookmarks removed successfully.");
  } catch (error) {
    console.error("Error clearing bookmarks:", error);
  }
};
