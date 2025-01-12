import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useFonts } from "expo-font";
import { useGetBookmarksQuery } from "../../services";
import { color } from "../../utilities/Colors";
import NewsCard from "../../components/NewsCard";
import Error from "../../components/Error";
import { clearBookmarks, getBookmarks } from "../../utilities/Bookmark";
import { RefreshControl } from "react-native-gesture-handler";

const BookMarks = ({ navigation }) => {
  const [bookmarkedIds, setBookmarkIds] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    "Figtree-Regular": require("../../assets/fonts/Figtree-Regular.ttf"),
    "Figtree-Bold": require("../../assets/fonts/Figtree-Bold.ttf"),
    "Figtree-SemiBold": require("../../assets/fonts/Figtree-SemiBold.ttf"),
  });

  useEffect(() => {
    const fetchBookmarks = async () => {
      const bookmarks = await getBookmarks();
      setBookmarkIds(bookmarks);
    };

    fetchBookmarks();
  }, [bookmarkedIds]);

  const { data, error, isError, isLoading, refetch } = useGetBookmarksQuery(
    { newsIds: bookmarkedIds },
    {
      skip: bookmarkedIds.length === 0, // Skip the query if no IDs are available
    }
  );

  useEffect(() => {
    const boookmarkIds = getBookmarks();
    setBookmarkIds(boookmarkIds);
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    <NewsCard item={item} navigation={navigation} />
  );

  if (isLoading || !fontsLoaded) {
    return <ActivityIndicator size={"large"} color={color.primary} />;
  }

  if (isError) {
    return <Error message={"Tap to retry"} refetch={refetch} />;
  }
  if (!bookmarkedIds.length || !data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "Figtree-Regular",
            fontSize: 16,
            color: color.sourceColor,
          }}
        >
          No Bookmarks Found
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.cardList}
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  cardList: {
    backgroundColor: color.white,
  },
});

export default BookMarks;
