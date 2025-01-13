import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import { useGetNewsQuery } from "../../services";
import { color } from "../../utilities/Colors";
import NewsCard from "../../components/NewsCard";
import Error from "../../components/Error";

const initialLimit = 15;
const initialStart = 1;

const Home = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [start, setStart] = useState(initialStart);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0); // Store the current scroll position
  const headerOffset = useState(new Animated.Value(0))[0];

  const [fontsLoaded] = useFonts({
    "Figtree-Regular": require("../../assets/fonts/Figtree-Regular.ttf"),
    "Figtree-Bold": require("../../assets/fonts/Figtree-Bold.ttf"),
    "Figtree-SemiBold": require("../../assets/fonts/Figtree-SemiBold.ttf"),
  });

  const {
    data: posts,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetNewsQuery({
    page: start,
    limit: initialLimit,
  });

  useEffect(() => {
    if (posts?.data) {
      if (start === initialStart) {
        setNews(posts.data);
      } else {
        setNews((prevNews) => [...prevNews, ...posts.data]);
      }
    }
  }, [posts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setStart(initialStart);
    await refetch();
    setRefreshing(false);
  };

  const handleEndReached = () => {
    if (posts?.data.length === initialLimit && !isFetching) {
      setStart((prev) => prev + 1);
    }
  };

  const renderItem = ({ item }) => (
    <NewsCard item={item} navigation={navigation} />
  );

  // Handle scroll logic
  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > scrollY ? "down" : "up";

    // Hide header on scroll down, show on scroll up
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

  if ((isLoading && start === 1) || !fontsLoaded) {
    return <ActivityIndicator size={"large"} color={color.primary} />;
  }

  if (isError) {
    return <Error message={"Tap to retry"} refetch={refetch} />;
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[styles.header, { transform: [{ translateY: headerOffset }] }]}
      >
        <Text style={styles.headerText}>Sticky Header</Text>
      </Animated.View>

      {/* FlatList */}
      <FlatList
        style={styles.cardList}
        data={news}
        keyExtractor={(item) => item._id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 2,
          paddingHorizontal: 1,
          paddingTop: 100,
        }}
        renderItem={renderItem}
        onScroll={handleScroll} // Handle scroll event dynamically
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={() => (
          <View>
            {isFetching && (
              <ActivityIndicator size="large" color={color.primary} />
            )}
          </View>
        )}
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
    padding: 20,
    zIndex: 1000,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.fontColor,
  },
  cardList: {
    backgroundColor: color.white,
  },
});

export default Home;
