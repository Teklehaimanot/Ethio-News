import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useGetNewsQuery } from "../../services";
import { color } from "../../utilities/Colors";
import NewsCard from "../../components/NewsCard";

const initialLimit = 15;
const initialStart = 1;

const Home = () => {
  const [news, setNews] = useState([]);
  const [start, setStart] = useState(initialStart);

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

  const handleRefresh = () => {
    setStart(initialStart);
    refetch();
  };

  const handleEndReached = () => {
    if (posts?.data.length === initialLimit) {
      setStart((prev) => prev + 1);
    }
  };

  const renderItem = ({ item }) => <NewsCard item={item} />;

  if (isLoading && start === 1) {
    return <ActivityIndicator size={"large"} color={color.primary} />;
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: color.red }}>
          Error loading data. Please try again.
        </Text>
        <TouchableOpacity onPress={refetch}>
          <Text style={{ color: color.blue, marginTop: 10 }}>Tap to retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <FlatList
      style={styles.cardList}
      data={news}
      keyExtractor={(item) => item._id}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 2, paddingHorizontal: 1 }}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />
      }
      ListFooterComponent={() => (
        <View>
          {isFetching && <ActivityIndicator size="large" color={color} />}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  cardList: {
    backgroundColor: color.grayDark,
  },
});

export default Home;
