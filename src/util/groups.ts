import api from "@configs/api";

import { GroupList } from "@interfaces/Groups";
import Response, { GroupResponse } from "@interfaces/Response";

interface NewGroupForm {
  name: string;
  description: string;
}

interface AllGroups extends Response {
  groups: GroupList | null;
}

async function attemptNewGroup(formInfo: NewGroupForm) {
  // fetch will serialize this to x-www-form-urlencoded (what server expects)
  const formBody = new URLSearchParams();
  const formKeys = Object.keys(formInfo) as Array<keyof NewGroupForm>;
  formKeys.forEach((field) => {
    formBody.append(field, formInfo[field]);
  });

  try {
    const response = await fetch(`${api.url}/groups/`, {
      body: formBody,
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      mode: "cors",
    });
    const responseBody = await response.json();
    const newGroupResponse: GroupResponse = {
      status: response.status,
      message: responseBody.message,
    };
    if (response.status === 201) {
      // everything went ok! give em the group info
      newGroupResponse.group = responseBody.group;
    }
    // this happens with a 400 response, either from invalid/missing form
    // data or from a alread existing group name
    if (responseBody.errors) {
      newGroupResponse.errors = responseBody.errors;
    }
    // this happens with a 500 response, either from a problem creating the
    // group or for some other unforseen server issue
    if (responseBody.error) {
      newGroupResponse.error = responseBody.error;
    }
    return newGroupResponse;
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
      group: null,
    };
  }
}

async function getAllGroups() {
  try {
    const response = await fetch(`${api.url}/groups/`, {
      credentials: "include",
      method: "GET",
      mode: "cors",
    });
    const responseBody = await response.json();
    const groupsResponse: AllGroups = {
      status: response.status,
      message: responseBody.message,
      groups: null,
    };
    if (response.status === 200) {
      // everything went ok! give em all the groups
      groupsResponse.groups = responseBody.groups;
    }
    // this happens with a 500 response, either from a problem getting the
    // groups or for some other unforseen server issue
    if (responseBody.error) {
      groupsResponse.error = responseBody.error;
    }
    return groupsResponse;
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
      groups: null,
    };
  }
}

async function getGroupInfo(groupId: string) {
  try {
    const response = await fetch(`${api.url}/groups/${groupId}`, {
      credentials: "include",
      method: "GET",
      mode: "cors",
    });
    const responseBody = await response.json();
    const groupResponse: GroupResponse = {
      status: response.status,
      message: responseBody.message,
    };
    if (response.status === 200) {
      // everything went ok! give em the group info
      groupResponse.group = responseBody.group;
    }
    // this happens with a 500 response, either from a problem getting the
    // group info  or for some other unforseen server issue
    if (responseBody.error) {
      groupResponse.error = responseBody.error;
    }
    return groupResponse;
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
      group: null,
    };
  }
}

async function getMemberGroups() {
  try {
    const response = await fetch(`${api.url}/groups/member`, {
      credentials: "include",
      method: "GET",
      mode: "cors",
    });
    const responseBody = await response.json();
    const groupsResponse: AllGroups = {
      status: response.status,
      message: responseBody.message,
      groups: null,
    };
    if (response.status === 200) {
      // everything went ok! give em all the groups
      groupsResponse.groups = responseBody.groups ? responseBody.groups : null;
    }
    // this happens with a 500 response, either from a problem getting the
    // groups or for some other unforseen server issue
    if (responseBody.error) {
      groupsResponse.error = responseBody.error;
    }
    return groupsResponse;
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
      groups: null,
    };
  }
}

async function leaveGroup(groupId: string) {
  try {
    const response = await fetch(`${api.url}/groups/${groupId}/leave`, {
      credentials: "include",
      method: "PATCH",
      mode: "cors",
    });
    const responseBody = await response.json();
    const result: Response = {
      status: response.status,
      message: responseBody.message,
    };
    // this happens with a 500 response, either from a problem getting the
    // groups or for some other unforseen server issue
    if (responseBody.error) {
      result.error = responseBody.error;
    }
    return result;
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

async function joinGroup(groupId: string) {
  try {
    const response = await fetch(`${api.url}/groups/${groupId}/members`, {
      credentials: "include",
      method: "PATCH",
      mode: "cors",
    });
    const responseBody = await response.json();
    const result: Response = {
      status: response.status,
      message: responseBody.message,
    };
    // this happens with a 500 response, either from a problem getting the
    // groups or for some other unforseen server issue
    if (responseBody.error) {
      result.error = responseBody.error;
    }
    return result;
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

const groups = {
  attemptNewGroup,
  getAllGroups,
  getGroupInfo,
  getMemberGroups,
  joinGroup,
  leaveGroup,
};

export default groups;
