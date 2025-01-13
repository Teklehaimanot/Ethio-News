import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  RefreshControl,
  Linking,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { useGetNewsByIdQuery, useLikeNewsByIdMutation } from "../../services";
import {
  addBookmark,
  removeBookmark,
  isBookmarked as checkIsBookmarked,
} from "../../utilities/Bookmark";
import moment from "moment";
import { color } from "../../utilities/Colors";
import CommentLikeCard from "../../components/CommentLikeCard";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Feather from "@expo/vector-icons/Feather";

const { width } = Dimensions.get("window");
const Post = ({ route, navigation }) => {
  const { _id, title, image, description, source, sourceUrl, date } =
    route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);
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
    const fetchBookmarkStatus = async () => {
      const bookmarked = await checkIsBookmarked(_id);
      setIsBookmarked(bookmarked);
    };
    fetchBookmarkStatus();
  }, [_id]);

  const handleBookmark = async () => {
    console.log("book");
    if (isBookmarked) {
      await removeBookmark(_id);
    } else {
      await addBookmark(_id);
    }
    setIsBookmarked(!isBookmarked);
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

  const openSourceUrl = () => {
    if (sourceUrl) {
      Linking.openURL(sourceUrl).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  if (isError) {
    return (
      <Error message={"Press the arrow button and Go back to home page"} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather
              name="arrow-left"
              size={24}
              color={color.fontColor}
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            />
            <Text style={styles.title}>News Detail</Text>
          </View>
          <FontAwesome
            name={isBookmarked ? "bookmark" : "bookmark-o"}
            size={24}
            color={color.fontColor}
            onPress={handleBookmark}
          />
        </View>

        <View style={styles.imageCard}>
          <Image style={styles.image} source={{ uri: image }} />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <Text style={styles.sourceText} onPress={openSourceUrl}>
            {source ? `${source} ` : " "}
          </Text>
          <Text style={styles.sourceText}>{`  | ${formatDate()}`}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        {/* <Text style={styles.description}>{description}</Text> */}
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
    backgroundColor: color.white,
  },
  header: {
    backgroundColor: color.white,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  title: {
    color: color.fontColor,
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    lineHeight: 19.2,
  },
  description: {
    color: color.fontColor,
    paddingHorizontal: 20,
    fontFamily: "Figtree-Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  sourceText: {
    color: color.sourceColor,
    fontFamily: "Figtree-Regular",
    fontSize: 14,
    lineHeight: 16.5,
  },
  imageCard: {
    marginVertical: 15,
    width: width * 0.92,
    height: 300,
    marginHorizontal: "auto",
    borderRadius: 10,
    borderColor: color.white,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.05,
    elevation: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
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
