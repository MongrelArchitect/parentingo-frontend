import api from "@configs/api";
import GroupInterface from "@interfaces/Groups";
import Response from "@interfaces/Response";

interface NewGroupForm {
  name: string,
  description: string,
}

interface NewGroupResponse extends Response {
  group?: GroupInterface;
}

async function attemptNewGroup(formInfo: NewGroupForm) {
    // fetch will serialize this to x-www-form-urlencoded (what server expects)
    const formBody = new URLSearchParams();
    const formKeys = Object.keys(formInfo) as Array<keyof NewGroupForm>;
    formKeys.forEach((field) => {
      formBody.append(field, formInfo[field])
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
      const newGroupResponse: NewGroupResponse = {
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
      };
    }
}

const groups = {
  attemptNewGroup,
};

export default groups;
