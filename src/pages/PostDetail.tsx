import he from "he";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "@components/Button";
import Comments from "@components/Comments";
import ErrorMessage from "@components/ErrorMessage";
import NewComment from "@components/NewComment";

import PostInterface from "@interfaces/Posts";

import posts from "@util/posts";
import users from "@util/users";

export default function PostDetail() {
  const { groupId, postId } = useParams();
  const [commentCount, setCommentCount] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [post, setPost] = useState<null | PostInterface>(null);
  const [updateComments, setUpdateComments] = useState(false);
  const [username, setUsername] = useState<null | string>(null);

  const getAuthorUsername = async (author: string) => {
    const authorResult = await users.getUserInfo(author);
    if (authorResult.status === 200 && authorResult.user) {
      setError(null);
      // then get the author's username from their id
      setUsername(authorResult.user.username);
    } else {
      setUsername(null);
      setError(authorResult.message);
      console.error(authorResult);
    }
  };

  const getCommentCount = async (groupId: string, postId: string) => {
    const countResult = await posts.getCommentCount(groupId, postId);
    if (countResult.status === 200) {
      setError(null);
      setCommentCount(countResult.count);
    } else {
      setCommentCount(0);
      setError(countResult.message);
      console.error(countResult);
    }
  };

  const getPost = async () => {
    if (!groupId || !postId) {
      setError("Missing group or post id");
    } else {
      const result = await posts.getSinglePost(groupId, postId);
      if (result.status === 200 && result.post) {
        setError(null);
        // first set the post info
        setPost(result.post);
        // then convert author user id to username
        await getAuthorUsername(result.post.author);
        // finally get the comment count
        await getCommentCount(result.post.group, result.post.id);
      } else {
        setError(result.message);
        // XXX
        // display info more elegantly?
        console.error(result);
      }
    }
  };

  useEffect(() => {
    getPost();
    // we want the empty dependency array: only get the post info on mount
    // eslint-disable-next-line
  }, []);

  const likePost = async () => {
    if (!groupId || !postId) {
      setError("Missing group or post id");
    } else {
      const result = await posts.likePost(groupId, postId);
      if (result.status === 200) {
        // succesfully liked, reload the post
        getPost();
      } else {
        setError(result.message);
        // XXX
        // display info more elegantly?
        console.error(result);
      }
    }
  };

  const displayPost = () => {
    if (!post) {
      return (
        <ErrorMessage error={error} />
      );
    }
    return (
      <article>
        <h2>{he.decode(post.title)}</h2>
        <p>{he.decode(post.text)}</p>
        <p>{new Date(post.timestamp).toLocaleString()}</p>
        <p>{username ? he.decode(username) : ""}</p>
        <p>
          {post.likes.length} like{post.likes.length === 1 ? "" : "s"}
        </p>
        <p>
          {commentCount} comment{commentCount === 1 ? "" : "s"}
        </p>
        <Button onClick={likePost}>Like</Button>
        <ErrorMessage error={error} />
      </article>
    );
  };

  if (!groupId || !postId) {
    return <ErrorMessage error={"Missing group or post id"} />
  }

  const toggleUpdateComments = () => {
    setUpdateComments(!updateComments);
  };

  return (
    <>
      {displayPost()}
      <NewComment
        getPost={getPost}
        groupId={groupId}
        postId={postId}
        toggleUpdateComments={toggleUpdateComments}
      />
      <Comments
        groupId={groupId}
        postId={postId}
        updateComments={updateComments}
      />
    </>
  );
}
