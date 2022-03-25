import { createAction, handleActions } from "redux-actions";
import produce from "immer";

import { apis } from "../../shared/api";
const TOTAL_RANKING = "TOTAL_RANKING";
const MONTH_RANKING = "MONTH_RANKING";
const WEEK_RANKING = "WEEK_RANKING";
const USER_LIST = "USER_LIST";

const initialState = {
  list: [],
  user_list: [],
};

const totalRanking = createAction(TOTAL_RANKING, (list) => ({ list }));
const monthRanking = createAction(MONTH_RANKING, (list) => ({ list }));
const weekRanking = createAction(WEEK_RANKING, (list) => ({ list }));
const userList = createAction(USER_LIST, (list) => ({ list }));
// const myweekRanking = createAction(WEEK_RANKING, (list) => ({ list }));
// const mymonthRanking = createAction(USER_LIST, (list) => ({ list }));
const totalRankingDB = () => {
  return function (dispatch, getState, { history }) {
    apis
      .totalRanking()
      .then((res) => {
        dispatch(totalRanking(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
const monthRankingDB = () => {
  return function (dispatch, getState, { history }) {
    apis
      .totalRanking()
      .then((res) => {
        dispatch(monthRanking(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
const weekRankingDB = () => {
  return function (dispatch, getState, { history }) {
    apis
      .totalRanking()
      .then((res) => {
        dispatch(weekRanking(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const myTotalRankingDB = () => {
  return function (dispatch, getState, { history }) {
    apis
      .mytotalRanking()
      .then((res) => {
        dispatch(userList(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
const myMonthRankingDB = () => {
  return function (dispatch, getState, { history }) {
    apis
      .mymonthRanking()
      .then((res) => {
        dispatch(userList(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const myWeekRankingDB = () => {
  return function (dispatch, getState, { history }) {
    apis
      .myweekRanking()
      .then((res) => {
        dispatch(userList(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export default handleActions(
  {
    [TOTAL_RANKING]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [MONTH_RANKING]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [WEEK_RANKING]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [USER_LIST]: (state, action) =>
      produce(state, (draft) => {
        draft.user_list = action.payload.list;
      }),
  },
  initialState
);

const actionCreators = {
  totalRankingDB,
  monthRankingDB,
  weekRankingDB,
  myTotalRankingDB,
  myMonthRankingDB,
  myWeekRankingDB,
};

export { actionCreators };
