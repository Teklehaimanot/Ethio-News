import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
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
    if (posts?.data.length === initialLimit) {
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
});

export default Home;
