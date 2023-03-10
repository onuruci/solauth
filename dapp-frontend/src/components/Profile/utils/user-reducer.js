export function userReducer(state, action) {
  console.log(action);
  switch (action.type) {
    case "load": {
      console.log("chload");
      return {
        ...state,
        name: action.nextUser.name,
        mail: action.nextUser.mail,
        phone: action.nextUser.phone,
      };
    }
    case "changed_name": {
      console.log("chnm");
      return {
        ...state,
        name: action.nextName,
      };
    }
    case "changed_mail": {
      console.log("chml");
      return {
        ...state,
        mail: action.nextMail,
      };
    }
    case "changed_phone": {
      console.log("chph");
      return {
        ...state,
        phone: action.nextPhone,
      };
    }
    case "changed_image": {
      console.log("chimg");
      return { ...state, profile_image: action.nextImage };
    }
  }
  throw Error("Unknown action: " + action.type);
}
