import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as myActions } from "../redux/modules/mypage";
import styled from "styled-components";
import { history } from "../redux/configureStore";

const TableList = ({ currTab }) => {
  const dispatch = useDispatch();
  const [list, setList] = React.useState();
  const aram_list = useSelector((state) => state.mypage.list);

  React.useEffect(() => {
    dispatch(myActions.myAlarmsDB());
    if (currTab === "total") {
      setList("토탈");
    } else if (currTab === "answer") {
      setList("답변");
    } else {
      setList("게시글");
    }
  }, [currTab]);

  const select_list = () => {
    switch (currTab) {
      case "total":
        return aram_list;
      case "answer":
        return aram_list.filter((v) => v.type === "AnswerCreate");
      case "choose":
        return aram_list.filter((v) => v.type === "AnswerChoose");
      default:
        return null;
    }
  };
  return (
    <TableListUl>
      {select_list().length === 0 && (
        <li className='no_list'>
          <strong>{list} 알림이 없습니다 :)</strong>
        </li>
      )}
      {select_list().map((v, idx) => {
        const date = v.createdAt?.split(".")[0].replace("T", " ");

        return (
          <li key={v.alarmId}>
            <div
              onClick={() => {
                history.push(`detail/${v.pid}`);
              }}>
              <p>"{v.postTitle}"</p>
              {v.type === "AnswerCreate" && (
                <span>누군가 내 게시글에 답글을 남겼습니다.</span>
              )}
              {v.type === "AnswerChoose" && <span>답변이 채택되었습니다.</span>}
              <em>{date}</em>
            </div>
            <button
              onClick={() => {
                dispatch(myActions.myAlarmsDelDB(v.alarmId));
              }}>
              삭제
            </button>
          </li>
        );
      })}
    </TableListUl>
  );
};

export const TableListUl = styled.ul`
  min-height: 600px;
  .no_list {
    line-height: 400px;
  }

  li {
    padding: 20px 64px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #676767;
    border-bottom: solid 1px #ebebeb;

    > div {
      display: flex;
      flex: auto;
    }
  }

  strong {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 30px;
  }

  p {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    flex: 1;
    text-align: left;
  }

  em {
    width: 20%;
    font-size: 12px;
    font-style: normal;
    color: #c4c4c4;
  }

  button {
    width: 94px;
    height: 30px;
    color: #fff;
    font-size: 16px;
    border-radius: 40px;
    background-color: #ddd;
  }
`;

export default TableList;
