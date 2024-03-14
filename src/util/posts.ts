import api from "@configs/api";
import Response from "@interfaces/Response";
import { CommentList } from "@interfaces/Comments";
import PostInterface, { PostList } from "@interfaces/Posts";

interface CommentCountResponse extends Response {
  count: number;
}

interface CommentsResponse extends Response {
  comments: null | CommentList;
}

interface NewPostResponse extends Response {
  post: null | {
    id: string;
    uri: string;
  };
}

interface PostResponse extends Response {
  post: null | PostInterface;
}

interface PostListResponse extends Response {
  posts: null | PostList;
}

async function createNewPost(groupId: string, text: string) {
  // fetch will serialize this to x-www-form-urlencoded (what server expects)
  const formBody = new URLSearchParams();
  formBody.append("text", text);

  try {
    const response = await fetch(`${api.url}/groups/${groupId}/posts`, {
      body: formBody,
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      mode: "cors",
    });
    const responseBody = await response.json();
    const newPostResponse: NewPostResponse = {
      status: response.status,
      message: responseBody.message,
      post: null,
    };
    if (response.status === 201) {
      // everything went ok! give em the post info
      newPostResponse.post = {
        id: responseBody.id,
        uri: responseBody.uri,
      };
    }
    // this happens with a 400 response from invalid/missing form data
    if (responseBody.errors) {
      newPostResponse.errors = responseBody.errors;
    }
    // this happens with a 500 response, either from a problem creating the
    // post or for some other unforseen server issue
    if (responseBody.error) {
      newPostResponse.error = responseBody.error;
    }
    return newPostResponse;
  } catch (err) {
    // XXX
    // display this error in ui?
    console.error(err);
    // this will happen if there's some problem with fetch itself, just
    // report as a server error & handle similarly
    return {
      status: 500,
      message: "Server error",
      error: err,
      post: null,
    };
  }
}

async function createNewComment(groupId: string, postId: string, text: string) {
  // fetch will serialize this to x-www-form-urlencoded (what server expects)
  const formBody = new URLSearchParams();
  formBody.append("text", text);

  try {
    const response = await fetch(
      `${api.url}/groups/${groupId}/posts/${postId}/comments`,
      {
        body: formBody,
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        mode: "cors",
      },
    );
    const responseBody = await response.json();
    // successful response sends comment uri, but don't need it here
    const newPostResponse: Response = {
      status: response.status,
      message: responseBody.message,
    };
    // this happens with a 400 response from invalid/missing form data
    if (responseBody.errors) {
      newPostResponse.errors = responseBody.errors;
    }
    // this happens with a 500 response, either from a problem creating the
    // post or for some other unforseen server issue
    if (responseBody.error) {
      newPostResponse.error = responseBody.error;
    }
    return newPostResponse;
  } catch (err) {
    // XXX
    // display this error in ui?
    console.error(err);
    // this will happen if there's some problem with fetch itself, just
    // report as a server error & handle similarly
    return {
      status: 500,
      message: "Server error",
      error: err,
    };
  }
}

async function getCommentCount(groupId: string, postId: string) {
  try {
    const response = await fetch(
      `${api.url}/groups/${groupId}/posts/${postId}/comments/count`,
      {
        credentials: "include",
        method: "GET",
        mode: "cors",
      },
    );
    const responseBody = await response.json();
    const postsResponse: CommentCountResponse = {
      status: response.status,
      message: responseBody.message,
      count: 0,
    };
    if (response.status === 200) {
      // everything went ok! give em the group info
      postsResponse.count = responseBody.count;
    }
    // this happens with a 500 response, either from a problem getting the
    // group info  or for some other unforseen server issue
    if (responseBody.error) {
      postsResponse.error = responseBody.error;
    }
    return postsResponse;
  } catch (err) {
    // XXX
    // display this error in ui?
    console.error(err);
    // this will happen if there's some problem with fetch itself, just
    // report as a server error & handle similarly
    return {
      status: 500,
      message: "Server error",
      error: err,
      count: 0,
    };
  }
}

