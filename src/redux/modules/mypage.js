import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { apis } from "../../shared/api";

const MY_ALAMS = "MY_ALAMS";
const MY_ALAMS_DEL = "MY_ALAMS_DEL";
const MY_LIKE_POST = "MY_LIKE_POST";

const myAlarms = createAction(MY_ALAMS, (list) => ({ list }));
const myAlarmsDel = createAction(MY_ALAMS_DEL, (list) => ({ list }));
const myMyLikePost = createAction(MY_LIKE_POST, (list) => ({ list }));

const initialState = {
  list: [],
};

const myAlarmsDB = () => {
  return function (dispatch, getState, { history }) {
    apis.myalarm().then((res) => {
      dispatch(myAlarms(res.data));
    });
  };
};

const myAlarmsDelDB = (alarmId) => {
  return function (dispatch, getState, { history }) {
    apis.myalarmdel(alarmId).then(() => {
      const _aram_list = getState().mypage.list;
      const aram_list = _aram_list.filter((v) => v.alarmId !== alarmId);
      dispatch(myAlarmsDel(aram_list));
    });
  };
};

const myLikePostDB = (page) => {
  return function (dispatch, getState, { history }) {
    console.log(page);
    apis
      .mylikepost(page)
      .then((res) => {
        dispatch(myAlarms(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export default handleActions(
  {
    [MY_ALAMS]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [MY_ALAMS_DEL]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [MY_LIKE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
  },
  initialState
);

const actionCreators = {
  myAlarmsDB,
  myAlarmsDelDB,
  myLikePostDB,
};

export { actionCreators };
