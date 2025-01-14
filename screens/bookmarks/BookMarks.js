import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import { useGetBookmarksQuery } from "../../services";
import { color } from "../../utilities/Colors";
import NewsCard from "../../components/NewsCard";
import Error from "../../components/Error";
import { clearBookmarks, getBookmarks } from "../../utilities/Bookmark";
import { RefreshControl } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const { width } = Dimensions.get("window");
const BookMarks = ({ navigation }) => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [bookmarkedIds, setBookmarkIds] = useState([]);
  const [scrollY, setScrollY] = useState(0); // Store the current scroll position
  const headerOffset = useState(new Animated.Value(0))[0];

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
      setRefreshing(true);
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    <NewsCard item={item} navigation={navigation} />
  );

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > scrollY ? "down" : "up";
    if (direction === "down" && currentOffset > 50) {
      Animated.timing(headerOffset, {
        toValue: -100,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else if (direction === "up") {
      Animated.timing(headerOffset, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }

    setScrollY(currentOffset);
  };

  if (isLoading || !fontsLoaded) {
    return (
      <ActivityIndicator
        size={"large"}
        color={color.primary}
        style={{ marginVertical: "auto" }}
      />
    );
  }

  if (isError && error.data.error === "No news items found") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.View
          style={[styles.header, { transform: [{ translateY: headerOffset }] }]}
        >
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.drawerIcon}
          >
            <MaterialIcons name="menu" size={28} color={color.fontColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Bookmarks</Text>
        </Animated.View>
        <Text
          style={{
            fontFamily: "Figtree-Regular",
            fontSize: 16,
            color: color.sourceColor,
          }}
        >
          Your data has been deleted from the server.
        </Text>
      </View>
    );
  }

  if (isError) {
    return <Error message={"Tap to retry"} refetch={refetch} />;
  }

  if (!bookmarkedIds.length || !data) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.header, { transform: [{ translateY: headerOffset }] }]}
        >
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.drawerIcon}
          >
            <MaterialIcons name="menu" size={28} color={color.fontColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Bookmarks</Text>
        </Animated.View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, { transform: [{ translateY: headerOffset }] }]}
      >
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawerIcon}
        >
          <MaterialIcons name="menu" size={28} color={color.fontColor} />
        </TouchableOpacity>
        <Text style={styles.title}>Bookmarks</Text>
      </Animated.View>

      <FlatList
        style={styles.cardList}
        data={data}
        keyExtractor={(item) => item._id}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 2,
          paddingHorizontal: 1,
          paddingTop: 60,
        }}
        renderItem={renderItem}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[color.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: width * 0.04,
    zIndex: 1000,
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    backgroundColor: color.white,
  },
  drawerIcon: {
    marginRight: 25,
  },
  title: {
    color: color.fontColor,
    fontFamily: "Figtree-Bold",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },

  cardList: {
    backgroundColor: color.white,
  },
});

export default BookMarks;