async function getGroupPosts(groupId: string) {
  try {
    const response = await fetch(`${api.url}/groups/${groupId}/posts`, {
      credentials: "include",
      method: "GET",
      mode: "cors",
    });
    const responseBody = await response.json();
    const postsResponse: PostListResponse = {
      status: response.status,
      message: responseBody.message,
      posts: null,
    };
    if (response.status === 200) {
      // everything went ok! give em the group info
      postsResponse.posts = responseBody.posts;
    }
    // this happens with a 500 response, either from a problem getting the
    // group info  or for some other unforseen server issue
    if (responseBody.error) {
      postsResponse.error = responseBody.error;
    }
    return postsResponse;
  } catch (err) {
    // XXX
    // display this error in ui?
    console.error(err);
    // this will happen if there's some problem with fetch itself, just
    // report as a server error & handle similarly
    return {
      status: 500,
      message: "Server error",
      error: err,
      posts: null,
    };
  }
}

async function getPostComments(groupId: string, postId: string) {
  try {
    const response = await fetch(
      `${api.url}/groups/${groupId}/posts/${postId}/comments`,
      {
        credentials: "include",
        method: "GET",
        mode: "cors",
      },
    );
    const responseBody = await response.json();
    const commentsResponse: CommentsResponse = {
      status: response.status,
      message: responseBody.message,
      comments: null,
    };
    if (response.status === 200) {
      // everything went ok! give em the group info
      commentsResponse.comments = responseBody.comments;
    }
    // this happens with a 500 response, either from a problem getting the
    // group info  or for some other unforseen server issue
    if (responseBody.error) {
      commentsResponse.error = responseBody.error;
    }
    return commentsResponse;
  } catch (err) {
    // XXX
    // display this error in ui?
    console.error(err);
    // this will happen if there's some problem with fetch itself, just
    // report as a server error & handle similarly
    return {
      status: 500,
      message: "Server error",
      error: err,
      comments: null,
    };
  }
}

async function getSinglePost(groupId: string, postId: string) {
  try {
    const response = await fetch(
      `${api.url}/groups/${groupId}/posts/${postId}`,
      {
        credentials: "include",
        method: "GET",
        mode: "cors",
      },
    );
    const responseBody = await response.json();
    const postResponse: PostResponse = {
      status: response.status,
      message: responseBody.message,
      post: null,
    };
    if (response.status === 200) {
      // everything went ok! give em the group info
      postResponse.post = responseBody.post;
    }
    // this happens with a 500 response, either from a problem getting the
    // group info  or for some other unforseen server issue
    if (responseBody.error) {
      postResponse.error = responseBody.error;
    }
    return postResponse;
  } catch (err) {
    // XXX
    // display this error in ui?
    console.error(err);
    // this will happen if there's some problem with fetch itself, just
    // report as a server error & handle similarly
    return {
      status: 500,
      message: "Server error",
      error: err,
      post: null,
    };
  }
}

async function likePost(groupId: string, postId: string) {
  try {
    const response = await fetch(
      `${api.url}/groups/${groupId}/posts/${postId}/like`,
      {
        credentials: "include",
        method: "PATCH",
        mode: "cors",
      },
    );
    const responseBody = await response.json();
    const postResponse: Response = {
      status: response.status,
      message: responseBody.message,
    };
    // this happens with a 500 response, either from a problem getting the
    // info or for some other unforseen server issue
    if (responseBody.error) {
      postResponse.error = responseBody.error;
    }
    return postResponse;
  } catch (err) {
    // XXX
    // display this error in ui?
    console.error(err);
    // this will happen if there's some problem with fetch itself, just
    // report as a server error & handle similarly
    return {
      status: 500,
      message: "Server error",
      error: err,
    };
  }
}

const posts = {
  createNewComment,
  createNewPost,
  getCommentCount,
  getGroupPosts,
  getPostComments,
  getSinglePost,
  likePost,
};

export default posts;
