import React, { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useGetNewsQuery } from "../../services";
import NewsCard from "../../components/NewsCard";
import Error from "../../components/Error";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ThemeContext } from "../../utilities/ThemeProvider";

const initialLimit = 15;
const initialStart = 1;
const { width } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [start, setStart] = useState(initialStart);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0); // Store the current scroll position
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const headerOffset = useState(new Animated.Value(0))[0];
  const flatListRef = React.useRef(null);
  const { theme } = useContext(ThemeContext);

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

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > scrollY ? "down" : "up";
    setScrollY(currentOffset);

    if (direction === "down" && currentOffset > 50) {
      setShowScrollToTop(true);
      Animated.timing(headerOffset, {
        toValue: -100,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else if (direction === "up") {
      setShowScrollToTop(false);
      Animated.timing(headerOffset, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleScrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setShowScrollToTop(false);
  };

  if (isLoading && start === 1) {
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

  if (isError) {
    return <Error message={"Tap to retry"} refetch={refetch} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
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
        <Text style={[styles.title, { color: theme.text }]}>
          Ethiopian News
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("search")}
          style={styles.searchIcon}
        >
          <Feather name="search" size={24} color={theme.text} />
        </TouchableOpacity>
      </Animated.View>
      {refreshing && <View style={{ height: 60 }}></View>}
      <FlatList
        ref={flatListRef}
        style={{ backgroundColor: theme.bg }}
        data={news}
        keyExtractor={(item) => item._id}
        onEndReached={handleEndReached}
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
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
          />
        }
        ListFooterComponent={() => (
          <View>
            {isFetching && (
              <ActivityIndicator size="large" color={theme.primary} />
            )}
          </View>
        )}
      />

      {showScrollToTop && (
        <TouchableOpacity
          style={[styles.scrollToTopButton, { backgroundColor: theme.primary }]}
          onPress={handleScrollToTop}
        >
          <AntDesign name="arrowup" size={24} color={theme.active} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
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
  searchIcon: {
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

  scrollToTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export default Home;
