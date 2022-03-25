import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import history from "../configureStore";
import axios from "axios";
import Swal from "sweetalert2";

import { setToken, delToken } from "../../shared/token";
import { apiUrl } from "../../elements/testApiUrl";

//initialState
const initialState = {
  userinfo: {
    uid: "",
    username: "",
    nickname: "",
    career: "",
    userImage: "",
  },
  isLogin: false,
  isCheckUsername: false,
  isCheckNickname: false,
  preview: "",
};

//action
const CHECK_USERNAME = "CHECK_USERNAME";
const CHECK_NICKNAME = "CHECK_NICKNAME";
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const USER_EDUT = "USER_EDUT";
const IMG_POST = "IMG_POST";

//action creators
const setCheckUsername = createAction(CHECK_USERNAME, (isCheckUsername) => ({
  isCheckUsername,
}));
const setCheckNickname = createAction(CHECK_NICKNAME, (isCheckNickname) => ({
  isCheckNickname,
}));
const logIn = createAction(LOG_IN, (user) => ({ user }));
const logOut = createAction(LOG_OUT, () => ({}));
const logEdit = createAction(USER_EDUT, (user) => ({ user }));
const imgPost = createAction(IMG_POST, (preview) => ({ preview }));

// //token
const token = sessionStorage.getItem("token");

//middleware actions
const checkUsernameDB = (username, isCheckUsername) => {
  return async function (dispatch, getState, { history }) {
    console.log(username, isCheckUsername);
    await axios
      .post(`${apiUrl}/user/signup/username`, { username: username })
      .then((res) => {
        if (res.data === true) {
          Swal.fire("", "이미 존재하는 ID입니다.", "error");
          return;
        }
        dispatch(setCheckUsername(!isCheckUsername));
        console.log("리듀서로");
      });
  };
};

const checkNicknameDB = (userNickname, isCheckNickname) => {
  return async function (dispatch, getState, { history }) {
    console.log(userNickname, isCheckNickname);
    await axios
      .post(`${apiUrl}/user/signup/nickname`, {
        nickname: userNickname,
      })
      .then((res) => {
        if (res.data === true) {
          Swal.fire("", "이미 존재하는 닉네임입ㄴ디ㅏ.", "error");
          return;
        }
        console.log(res);
        dispatch(setCheckNickname(!isCheckNickname));
      });
  };
};

const signupDB = (username, nickname, password, passwordCheck, career) => {
  return function (dispatch, getState, { history }) {
    console.log(username, nickname, password, passwordCheck, career);
    axios
      .post(`${apiUrl}/user/signup`, {
        username: username,
        nickname: nickname,
        password: password,
        passwordCheck: passwordCheck,
        career: career,
      })
      .then((res) => {
        Swal.fire("", "회원가입을 축하드립니다.", "success");
        window.location.reload();
      })
      .catch((err) => {
        console.log("회원가입 실패", err);
        Swal.fire("", "회원가입에 실패했어요.", "error");
      });
  };
};

