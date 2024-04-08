import he from "he";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Comments from "@components/Comments";
import ErrorMessage from "@components/ErrorMessage";
import NewComment from "@components/NewComment";
import PostControl from "@components/PostControl";
import UserInfo from "@components/UserInfo";

import { UserContext } from "@contexts/Users";

import useTitle from "@hooks/useTitle";

import GroupInterface from "@interfaces/Groups";
import PostInterface from "@interfaces/Posts";

import groups from "@util/groups";
import posts from "@util/posts";

export default function PostDetail() {
  const { groupId, postId } = useParams();
  const [commentCount, setCommentCount] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [group, setGroup] = useState<null | GroupInterface>(null);
  const [post, setPost] = useState<null | PostInterface>(null);
  const [updateComments, setUpdateComments] = useState(false);

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
        // then comment count
        await getCommentCount(result.post.group, result.post.id);
      } else {
        setError(result.message);
        // XXX
        // display info more elegantly?
        console.error(result);
      }
    }
  };

  const getGroup = async () => {
    if (!groupId) {
      setError("Missing group id");
    } else {
      const result = await groups.getGroupInfo(groupId);
      if (result.status === 200 && result.group) {
        setError(null);
        setGroup(result.group);
      } else {
        setError(result.message);
        console.error(result);
      }
    }
  };

  useTitle(post && group ? he.decode(`${group.name} - ${post.title}`) : "");

  useEffect(() => {
    getPost();
    getGroup();
  }, []);

  const { user } = useContext(UserContext);
  if (!user || !post || !group) {
    return null;
  }

  const toggleLike = async () => {
    if (!groupId || !postId) {
      setError("Missing group or post id");
    } else {
      const liked = post.likes.includes(user.id);
      const result = await posts.toggleLikePost(groupId, postId, liked);
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

  // this detemrines if the PostControl component is rendered
  const userIsAdmin = user.id === group.admin;
  const userIsMod = group.mods.includes(user.id);

  // these will determine if the "ban user" checkbox shows up in PostControl
  const eligibleForBan =
    !group.banned.includes(post.author) && group.members.includes(post.author);
  const postByAdmin = post.author === group.admin;

  // these will determine what posts a mod can or cannot delete
  const postByMod = group.mods.includes(post.author);
  const isOwnPost = user.id === post.author;

  const showPostControl = () => {
    if (!userIsAdmin && !userIsMod) {
      return false;
    }
    if (userIsMod && (postByAdmin || (postByMod && !isOwnPost))) {
      return false;
    }
    return true;
  };

  const displayPost = () => {
    if (!post) {
      return <ErrorMessage error={error} />;
    }
    return (
      <article className="rounded border-2 border-emerald-600 bg-white shadow-md shadow-slate-400">
        <h1 className="bg-emerald-600 p-1 text-2xl capitalize text-neutral-100">
          {he.decode(post.title)}
        </h1>
        <div className="flex flex-col gap-4 p-1">
          <div className="flex flex-wrap items-center justify-between gap-1 font-mono">
            <Link
              className="flex flex-1 flex-wrap items-center gap-2 text-sky-900"
              title="View post author's profile"
              to={`/users/${post.author}`}
            >
              <UserInfo
                avatar
                avatarMaxWidth={40}
                flipped
                userId={post.author}
                username
              />
            </Link>
            <div>{new Date(post.timestamp).toLocaleString()}</div>
          </div>

          {showPostControl() ? (
            <PostControl
              author={post.author}
              eligibleForBan={eligibleForBan}
              groupId={group.id}
              isOwnPost={isOwnPost}
              postByAdmin={postByAdmin}
              postByMod={postByMod}
              postId={post.id}
              updateGroupInfo={getGroup}
              userIsAdmin={userIsAdmin}
            />
          ) : null}

          <pre className="whitespace-pre-wrap font-sans text-lg">
            {he.decode(post.text)}
          </pre>

          <div className="flex justify-between gap-2 text-xl">
            <p className="flex gap-1">
              <button
                className="text-red-600"
                onClick={
                  group.members.includes(user.id) ? toggleLike : () => {}
                }
                title={post.likes.includes(user.id) ? "unlike" : "like"}
                type="button"
              >
                {post.likes.includes(user.id) ? "♥" : "♡"}
              </button>
              {post.likes.length}
            </p>
            <p className="flex gap-1">
              <span className="text-lg" title="comments">
                💬
              </span>
              {commentCount}
            </p>
          </div>
          <ErrorMessage error={error} />
        </div>
      </article>
    );
  };

  if (!groupId || !postId) {
    return <ErrorMessage error={"Missing group or post id"} />;
  }

  const toggleUpdateComments = () => {
    setUpdateComments(!updateComments);
  };

  return (
    <div className="flex flex-col gap-4">
      {displayPost()}
      {group.members.includes(user.id) ? (
        <NewComment
          getPost={getPost}
          groupId={groupId}
          postId={postId}
          toggleUpdateComments={toggleUpdateComments}
        />
      ) : null}
      <Comments group={group} postId={postId} updateComments={updateComments} />
    </div>
  );
}
