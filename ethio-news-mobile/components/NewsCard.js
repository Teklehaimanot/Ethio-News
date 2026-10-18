import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Image } from "expo-image";
import CommentLikeCard from "./CommentLikeCard";
import { useSelector } from "react-redux";
import { useLikeNewsByIdMutation } from "../services";
import { getImageUrl } from "../utilities/getImageUrl";
import moment from "moment";
import { ThemeContext } from "../utilities/ThemeProvider";

const { width } = Dimensions.get("window");
const PLACEHOLDER =
  "https://via.placeholder.com/800x450?text=Ethio+News";

const NewsCard = ({ item, navigation }) => {
  const [news, setNews] = useState(item || {});
  const { user } = useSelector((state) => state.auth) || {};
  const [likeNews] = useLikeNewsByIdMutation();
  const { theme } = useContext(ThemeContext);
  const imageUri = getImageUrl(news.image) || PLACEHOLDER;

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
    if (item) {
      setNews(item);
    }
  }, [item]);

  const handleLiked = (newsid) => {
    try {
      if (user) {
        likeNews(newsid);
        const likedBy = news.likedBy || [];
        setNews({
          ...news,
          likes: likedBy.includes(user.id) ? news.likes - 1 : news.likes + 1,
          likedBy: likedBy.includes(user.id)
            ? likedBy.filter((eachLike) => eachLike !== user.id)
            : [...likedBy, user.id],
        });
      } else navigation.navigate("login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!news?._id) {
    return null;
  }

  return (
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
            image: imageUri,
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
              source={{ uri: imageUri }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.sourceStyle, { color: theme.text2 }]}>
              {news.source ? `${news.source} | ` : ""}
            </Text>
            <Text style={[styles.sourceStyle, { color: theme.text2 }]}>
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
  );
};

const styles = StyleSheet.create({
  cardview: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: width * 0.92,
    alignSelf: "center",
    marginTop: width * 0.045,
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
  metaRow: {
    flexDirection: "row",
    marginVertical: 20,
    marginHorizontal: 25,
    alignItems: "center",
  },
  imageCard: {
    width: "100%",
    height: 240,
    overflow: "hidden",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#e8e8e8",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default NewsCard;
