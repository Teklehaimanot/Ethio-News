import React, { useContext, useEffect, useState } from "react";
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
import NewsCard from "../../components/NewsCard";
import Error from "../../components/Error";
import { getBookmarks } from "../../utilities/Bookmark";
import { RefreshControl } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemeContext } from "../../utilities/ThemeProvider";
const { width } = Dimensions.get("window");
const BookMarks = ({ navigation }) => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [bookmarkedIds, setBookmarkIds] = useState([]);
  const [scrollY, setScrollY] = useState(0); // Store the current scroll position
  const headerOffset = useState(new Animated.Value(0))[0];
  const { theme } = useContext(ThemeContext);

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
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ActivityIndicator
          size={"large"}
          color={theme.primary}
          style={{ marginVertical: "auto" }}
        />
      </View>
    );
  }

  if (isError && error.data.error === "No news items found") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.bg,
        }}
      >
        <Animated.View
          style={[
            styles.header,
            {
              backgroundColor: theme.bg2,
              transform: [{ translateY: headerOffset }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.drawerIcon}
          >
            <MaterialIcons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Bookmarks</Text>
        </Animated.View>
        <Text
          style={{
            fontFamily: "Figtree-Regular",
            fontSize: 16,
            color: theme.text2,
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
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Animated.View
          style={[
            styles.header,
            {
              backgroundColor: theme.bg2,
              transform: [{ translateY: headerOffset }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.drawerIcon}
          >
            <MaterialIcons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Bookmarks</Text>
        </Animated.View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontFamily: "Figtree-Regular",
              fontSize: 16,
              color: theme.text,
            }}
          >
            No Bookmarks Found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: theme.bg2,
            transform: [{ translateY: headerOffset }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawerIcon}
        >
          <MaterialIcons name="menu" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Bookmarks</Text>
      </Animated.View>
      {isRefreshing && <View style={{ height: 60 }}></View>}
      <FlatList
        style={{ backgroundColor: theme.bg }}
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
            colors={[theme.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    marginHorizontal: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 1,
  },
  drawerIcon: {
    marginRight: 25,
    paddingVertical: 6,
    paddingHorizontal: width * 0.04,
  },
  title: {
    fontFamily: "Figtree-Bold",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 15,
  },
});

export default BookMarks;
