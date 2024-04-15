import api from "@configs/api";
import Response, { PostListResponse } from "@interfaces/Response";
import { CommentList } from "@interfaces/Comments";
import PostInterface from "@interfaces/Posts";

interface CommentCountResponse extends Response {
  count: number;
}

interface CommentsResponse extends Response {
  comments: null | CommentList;
}

interface CountResponse extends Response {
  count: number;
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

async function createNewPost(
  groupId: string,
  formInfo: { image: File | null; title: string; text: string },
) {
  // construct our multipart/form-data
  const formData = new FormData();
  formData.append("title", formInfo.title);
  formData.append("text", formInfo.text);
  if (formInfo.image) {
    formData.append("image", formInfo.image);
  }

  try {
    const response = await fetch(`${api.url}/groups/${groupId}/posts`, {
      body: formData,
      credentials: "include",
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

async function deleteComment(
  groupId: string,
  postId: string,
  commentId: string,
) {
  try {
    const response = await fetch(
      `${api.url}/groups/${groupId}/posts/${postId}/comments/${commentId}`,
      {
        credentials: "include",
        method: "DELETE",
        mode: "cors",
      },
    );
    const responseBody = await response.json();
    // successful response sends comment uri, but don't need it here
    const deleteResponse: Response = {
      status: response.status,
      message: responseBody.message,
    };
    // this happens with a 500 response from the server
    if (responseBody.error) {
      deleteResponse.error = responseBody.error;
    }
    return deleteResponse;
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

async function deletePost(groupId: string, postId: string) {
  try {
    const response = await fetch(
      `${api.url}/groups/${groupId}/posts/${postId}/`,
      {
        credentials: "include",
        method: "DELETE",
        mode: "cors",
      },
    );
    const responseBody = await response.json();
    // successful response sends comment uri, but don't need it here
    const deleteResponse: Response = {
      status: response.status,
      message: responseBody.message,
    };
    // this happens with a 500 response from the server
    if (responseBody.error) {
      deleteResponse.error = responseBody.error;
    }
    return deleteResponse;
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

async function getGroupPosts(
  groupId: string,
  options?: { limit?: number; skip?: number; sort?: string },
) {
  try {
    const url = new URL(`${api.url}/groups/${groupId}/posts`);
    if (options) {
      if (options.limit) {
        url.searchParams.append("limit", options.limit.toString());
      }
      if (options.skip) {
        url.searchParams.append("skip", options.skip.toString());
      }
      if (options.sort) {
        url.searchParams.append("sort", options.sort.toString());
      }
    }
    const response = await fetch(url, {
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

async function getPostCount(groupId: string) {
  try {
    const response = await fetch(`${api.url}/groups/${groupId}/posts/count`, {
      credentials: "include",
      method: "GET",
      mode: "cors",
    });
    const responseBody = await response.json();
    const commentsResponse: CountResponse = {
      status: response.status,
      message: responseBody.message,
      count: 0,
    };
    if (response.status === 200) {
      // everything went ok! give em the group info
      commentsResponse.count = responseBody.count;
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
      count: 0,
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

async function toggleLikePost(groupId: string, postId: string, liked: boolean) {
  const path = !liked ? "like" : "unlike";
  try {
    const response = await fetch(
      `${api.url}/groups/${groupId}/posts/${postId}/${path}`,
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

async function toggleStickyPost(
  groupId: string,
  postId: string,
  sticky: boolean,
) {
  const path = sticky ? "unstick" : "sticky";
  try {
    const response = await fetch(
      `${api.url}/groups/${groupId}/posts/${postId}/${path}`,
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
    // this happens with a 500 response, either from a problem setting post
    // stickiness or for some other unforseen server issue
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
  deleteComment,
  deletePost,
  getCommentCount,
  getGroupPosts,
  getPostComments,
  getPostCount,
  getSinglePost,
  toggleLikePost,
  toggleStickyPost,
};

export default posts;
