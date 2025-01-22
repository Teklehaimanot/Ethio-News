import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import {
  useGetCommentsByIdQuery,
  usePostCommentsMutation,
} from "../../services";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import CommentViewCard from "../../components/CommentViewCard";
import { ThemeContext } from "../../utilities/ThemeProvider";

const { width } = Dimensions.get("window");

const CommentScreen = ({ route, navigation }) => {
  const { newsid } = route.params;
  const [comment, setComment] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { theme } = useContext(ThemeContext);

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

  if (isPostLoading || isCommentsLoading) {
    return <Loading />;
  }

  if (postError || commentsError) {
    return <Error message={"Tap to retry"} refetch={refetch} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
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
            <View style={[styles.header, { backgroundColor: theme.bg }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backIcon}
                >
                  <Feather name="arrow-left" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>
                  Comments
                </Text>
              </View>
            </View>
            {commentsData?.map(
              (comment) =>
                comment.comment.user && (
                  <CommentViewCard
                    comment={comment}
                    key={comment.comment._id}
                  />
                )
            )}
          </ScrollView>
        </View>

        <View
          style={[
            styles.commentInputCard,
            { borderColor: theme.text2, backgroundColor: theme.bg },
          ]}
        >
          <View
            style={[styles.commentInputWrapper, { backgroundColor: theme.bg }]}
          >
            <TextInput
              onChangeText={handleChangeComment}
              style={[styles.commentInput, { color: theme.text }]}
              value={comment}
              placeholderTextColor={theme.text2}
              placeholder="Leave your thoughts here..."
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
            >
              <Feather name="send" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  title: {
    fontFamily: "Figtree-Bold",
    fontSize: 18,
    lineHeight: 19.2,
  },
  backIcon: {
    marginRight: 15,
  },

  commentInputCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginTop: 20,
    paddingVertical: 5,
    position: "absolute",
    bottom: 30,
    width: width,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  commentInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    width: width * 0.92,
    borderWidth: 0.2,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 16,
    fontFamily: "Figtree-Regular",
    lineHeight: 22,
    paddingVertical: 5,
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default CommentScreen;
