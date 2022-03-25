import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import axios from "axios";
import { apis } from "../../shared/api";
import { apiUrl } from "../../elements/testApiUrl";

const GET_POST = "GET_POST";
const GET_ONE_POST = "GET_ONE_POST";
const GET_POSTCHK = "GET_POSTCHK";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DEL_POST = "DEL_POST";
const IMG_POST = "IMG_POST";
const LOADING = "LOADING";

const getPost = createAction(GET_POST, (post) => ({ post }));
const getPostNoChk = createAction(GET_POSTCHK, (post) => ({ post }));
const getOnePost = createAction(GET_ONE_POST, (post) => ({ post }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post) => ({ post }));
const delPost = createAction(DEL_POST, (pid) => ({ pid }));
const imgPost = createAction(IMG_POST, (preview) => ({ preview }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: [],
  one_list: [],
  nockeckList: [],
  preview: "",
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};

// ===================================================================
// ======================== 게시글 리스트 가지고오기========================

const getPostDB = (page) => {
  return function (dispatch, getState, { history }) {
    apis
      .getpost(page)
      .then((res) => {
        const query = res.data;
        dispatch(getPost(query));
      })
      .catch((err) => {
        console.log("error get post");
      });
  };
};

const getPostNocheckDB = (page) => {
  return function (dispatch, getState, { history }) {
    console.log(page);
    apis
      .getpostnocheck(page)
      .then((res) => {
        const query = res.data;
        dispatch(getPostNoChk(query));
      })
      .catch((err) => {
        console.log("error get post");
      });
  };
};

// ====================================================================
// ======================== 선택한 게시글 가지고오기 ========================
const getOnePostDB = (pid) => {
  return function (dispatch, getState, { history }) {
    apis
      .onepost(pid)
      .then((res) => {
        dispatch(getOnePost(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// =====================================================================
// ================================ 추가 ================================
const addPostDB = (props) => {
  return function (dispatch, getState, { history }) {
    const { title, comment, tags, category } = props;
    const token_res = sessionStorage.getItem("token");
    const img_list = getState().post.preview;
    const formData = new FormData();
    formData.append("images", img_list);

    if (!img_list) {
      axios({
        method: "post",
        url: `${apiUrl}/islogin/post/write`,
        data: {
          postTitle: title,
          postComment: comment,
          postImg: null,
          tags: tags ? tags : null,
          category: category,
        },
        headers: { Authorization: `${token_res}` },
      }).then((res) => {
        dispatch(
          addPost({
            title,
            comment,
            imgUrl: null,
            tags: tags ? tags : null,
            pid: res.data,
          })
        );
        history.replace("/");
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
          axios({
            method: "post",
            url: `${apiUrl}/islogin/post/write`,
            data: {
              postTitle: title,
              postComment: comment,
              postImg: imgUrl,
              tags: tags ? tags : null,

              category: category,
            },
            headers: { Authorization: `${token_res}` },
          }).then((res) => {
            dispatch(
              addPost({
                title,
                comment,
                imgUrl,
                tags: tags ? tags : null,
                pid: res.data,
              })
            );
            history.replace("/");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};

// =====================================================================
// ================================ 수정 ================================
const editPostDB = (props) => {
  return function (dispatch, getState, { history }) {
    const { category, pid, postComment, postImg, postTitle, tag } = props;
    const token_res = sessionStorage.getItem("token");
    const img_list = getState().post.preview;
    const formData = new FormData();
    formData.append("images", img_list);

    if (!img_list) {
      axios({
        method: "PUT",
        url: `${apiUrl}/islogin/post/revice/${pid}`,
        data: {
          pid: pid,
          postTitle: postTitle,
          postComment: postComment,
          postImg: postImg,
          tags: tag,
          category: category,
        },
        headers: { Authorization: `${token_res}` },
      }).then(() => {
        dispatch(editPost({ postTitle, postComment, tag, category, pid }));
        history.replace(`/detail/${pid}`);
        window.scrollTo(0, 0);
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
          axios({
            method: "PUT",
            url: `${apiUrl}/islogin/post/revice/${pid}`,
            data: {
              pid: pid,
              postTitle: postTitle,
              postComment: postComment,
              postImg: imgUrl,
              tags: tag,
              category: category,
            },
            headers: { Authorization: `${token_res}` },
          }).then(() => {
            dispatch(editPost({ postTitle, postComment, tag, category, pid }));
            history.replace(`/detail/${pid}`);
            window.scrollTo(0, 0);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};

// =====================================================================
// ================================ 삭제 ================================
const delPostDB = (pid) => {
  return function (dispatch, getState, { history }) {
    apis
      .delpost(pid)
      .then(() => {
        window.location.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const postLikeDB = (uid, pid) => {
  return function (dispatch, getState, { history }) {
    apis
      .likepost(uid, pid)
      .then((res) => {
        const post_list = getState().post.one_list;
        let like_count = "";
        if (res.data.postLike === "true") {
          like_count = post_list.postLikeCount + 1;
        } else {
          like_count = post_list.postLikeCount - 1;
        }

        dispatch(
          getOnePost({ ...post_list, post_list, postLikeCount: like_count })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
// =====================================================================
// ============================== reducer ==============================
export default handleActions(
  {
    [GET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post);
        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.pid === cur.pid) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.pid === cur.pid)] = cur;
            return acc;
          }
        }, []);
      }),
    [GET_POSTCHK]: (state, action) =>
      produce(state, (draft) => {
        draft.nockeckList.push(...action.payload.post);
        draft.nockeckList = draft.nockeckList.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.pid === cur.pid) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.pid === cur.pid)] = cur;
            return acc;
          }
        }, []);
      }),
    [GET_ONE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.one_list = action.payload.post;
      }),
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(action.payload.post);
        draft.preview = "";
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.one_list = action.payload.post;
        draft.preview = "";
      }),
    [DEL_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = draft.list;
      }),
    [IMG_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.preview = action.payload.preview;
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getPostDB,
  getOnePostDB,
  addPostDB,
  editPostDB,
  delPostDB,
  imgPost,
  getPostNocheckDB,
  postLikeDB,
};

export { actionCreators };
