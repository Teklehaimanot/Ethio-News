import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useGetNewsByTitleQuery } from "../../services";
import NewsCard from "../../components/NewsCard";
import Error from "../../components/Error";
import { Feather } from "@expo/vector-icons";
import { ThemeContext } from "../../utilities/ThemeProvider";

const initialLimit = 15;
const initialStart = 1;
const { width } = Dimensions.get("window");

const SearchScreen = ({ navigation, route }) => {
  const [news, setNews] = useState([]);
  const [start, setStart] = useState(initialStart);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const headerOffset = useState(new Animated.Value(0))[0];
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(ThemeContext);

  const searchInputRef = useRef(null); // Reference for the TextInput

  const {
    data: posts,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetNewsByTitleQuery({
    page: start,
    limit: initialLimit,
    title: searchQuery,
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

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

  const renderItem = ({ item }) => (
    <NewsCard item={item} navigation={navigation} />
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setStart(initialStart);
    refetch();
  };

  if (isLoading && start === 1 && searchQuery) {
    return <ActivityIndicator size={"large"} color={theme.primary} />;
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
            backgroundColor: theme.bg,
            transform: [{ translateY: headerOffset }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>

        <View
          style={[
            styles.searchContainer,
            { borderColor: theme.text2, backgroundColor: theme.bg },
          ]}
        >
          <Feather
            name="search"
            size={20}
            color={theme.text}
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search news..."
            placeholderTextColor={theme.text2}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </Animated.View>
      {refreshing && <View style={{ height: 60 }}></View>}
      {searchQuery && (
        <FlatList
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
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={() =>
            isFetching && (
              <ActivityIndicator size="large" color={theme.primary} />
            )
          }
        />
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 60,
  },
  backIcon: {
    marginRight: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 0.5,
    marginHorizontal: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

export default SearchScreen;
