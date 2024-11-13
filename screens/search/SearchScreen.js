import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import { useGetNewsByTitleQuery } from "../../services";
import { color } from "../../utilities/Colors";
import NewsCard from "../../components/NewsCard";
import Error from "../../components/Error";

const initialLimit = 15;
const initialStart = 1;

const SearchScreen = ({ navigation, route }) => {
  const [news, setNews] = useState([]);
  const [start, setStart] = useState(initialStart);
  const [refreshing, setRefreshing] = useState(false);
  const { query } = route.params ? route.params : "";
  const {
    data: posts,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetNewsByTitleQuery({
    page: start,
    limit: initialLimit,
    title: query,
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

  if (isLoading && start === 1) {
    return <ActivityIndicator size={"large"} color={color.primary} />;
  }

  if (isError) {
    return <Error message={"Tap to retry"} refetch={refetch} />;
  }

  // Show placeholder if no query is entered
  if (!query) {
    return (
      <View style={styles.placeholderContainer}>
        <Image
          source={require("../../assets/search.png")}
          style={styles.placeholderImage}
        />
        <Text style={styles.placeholderText}>
          Type something to start searching...
        </Text>
      </View>
    );
  }

  // Show "No results" message if query is entered but no results are found
  if (query && news.length === 0 && !isLoading) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>
          No results found for "{query}".
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.cardList}
      data={news}
      keyExtractor={(item) => item._id}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 2, paddingHorizontal: 1 }}
      renderItem={renderItem}
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
  );
};

const styles = StyleSheet.create({
  cardList: {
    backgroundColor: color.grayDark,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.grayDark,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: color.black,
    textAlign: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.grayDark,
  },
  noResultsText: {
    fontSize: 18,
    color: color.black,
    textAlign: "center",
    marginTop: 20,
  },
});

export default SearchScreen;
