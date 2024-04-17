import he from "he";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "@components/ErrorMessage";
import PostSummary from "@components/PostSummary";
import UserInfo from "@components/UserInfo";

import { UserContext } from "@contexts/Users";

import { GroupList } from "@interfaces/Groups";
import { PostList } from "@interfaces/Posts";

import groups from "@util/groups";
import posts from "@util/posts";
import users from "@util/users";

export default function Home() {
  const { user } = useContext(UserContext);

  const [error, setError] = useState<string | null>(null);
  const [recentUserPosts, setRecentUserPosts] = useState<null | {
    [key: string]: PostList;
  }>(null);
  const [memberGroups, setMemberGroups] = useState<null | GroupList>(null);
  const [recentGroupPosts, setRecentGroupPosts] = useState<null | {
    [key: string]: PostList;
  }>(null);

  const getGroups = async () => {
    const result = await groups.getMemberGroups();
    if (result.status === 200) {
      setMemberGroups(result.groups);
    } else {
      // XXX
      // need to parse error messages & provide feedback to user
      console.log(result);
      setError(result.message);
    }
  };

  const postLimit = 5;

  const getRecentGroupPosts = async () => {
    if (memberGroups) {
      const groupIds = Object.keys(memberGroups);
      const postList: { [key: string]: PostList } = {};
      for (const groupId of groupIds) {
        const response = await posts.getGroupPosts(groupId, {
          // XXX
          // TODO
          // just get 5 most recent posts from each group for now,
          // implement pagination / "skip" later
          limit: postLimit,
          noSticky: true,
          sort: "newest",
        });
        if (response.posts) {
          postList[groupId] = response.posts;
        }
      }
      setRecentGroupPosts(postList);
    }
  };

  const getUserPosts = async () => {
    if (user) {
      const postList: { [key: string]: PostList } = {};
      for (const userId of user.following) {
        const response = await users.getUserPosts(userId, {
          // XXX
          // TODO
          // just get 5 most recent posts from each user for now,
          // implement pagination / "skip" later
          sort: "newest",
          limit: postLimit,
        });
        if (response.posts) {
          postList[userId] = response.posts;
        }
      }
      setRecentUserPosts(postList);
    }
  };

  useEffect(() => {
    // when component first mounts, get all the groups the member belongs to
    getGroups();
    // also get posts from those the user is following
    getUserPosts();
  }, []);

  useEffect(() => {
    // need to get recent posts for the groups once they're set
    getRecentGroupPosts();
  }, [memberGroups]);

  if (!user) {
    return null;
  }

  const displayGroupPosts = () => {
    if (!recentGroupPosts || !memberGroups) {
      return <div>No posts available</div>;
    }

    const groupIds = Object.keys(recentGroupPosts);
    if (!groupIds.length) {
      return <div>No posts available</div>;
    }

    return groupIds.map((groupId) => {
      const groupPosts = recentGroupPosts[groupId];
      const postIds = Object.keys(groupPosts);
      return (
        <ul className="flex flex-col gap-4" key={groupId}>
          <h3 className="rounded border-2 border-sky-600 bg-sky-600 p-1 text-2xl capitalize shadow-md shadow-slate-400">
            <Link
              className="text-neutral-100"
              title={`Visit ${he.decode(memberGroups[groupId].name)} group`}
              to={`/groups/${groupId}`}
            >
              {he.decode(memberGroups[groupId].name)}
            </Link>
          </h3>
          {postIds.map((postId) => {
            const post = groupPosts[postId];
            return <PostSummary key={postId} post={post} />;
          })}
        </ul>
      );
    });
  };

  const displayUserPosts = () => {
    if (!user.following.length || !recentUserPosts) {
      return <div>No posts available</div>;
    }
    return user.following.map((userId) => {
      const userPosts = recentUserPosts[userId];
      const postIds = Object.keys(userPosts);
      return (
        <ul className="flex flex-col gap-4" key={userId}>
          <h3 className="rounded border-2 border-slate-600 bg-slate-600 p-1 text-2xl capitalize shadow-md shadow-slate-400">
            <Link
              className="flex flex-wrap items-center gap-2 text-neutral-100"
              title="View user's profile"
              to={`/users/${userId}`}
            >
              <UserInfo
                avatar
                avatarMaxWidth={48}
                flipped
                userId={userId}
                username
              />
            </Link>
          </h3>
          {postIds.length ? (
            postIds.map((postId) => {
              const post = userPosts[postId];
              return <PostSummary key={postId} post={post} />;
            })
          ) : (
            <div>No posts available</div>
          )}
        </ul>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl">Welcome {user.name}!</h1>
      <p>
        Here are the {postLimit} most recent posts in your groups and by users
        you follow.
      </p>

      <h2 className="text-2xl">Your Groups</h2>
      {displayGroupPosts()}

      <h2 className="text-2xl">Following</h2>
      {displayUserPosts()}

      <ErrorMessage error={error} />
    </div>
  );
}
