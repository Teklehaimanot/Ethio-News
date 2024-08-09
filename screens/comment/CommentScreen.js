import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
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

const { width } = Dimensions.get("window");

const CommentScreen = ({ route, navigation }) => {
  const { newsid, comments } = route.params;
  const [comment, setComment] = useState("");
  const { user } = useSelector((state) => state.auth);
  const basicUrl = process.env.API_KEY;

  const {
    data: commentsData,
    error: commentsError,
    isLoading: isCommentsLoading,
    refetch,
  } = useGetCommentsByIdQuery(newsid);

  useEffect(() => {
    refetch(comments);
  }, [comments]);

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

  const handleSubmit = () => {
    try {
      if (user) {
        const newComment = {
          commentText: comment,
          userId: user.id,
        };

        if (newComment.commentText) {
          postCommment({ newComment, newsid });
          setComment("");
        }
      } else navigation.navigate("login");
    } catch (error) {
      console.log(error);
    }
  };

  if (isPostLoading || isCommentsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  if (postError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: color.red }}>
          Error posting comment. Please try again.
        </Text>
        {/* <TouchableOpacity onPress={refetch}>
          <Text style={{ color: color.blue, marginTop: 10 }}>Tap to retry</Text>
        </TouchableOpacity> */}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {commentsData?.map(
            (comment) =>
              comment.comment.user && (
                <View style={styles.commentCard} key={comment.comment._id}>
                  <View style={styles.image}>
                    <Text style={styles.text}>
                      {comment.comment.user.name.substring(0, 2).toUpperCase()}
                    </Text>
                    {/* <Image style={styles.image} source={image} /> */}
                  </View>
                  <View style={styles.commentView}>
                    <Text
                      style={{
                        padding: 5,
                        fontWeight: "bold",
                        letterSpacing: 0.8,
                        fontSize: 15,
                        color: color.greenGray,
                      }}
                    >
                      {comment.comment.user.name}
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                        color: color.black,
                      }}
                    >
                      {comment.comment.comment}
                    </Text>
                  </View>
                </View>
              )
          )}
        </ScrollView>

        <View style={styles.commentInputCard}>
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
            style={{ marginRight: 10 }}
            size={28}
            color={color.primary}
            onPress={handleSubmit}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentCard: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 8,
    width: width * 0.8,
  },
  image: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: (width * 0.13) / 2,
    backgroundColor: color.greenGray,
    alignItems: "center",
    justifyContent: "center",
    borderColor: color.black,
    marginHorizontal: 10,
  },
  text: {
    color: color.white,
    fontSize: width * 0.047,
    fontWeight: "bold",
  },
  commentView: {
    backgroundColor: color.grayBackground,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  commentInputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderBlockColor: color.grayBackground,
    backgroundColor: color.gray,
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  commentInput: {
    margin: 12,
    borderWidth: 0.05,
    padding: 10,
    flex: 8,
    backgroundColor: color.grayBackground,
    borderRadius: 1,
  },
});

export default CommentScreen;
