import api from "@configs/api";
import Response from "@interfaces/Response";

interface PostResponse extends Response {
  post: null | {
    id: string;
    uri: string;
  }
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
    const newPostResponse: PostResponse = {
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

const posts = {
  createNewPost,
};

export default posts;
