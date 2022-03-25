import React from "react";
import styled from "styled-components";
import { actionCreators as mypageActions } from "../redux/modules/mypage";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../redux/configureStore";
import { TableListUl } from "../components/TableList";

const Scrap = () => {
  const dispatch = useDispatch();
  const scrap_list = useSelector((state) => state.mypage.list);

  React.useEffect(() => {
    dispatch(mypageActions.myLikePostDB(1));
  }, []);

  return (
    <ScrapDiv>
      <h2>스크랩</h2>
      <TableListUl>
        {scrap_list.length === 0 && (
          <li className='no_list'>
            <strong>스크랩된 게시글이 없습니다 :)</strong>
          </li>
        )}
        {scrap_list.map((v, idx) => {
          const date = v.createdAt?.split(".")[0].replace("T", " ");

          return (
            <li key={v.pid}>
              <div
                onClick={() => {
                  history.push(`detail/${v.pid}`);
                }}>
                <p>"{v.postTitle}"</p>
                {v.type === "AnswerCreate" && (
                  <span>누군가 내 게시글에 답글을 남겼습니다.</span>
                )}
                {v.type === "AnswerChoose" && (
                  <span>답변이 채택되었습니다.</span>
                )}
                <em>{date}</em>
              </div>
              <button
                onClick={() => {
                  //   dispatch(myActions.myAlarmsDelDB(v.alarmId));
                }}>
                삭제
              </button>
            </li>
          );
        })}
      </TableListUl>
    </ScrapDiv>
  );
};
const ScrapDiv = styled.div`
  width: 1440px;
  min-height: calc(100vh - 100px - 150px);
  margin: 0 auto;
`;
export default Scrap;
