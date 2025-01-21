import React, { useEffect, useState } from "react";
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
import { useFonts } from "expo-font";
import { useGetNewsQuery } from "../../services";
import { color } from "../../utilities/Colors";
import NewsCard from "../../components/NewsCard";
import Error from "../../components/Error";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const initialLimit = 15;
const initialStart = 1;
const { width } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [start, setStart] = useState(initialStart);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0); // Store the current scroll position
  const headerOffset = useState(new Animated.Value(0))[0];

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

  if (isLoading && start === 1) {
    return (
      <ActivityIndicator
        size={"large"}
        color={color.primary}
        style={{ marginVertical: "auto" }}
      />
    );
  }

  if (isError) {
    return <Error message={"Tap to retry"} refetch={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.header, { transform: [{ translateY: headerOffset }] }]}
      >
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawerIcon}
        >
          <MaterialIcons name="menu" size={28} color={color.fontColor} />
        </TouchableOpacity>
        <Text style={styles.title}>Ethiopian News</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("search")}
          style={styles.searchIcon}
        >
          <Feather
            name="search"
            size={24}
            color={color.fontColor}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </Animated.View>

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
          paddingTop: 60,
        }}
        renderItem={renderItem}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[color.primary]}
          />
        }
        ListFooterComponent={() => (
          <View>
            {isFetching && (
              <ActivityIndicator size="large" color={color.primary} />
            )}
          </View>
        )}
      />
    </SafeAreaView>
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

export default Home;
