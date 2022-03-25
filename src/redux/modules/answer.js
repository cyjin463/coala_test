import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import axios from "axios";
import { apis } from "../../shared/api";
import { apiUrl } from "../../elements/testApiUrl";

const GET_ANSWER = "GET_ANSWER";
const ADD_ANSWER = "ADD_ANSWER";
const EDIT_ANSWER = "EDIT_ANSWER";
const DEL_ANSWER = "DEL_ANSWER";
const LIKE_ANSWER = "LIKE_ANSWER";
const AS_IMG_POST = "AS_IMG_POST";

const getAnswer = createAction(GET_ANSWER, (list) => ({ list }));
const addAnswer = createAction(ADD_ANSWER, (list) => ({ list }));
const editAnswer = createAction(EDIT_ANSWER, (list) => ({ list }));
const likeAnswer = createAction(LIKE_ANSWER, (list) => ({ list }));
const delAnswer = createAction(DEL_ANSWER, (list) => ({ list }));
const asImgPost = createAction(AS_IMG_POST, (asPreview) => ({ asPreview }));

const initialState = {
  list: [],
  editList: [],
  asPreview: "",
  status: false,
};

const getAnswerDB = (pid) => {
  return function (dispatch, getState, { history }) {
    apis
      .getanswer(pid)
      .then((res) => {
        dispatch(getAnswer(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const addAnswerDB = ({ pid, uid, answerTitle, answerComment }) => {
  return function (dispatch, getState, { history }) {
    const token_res = sessionStorage.getItem("token");
    const img_list = getState().answer.asPreview;
    const formData = new FormData();
    formData.append("images", img_list);

    if (!img_list) {
      axios({
        method: "post",
        url: `${apiUrl}/islogin/answer/${pid}`,
        data: {
          pid: pid,
          uid: uid,
          answerTitle: answerTitle,
          answerComment: answerComment,
          answerImg: null,
        },
        headers: { Authorization: token_res },
      }).then((res) => {
        dispatch(
          addAnswer({
            pid,
            uid,
            answerTitle: answerTitle,
            answerComment: answerComment,
            answerImg: null,
            answerId: res.data,
            answerLike: false,
            blogUrl: null,
            career: null,
            commnetResponseDtoList: [],
            createdAt: "",
            nickname: "",
            userImage: null,
          })
        );
      });
    } else {
      axios
        .post(`${apiUrl}/images/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token_res}`,
          },
        })
        .then((res) => {
          console.log("img업로드 성공");
          const imgUrl = res.data.url;
          return imgUrl;
        })
        .then((imgUrl) => {
          console.log("img업로드 성공");
          axios({
            method: "post",
            url: `${apiUrl}/islogin/answer/${pid}`,
            data: {
              pid: pid,
              uid: uid,
              answerTitle: answerTitle,
              answerComment: answerComment,
              answerImg: imgUrl,
            },
            headers: { Authorization: token_res },
          }).then((res) => {
            dispatch(
              addAnswer({
                pid,
                uid,
                answerTitle: answerTitle,
                answerComment: answerComment,
                answerImg: imgUrl,
                answerId: res.data,
                answerLike: false,
                blogUrl: null,
                career: null,
                commnetResponseDtoList: [],
                createdAt: "",
                nickname: "",
                userImage: null,
              })
            );
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};

const editAnswerDB = (props) => {
  return function (dispatch, getState, { history }) {
    const {
      uid,
      pid,
      answerId,
      answerUid,
      userImage,
      answerComment,
      answerImg,
      answerTitle,
      blogUrl,
      nickname,
      createdAt,
      career,
      commnetResponseDtoList,
    } = props;

    const token_res = sessionStorage.getItem("token");
    const img_list = getState().answer.asPreview;
    const formData = new FormData();
    formData.append("images", img_list);

    if (!img_list) {
      axios({
        method: "put",
        url: `${apiUrl}/islogin/answer/revice/${answerId}`,
        data: {
          answerTitle: answerTitle,
          answerComment: answerComment,
          answerImg: answerImg,
        },
        headers: { Authorization: token_res },
      }).then((res) => {
        const list = {
          uid,
          pid,
          answerId,
          answerUid,
          userImage,
          answerComment,
          answerImg,
          answerTitle,
          blogUrl,
          nickname,
          createdAt,
          career,
          commnetResponseDtoList,
        };
        const _answer_list = getState().answer.list;
        const answer_list = _answer_list.map((v) =>
          v.answerId === answerId ? list : v
        );

        dispatch(editAnswer(answer_list));
        // window.location.replace(`/detail/${pid}`);
      });
    } else {
      axios
        .post(`${apiUrl}/images/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token_res}`,
          },
        })
        .then((res) => {
          const imgUrl = res.data.url;
          return imgUrl;
        })
        .then((imgUrl) => {
          console.log("img업로드 성공");
          console.log(imgUrl);
          axios({
            method: "put",
            url: `${apiUrl}/islogin/answer/revice/${answerId}`,
            data: {
              answerTitle: answerTitle,
              answerComment: answerComment,
              answerImg: imgUrl,
            },
            headers: { Authorization: token_res },
          }).then((res) => {
            const list = {
              uid,
              pid,
              answerId,
              answerUid,
              userImage,
              answerComment,
              answerImg: imgUrl,
              answerTitle,
              blogUrl,
              nickname,
              createdAt,
              career,
              commnetResponseDtoList,
            };
            const _answer_list = getState().answer.list;
            const answer_list = _answer_list.map((v) =>
              v.answerId === answerId ? list : v
            );

            dispatch(editAnswer(answer_list));
            // window.location.replace(`/detail/${pid}`);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};

const delAnswerDB = (answsrId) => {
  return function (dispatch, getState, { history }) {
    apis
      .delanswer(answsrId)
      .then(() => {
        const _answer_list = getState().answer.list;
        const answer_list = _answer_list.filter((v) => v.answerId !== answsrId);
        dispatch(delAnswer(answer_list));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const chooseAnswerDB = (props) => {
  return function (dispatch, getState) {
    console.log(props);

    const {
      uid,
      pid,
      answerId,
      answerUid,
      userImage,
      answerComment,
      answerImg,
      answerTitle,
      blogUrl,
      nickname,
      createdAt,
      career,
      commnetResponseDtoList,
      status,
    } = props;

    apis
      .chooseAnswer(uid, pid, answerId, answerUid)
      .then((res) => {
        const status = res.data.status;
        const list = {
          uid,
          pid,
          answerId,
          answerUid,
          userImage,
          answerComment,
          answerImg,
          answerTitle,
          blogUrl,
          nickname,
          createdAt,
          career,
          commnetResponseDtoList,
          status: status,
        };

        const _answer_list = getState().answer.list;
        const answer_list = _answer_list.map((v) =>
          v.answerId === answerId ? list : v
        );

        dispatch(likeAnswer(answer_list));
        // window.location.replace(`/detail/${pid}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export default handleActions(
  {
    [GET_ANSWER]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [ADD_ANSWER]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.list);
        draft.asPreview = "";
      }),
    [EDIT_ANSWER]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
        draft.asPreview = "";
      }),
    [DEL_ANSWER]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [LIKE_ANSWER]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [AS_IMG_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.asPreview = action.payload.asPreview;
      }),
  },
  initialState
);

const actionCreators = {
  getAnswerDB,
  addAnswerDB,
  editAnswerDB,
  delAnswerDB,
  chooseAnswerDB,
  asImgPost,
};

export { actionCreators };
