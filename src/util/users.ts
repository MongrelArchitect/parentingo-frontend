import api from "@configs/api";

import { UserResponse } from "@interfaces/Response";

async function getUserInfo(userId: string) {
  try {
    const response = await fetch(`${api.url}/users/${userId}`, {
      credentials: "include",
      method: "GET",
      mode: "cors",
    });
    const responseBody = await response.json();
    const userResponse: UserResponse = {
      status: response.status,
      message: responseBody.message,
      user: null,
    };
    if (response.status === 200) {
      // everything went ok! give em the group info
      userResponse.user = responseBody.user;
    }
    // this happens with a 500 response, either from a problem getting the
    // group info  or for some other unforseen server issue
    if (responseBody.error) {
      userResponse.error = responseBody.error;
    }
    return userResponse;
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
      user: null,
    };
  }
}

const users = {
  getUserInfo,
};

export default users;
