import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import {
  useDislikeNewsByIdMutation,
  useGetNewsByIdQuery,
  useLikeNewsByIdMutation,
} from "../../services";
import { useEffect, useState } from "react";
import { color } from "../../utilities/Colors";
import CommentLikeCard from "../../components/CommentLikeCard";
import Loading from "../../components/Loading";
import Error from "../../components/Error";

const { width } = Dimensions.get("window");
const Post = ({ route, navigation }) => {
  const { _id, title, image, description } = route.params;
  const { user } = useSelector((state) => state.auth);
  const { data, refetch, isLoading, isError } = useGetNewsByIdQuery(_id);
  const [news, setNews] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const [likeNews] = useLikeNewsByIdMutation();
  const [dislikeNews] = useDislikeNewsByIdMutation();

  useEffect(() => {
    setNews(data);
  }, [data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const handleLiked = (newsid) => {
    console.log(newsid);
    try {
      if (user) {
        likeNews(newsid);
        setNews({
          ...news,
          likes: news.likedBy.includes(user.id) ? news.likes : news.likes + 1,
          dislikes: news.dislikedBy.includes(user.id)
            ? news.dislikes - 1
            : news.dislikes,
          likedBy: [...news.likedBy, user.id],
          dislikedBy: news.dislikedBy.filter((eachDislike) => {
            return eachDislike !== user.id;
          }),
        });
      } else navigation.navigate("login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisliked = (newsid) => {
    try {
      if (user) {
        dislikeNews(newsid);
        setNews({
          ...news,
          dislikes: news.dislikedBy.includes(user.id)
            ? news.dislikes
            : news.dislikes + 1,
          likes: news.dislikedBy.includes(user.id)
            ? news.likes
            : news.likes - 1,
          dislikedBy: [...news.dislikedBy, user.id],
          likedBy: news.likedBy.filter((eachlike) => {
            return eachlike !== user.id;
          }),
        });
      } else navigation.navigate("login");
    } catch (error) {
      console.log(error);
    }
  };

  if (isError) {
    return (
      <Error message={"Press the arrow button and Go back to home page"} />
    );
  }

  console.log(news, "new");
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.titleStyle}>{title}</Text>
        <View style={styles.imageCard}>
          <Image style={styles.image} source={{ uri: image }} />
        </View>
        <Text style={styles.description}>{description}</Text>
        {isLoading ? (
          <Loading size={"small"} />
        ) : (
          news && (
            <CommentLikeCard
              handleLiked={handleLiked}
              handleDisliked={handleDisliked}
              news={news}
              navigation={navigation}
              setNews={setNews}
            />
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: 0.7,
    color: color.black,
  },
  imageCard: { width: width * 1, height: 300 },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  description: {
    paddingHorizontal: 10,
    color: color.blueGray,
    marginBottom: 20,
    lineHeight: 25,
    letterSpacing: 0.5,
    fontSize: 15,
  },
  bottomCommentCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
    borderTopColor: color.blueOcean,
    borderTopWidth: 0.5,
    backgroundColor: color.gray,
    paddingTop: 10,
  },
  likeButton: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  likedeButton: {
    backgroundColor: color.blueOcean,
    color: color.white,
    width: 20,
    height: 20,
    borderRadius: 50,
  },
});
