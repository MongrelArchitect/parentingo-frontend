import api from "@configs/api";

import Response, { UserResponse } from "@interfaces/Response";
import { UpdateFormInfo } from "@interfaces/Users";

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

async function updateUserInfo(updates: UpdateFormInfo) {
  try {
    // construct our multipart/form-data
    const formData = new FormData();
    if (updates.avatar.changed && updates.avatar.file) {
      formData.append("avatar", updates.avatar.file);
    }
    if(updates.bio.changed && updates.bio.value) {
      formData.append("bio", updates.bio.value);
    }
    if(updates.name.changed && updates.name.value) {
      formData.append("name", updates.name.value);
    }

    const response = await fetch(`${api.url}/users/current`, {
      credentials: "include",
      method: "PATCH",
      mode: "cors",
      body: formData,
    });
    const responseBody = await response.json();
    const updateResponse: Response = {
      status: response.status,
      message: responseBody.message,
    };
    if (response.status === 200) {
      // everything went ok!
      // XXX now wat?
    }
    // this happens with a 500 response from some unforseen server error
    if (responseBody.error) {
      updateResponse.error = responseBody.error;
    }
    return updateResponse;
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

async function followUser(userId: string) {
  try {
    const response = await fetch(`${api.url}/users/${userId}/follow`, {
      credentials: "include",
      method: "PATCH",
      mode: "cors",
    });
    const responseBody = await response.json();
    const followResponse: Response = {
      status: response.status,
      message: responseBody.message,
    };
    // this happens with a 500 response, either from a problem following the
    // user or for some other unforseen server issue
    if (responseBody.error) {
      followResponse.error = responseBody.error;
    }
    return followResponse;
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

async function unfollowUser(userId: string) {
  try {
    const response = await fetch(`${api.url}/users/${userId}/unfollow`, {
      credentials: "include",
      method: "PATCH",
      mode: "cors",
    });
    const responseBody = await response.json();
    const followResponse: Response = {
      status: response.status,
      message: responseBody.message,
    };
    // this happens with a 500 response, either from a problem unfollowing the
    // user or for some other unforseen server issue
    if (responseBody.error) {
      followResponse.error = responseBody.error;
    }
    return followResponse;
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

const users = {
  followUser,
  getUserInfo,
  unfollowUser,
  updateUserInfo,
};

export default users;
