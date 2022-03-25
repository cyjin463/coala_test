import { createAction, handleActions } from "redux-actions";
import axios from "axios";
import { setToken } from "../../shared/token";
import produce from "immer";
import { apiUrl } from "../../elements/testApiUrl";
import { apis } from "../../shared/api";

const SERCH = "SERCH";
const CATEGORY = "CATEGORY";
const TAG = "TAG";

const serch = createAction(SERCH, (list) => ({ list }));
const categorySerch = createAction(CATEGORY, (list) => ({ list }));
const tagSearch = createAction(TAG, (list) => ({ list }));

const token = sessionStorage.getItem("token");

const initialState = {
  serch_list: [],
  category_list: [],
  tag_list: [],
};

const serchDB = (title, page) => {
  return async function (dispatch, getState, { history }) {
    console.log(title, page);
    await axios
      .get(
        `${apiUrl}/post/search/${title}?page=${page}&size=10&sortBy=createdAt&isAsc=false`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        dispatch(serch(res.data));
        return;
        if (res.data.length === 0) {
          console.log(res.data);
          const beforePage = page - 1;
          console.log(beforePage);
          axios
            .get(
              `${apiUrl}/post/search/${title}?page=${beforePage}&size=10&sortBy=createdAt&isAsc=false`,
              {
                headers: {
                  Authorization: token,
                },
              }
            )
            .then((res) => {
              console.log(res);
              dispatch(serch(res.data));
            });
        } else {
          console.log(res);
          dispatch(serch(res.data));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const categoryDB = (category, page) => {
  return function (dispatch, getState, { history }) {
    axios
      .get(
        `${apiUrl}/category/search/${category}?page=${page}&size=10&sortBy=createdAt&isAsc=false`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(page);
        console.log(res.data);

        dispatch(categorySerch(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const tagDB = (tag, page) => {
  return function (dispatch, getState, { history }) {
    axios
      .get(
        `${apiUrl}/tag/search/${tag}?page=${page}&size=10&sortBy=createdAt&isAsc=false`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        dispatch(tagSearch(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export default handleActions(
  {
    [SERCH]: (state, action) =>
      produce(state, (draft) => {
        // draft.serch_list = action.payload.list;
        draft.serch_list.push(...action.payload.list);
        draft.serch_list = draft.serch_list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.pid === cur.pid) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.pid === cur.pid)] = cur;
            return acc;
          }
        }, []);
      }),
    [CATEGORY]: (state, action) =>
      produce(state, (draft) => {
        draft.category_list.push(...action.payload.list);
        draft.category_list = draft.category_list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.pid === cur.pid) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.pid === cur.pid)] = cur;
            return acc;
          }
        }, []);
      }),
    [TAG]: (state, action) =>
      produce(state, (draft) => {
        draft.tag_list.push(...action.payload.list);
        draft.tag_list = draft.tag_list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.pid === cur.pid) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.pid === cur.pid)] = cur;
            return acc;
          }
        }, []);
      }),
  },
  initialState
);

const actionsCreators = {
  serchDB,
  serch,
  categoryDB,
  categorySerch,
  tagDB,
};

export { actionsCreators };
