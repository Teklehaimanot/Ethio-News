import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { color } from "../../utilities/Colors";
import {
  useGetCommentsByIdQuery,
  usePostCommentsMutation,
} from "../../services";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

const { width } = Dimensions.get("window");

const CommentScreen = ({ route, navigation }) => {
  const { newsid } = route.params;
  const [comment, setComment] = useState("");
  const { user } = useSelector((state) => state.auth);

  const {
    data: commentsData,
    isError: commentsError,
    isLoading: isCommentsLoading,
    refetch,
    isFetching,
  } = useGetCommentsByIdQuery(newsid);

  useEffect(() => {
    refetch();
  }, [commentsData]);

  const handleRefresh = async () => {
    await refetch();
  };

  const [
    postCommment,
    {
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      error: postError,
      refetch: postRefetch,
    },
  ] = usePostCommentsMutation();

  const handleChangeComment = (newText) => {
    setComment(newText);
  };

  const handleSubmit = async () => {
    try {
      if (user) {
        const newComment = {
          commentText: comment,
          userId: user.id,
        };

        if (newComment.commentText) {
          await postCommment({ newComment, newsid });
          setComment("");
        }
      } else navigation.navigate("login");
    } catch (error) {
      console.log(error);
    }
  };

  const getRandomColor = () => {
    const colors = [
      "#FFB6C1", // Light Pink
      "#ADD8E6", // Light Blue
      "#98FB98", // Pale Green
      "#FFD700", // Gold
      "#FF6347", // Tomato
      "#7B68EE", // Medium Slate Blue
      "#FF8C00", // Dark Orange
      "#D3D3D3", // Light Gray
      "#F0E68C", // Khaki
      "#E6E6FA", // Lavender
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (isPostLoading || isCommentsLoading) {
    return <Loading />;
  }

  if (postError || commentsError) {
    return <Error message={"Tap to retry"} refetch={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
        style={{ flex: 1 }}
      >
        <View style={{ marginBottom: 80 }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={handleRefresh}
              />
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
                <Text style={styles.title}>Comments</Text>
              </View>
            </View>
            {commentsData?.map(
              (comment) =>
                comment.comment.user && (
                  <View style={styles.commentCard} key={comment.comment._id}>
                    <View style={styles.name}>
                      <View
                        style={[
                          styles.image,
                          { backgroundColor: getRandomColor() },
                        ]}
                      >
                        <Text style={styles.text}>
                          {comment.comment.user.name
                            .substring(0, 1)
                            .toUpperCase()}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: "Figtree-Regular",
                          color: color.sourceColor,
                          fontSize: 16,
                          lineHeight: 19.2,
                        }}
                      >
                        {comment.comment.user.name}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: width * 0.72,
                        margin: "auto",
                        paddingLeft: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Figtree-Regular",
                          fontSize: 16,
                          color: color.fontColor, // Applying random color
                        }}
                      >
                        {comment.comment.comment}
                      </Text>
                    </View>
                  </View>
                )
            )}
          </ScrollView>
        </View>

        <View style={styles.commentInputCard}>
          <View
            style={{
              width: width * 0.9,
              marginHorizontal: "auto",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              onChangeText={handleChangeComment}
              style={[
                styles.commentInput,
                { height: Math.max(40, comment.split("\n").length * 20) },
              ]}
              value={comment}
              placeholder="Leave your thoughts here..."
            />
            <Feather
              name="send"
              size={24}
              color={color.primary}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    height: 60,
  },
  title: {
    color: color.fontColor,
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    lineHeight: 19.2,
  },
  commentCard: {
    flexDirection: "col",
    width: width * 1,
    marginVertical: 10,
    paddingVertical: 5,
  },
  name: {
    flexDirection: "row",
    width: width * 0.92,
    margin: "auto",
    alignItems: "center",
  },
  image: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: color.white,
    borderWidth: 0.5,
    marginRight: 10,
  },
  text: {
    color: color.white,
    fontFamily: "Figtree-Bold",
    fontSize: 16,
    lineHeight: 19.2,
  },
  commentInputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 0.2,
    borderColor: color.sourceColor,
    backgroundColor: color.white,
    position: "absolute",
    bottom: 0,
    height: 80,
    width: width * 1,
    zIndex: 1,
  },
  commentInput: {
    backgroundColor: color.white,
    width: width * 0.8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    fontFamily: "Figtree-Regular",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default CommentScreen;
