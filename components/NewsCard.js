import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import { color } from "../utilities/Colors";
import CommentLikeCard from "./CommentLikeCard";
import { useSelector } from "react-redux";
import {
  useDislikeNewsByIdMutation,
  useLikeNewsByIdMutation,
} from "../services";

const { width } = Dimensions.get("window");

const NewsCard = ({ item, navigation }) => {
  const basicUrl = process.env.API_KEY;
  const [news, setNews] = useState({});
  const { user } = useSelector((state) => state.auth);
  const [likeNews] = useLikeNewsByIdMutation();
  const [dislikeNews] = useDislikeNewsByIdMutation();

  useEffect(() => {
    setNews(item);
  }, [item]);

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
    console.log(newsid);
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

  return (
    news && (
      <SafeAreaView style={styles.cardview}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Details", {
              _id: news._id,
              title: news.title,
              image: basicUrl + "/" + news.image,
              description: news.description,
              comments: news.comments,
              date: news.date,
              likes: news.likes,
              dislikes: news.dislikes,
              likedBy: news.likedBy,
              dislikedBy: news.dislikedBy,
            })
          }
        >
          <View>
            <Text style={styles.titleStyle}>{news.title}</Text>
            <View style={styles.imageCard}>
              <Image
                style={styles.image}
                source={{
                  uri: `${basicUrl + "/" + news.image}`,
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <CommentLikeCard
          handleLiked={handleLiked}
          handleDisliked={handleDisliked}
          news={news}
          navigation={navigation}
          setNews={setNews}
        />
      </SafeAreaView>
    )
  );
};
const styles = StyleSheet.create({
  cardview: {
    backgroundColor: color.gray,
    flexDirection: "column",
    justifyContent: "space-between",
    width: width * 1,
    borderColor: color.blueGray,
    borderWidth: 0.2,
    marginTop: 4,
  },
  titleStyle: {
    marginHorizontal: 15,
    marginTop: 15,
    color: color.black,
    borderLeftWidth: 0.8,
    borderLeftColor: color.primary,
    paddingLeft: width * 0.05,
    borderRightWidth: 0.8,
    borderRightColor: color.primary,
    paddingRight: width * 0.05,
    fontSize: 16,
    fontWeight: "bold",
  },
  imageCard: {
    width: width * 1,
    height: 260,
    marginVertical: width * 0.06,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bottomCardStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
    borderTopColor: color.blueOcean,
    borderTopWidth: 0.5,
    backgroundColor: color.gray,
    paddingTop: 7,
  },
  dateStyle: { color: color.blue, textAlign: "center" },
  likeButtonStyle: {
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

export default NewsCard;