const loginDB = (username, password) => {
  return function (dispatch, getState, { history }) {
    console.log(username, password);
    axios
      .post(`${apiUrl}/user/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res);
        const token_res = res.headers.authorization;
        setToken(token_res);
        return token_res;
      })
      .then((token_res) => {
        console.log(token_res);
        axios({
          method: "post",
          url: `${apiUrl}/islogin/user`,
          headers: {
            Authorization: `${token_res}`,
          },
        })
          .then((res) => {
            console.log(res);
            sessionStorage.setItem("uid", res.data.uid);
            sessionStorage.setItem("username", res.data.username);
            sessionStorage.setItem("nickname", res.data.nickname);
            sessionStorage.setItem("career", res.data.career);
            sessionStorage.setItem("userImage", res.data.userImage);
            sessionStorage.setItem("url", res.data.blogUrl);
            sessionStorage.setItem("isLogin", true);
            console.log("1번");
            dispatch(
              logIn({
                uid: res.data.uid,
                username: res.data.username,
                nickname: res.data.nickname,
                career: res.data.career,
                userImage: res.data.userImage,
                url: res.data.blogUrl,
              })
            );
            history.push("/");
            window.location.reload();
          })
          .catch((err) => {
            console.log("로그인 확인 실패", err);
          });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("", "이메일이나 패스워드를 다시 확인해주세요.", "error");
      });
  };
};

const logEditDB = (uid, nickname, career, url, userImg) => {
  return function (dispatch, getState, { history }) {
    console.log(uid, nickname, career, url);
    axios
      .put(
        `${apiUrl}/islogin/user/getinfo/${uid}`,
        {
          nickname: nickname,
          career: career,
          userImage: "",
          blogUrl: url,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        dispatch(
          logEdit({
            nickname: nickname,
            career: career,
            userImage: userImg,
            blogUrl: url,
          })
        );
        sessionStorage.setItem("nickname", nickname);
        sessionStorage.setItem("career", career);
        sessionStorage.setItem("url", url);
        window.location.replace("/");
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("", "회원 정보 수정 실패", "error");
      });
  };
};

const logEditDB2 = (uid, nickname, career, url, userImg) => {
  return function (dispatch, getState, { history }) {
    const img_list = getState().user.preview;
    const Data = new FormData();
    Data.append("images", img_list);
    console.log(img_list);
    axios
      .post(`${apiUrl}/images/upload`, Data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      .then((res) => {
        console.log("img업로드 성공");
        const imgUrl = res.data.url;
        return imgUrl;
      })

      .then((imgUrl) => {
        axios
          .put(
            `${apiUrl}/islogin/user/getinfo/${uid}`,
            {
              nickname: nickname,
              career: career,
              userImage: imgUrl,
              blogUrl: url,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then((res) => {
            console.log(res);
            dispatch(
              logEdit({
                nickname: nickname,
                career: career,
                userImage: userImg,
                blogUrl: url,
              })
            );
            sessionStorage.setItem("nickname", nickname);
            sessionStorage.setItem("career", career);
            sessionStorage.setItem("userImage", userImg);
            sessionStorage.setItem("url", url);
            history.push("/");
            window.location.reload();
          });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("", "회원 정보 수정 실패", "error");
      });
  };
};

const NewPassWordDB = (uid, password, newPassword, newPasswordCheck) => {
  console.log("간다");
  return function (dispatch, getState, { history }) {
    axios
      .put(
        `${apiUrl}/islogin/user/password/${uid}`,
        {
          password: password,
          newPassword: newPassword,
          newPasswordCheck: newPasswordCheck,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.result !== true) {
          Swal.fire("", "비밀번호 수정 실패", "error");
          window.location.reload();
        } else {
          Swal.fire("", "비밀번호 수정 성공", "success");
          history.push("/");
          window.location.replace("/");
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("", "비밀번호 수정 실패", "error");
      });
  };
};

export default handleActions(
  {
    [CHECK_USERNAME]: (state, action) =>
      produce(state, (draft) => {
        console.log("CHECK_USERNAME 리듀서로 적용 완료", state, action.payload);
        draft.isCheckUsername = action.payload.isCheckUsername;
        Swal.fire("", "해당 이메일은 사용 가능합니다.", "success");
      }),
    [CHECK_NICKNAME]: (state, action) =>
      produce(state, (draft) => {
        console.log("CHECK_NICKNAME 리듀서 적용", state, action.payload);
        draft.isCheckNickname = action.payload.isCheckNickname;
        Swal.fire("", "사용 가능한 닉네임입니다.", "success");
      }),
    [LOG_IN]: (state, action) =>
      produce(state, (draft) => {
        draft.userinfo = action.payload.user;
        draft.isLogin = true;
      }),
    [USER_EDUT]: (state, action) =>
      produce(state, (draft) => {
        draft.userinfo = action.payload.user;
      }),
    [IMG_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.preview = action.payload.preview;
      }),
  },
  initialState
);

const actionCreators = {
  signupDB,
  checkUsernameDB,
  checkNicknameDB,
  loginDB,
  logOut,
  logEditDB,
  logEditDB2,
  NewPassWordDB,
  imgPost,
};

export { actionCreators };
