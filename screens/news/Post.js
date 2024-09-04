import { useEffect, useState } from "react";
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
import { useGetNewsByIdQuery, useLikeNewsByIdMutation } from "../../services";
import moment from "moment";
import { color } from "../../utilities/Colors";
import CommentLikeCard from "../../components/CommentLikeCard";
import Loading from "../../components/Loading";
import Error from "../../components/Error";

const { width } = Dimensions.get("window");
const Post = ({ route, navigation }) => {
  const { _id, title, image, description, source, date } = route.params;
  const { user } = useSelector((state) => state.auth);
  const { data, refetch, isLoading, isError } = useGetNewsByIdQuery(_id);
  const [news, setNews] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [likeNews] = useLikeNewsByIdMutation();

  const now = moment();
  const postMoment = moment(date);

  const diffInDays = now.diff(postMoment, "days");
  const diffInYears = now.diff(postMoment, "years");

  const formatDate = () => {
    if (diffInYears >= 1) {
      return postMoment.format("MMM D, YYYY"); // Example: Aug 1, 2023
    } else if (diffInDays > 7) {
      return postMoment.format("MMM D"); // Example: Aug 1
    } else if (diffInDays >= 1) {
      return `${diffInDays} d`;
    } else if (now.diff(postMoment, "hours") >= 1) {
      return `${now.diff(postMoment, "hours")} h`;
    } else if (now.diff(postMoment, "minutes") >= 1) {
      return `${now.diff(postMoment, "minutes")} m`;
    } else {
      return `Just now`;
    }
  };

  useEffect(() => {
    setNews(data);
  }, [data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const handleLiked = (newsid) => {
    try {
      if (user) {
        likeNews(newsid);
        setNews({
          ...news,
          likes: news.likedBy.includes(user.id)
            ? news.likes - 1
            : news.likes + 1,
          likedBy: news.likedBy.includes(user.id)
            ? news.likedBy.filter((eachLike) => {
                return eachLike !== user.id;
              })
            : [...news.likedBy, user.id],
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

  // console.log(image);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.titleStyle}>{title}</Text>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
          }}
        >
          <Text style={{ color: color.grayLight, fontWeight: "300" }}>
            {source ? `${source + " " + "|" + " "}` : " "}
          </Text>
          <Text style={{ color: color.grayLight, fontWeight: "300" }}>
            {formatDate()}
          </Text>
        </View>
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
