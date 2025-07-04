import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import CommentLikeCard from "./CommentLikeCard";
import { useSelector } from "react-redux";
import { useLikeNewsByIdMutation } from "../services";
import { baseUrl } from "../config";
import moment from "moment";
import { ThemeContext } from "../utilities/ThemeProvider";

const BASE_URL = baseUrl;
const { width } = Dimensions.get("window");
const NewsCard = ({ item, navigation }) => {
  const basicUrl = BASE_URL;
  const [news, setNews] = useState({});
  const { user } = useSelector((state) => state.auth);
  const [likeNews] = useLikeNewsByIdMutation();
  const { theme } = useContext(ThemeContext);

  const now = moment();
  const postMoment = moment(news.date);

  const diffInDays = now.diff(postMoment, "days");
  const diffInYears = now.diff(postMoment, "years");

  const formatDate = () => {
    if (diffInYears >= 1) {
      return postMoment.format("MMM D, YYYY");
    } else if (diffInDays > 7) {
      return postMoment.format("MMM D");
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
    setNews(item);
  }, [item]);

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

  return (
    news && (
      <SafeAreaView
        style={[
          styles.cardview,
          { backgroundColor: theme.bg2, borderColor: theme.text },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Details", {
              _id: news._id,
              title: news.title,
              image: basicUrl + "/" + news.image,
              source: news.source,
              sourceUrl: news.sourceUrl,
              description: news.description,
              comments: news.comments,
              date: news.date,
              likes: news.likes,
              likedBy: news.likedBy,
            })
          }
        >
          <View>
            <View style={styles.imageCard}>
              <Image
                style={styles.image}
                source={{
                  uri: `${basicUrl + "/" + news.image}`,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 20,
                marginHorizontal: 25,
                alignItems: "center",
              }}
            >
              <Text style={[styles.sourceStyle, { color: theme.text2 }]}>
                {news.source ? `${news.source + " " + "|" + " "}` : " "}
              </Text>
              <Text style={(styles.sourceStyle, { color: theme.text2 })}>
                {formatDate()}
              </Text>
            </View>
            <Text style={[styles.titleStyle, { color: theme.text }]}>
              {news.title}
            </Text>
          </View>
        </TouchableOpacity>
        <CommentLikeCard
          handleLiked={handleLiked}
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
    flexDirection: "column",
    justifyContent: "space-between",
    width: width * 0.92,
    marginTop: width * 0.045,
    marginHorizontal: "auto",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  titleStyle: {
    paddingHorizontal: 25,
    fontFamily: "Figtree-SemiBold",
    fontSize: 16,
    lineHeight: 19.2,
  },
  sourceStyle: {
    fontFamily: "Figtree-Regular",
    fontSize: 14.5,
    lineHeight: 16.5,
  },
  imageCard: {
    height: 240,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});

export default NewsCard;
