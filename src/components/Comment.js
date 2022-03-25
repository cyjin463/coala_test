import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { actionCreators as commentActions } from "../redux/modules/comment";
import RoundBtn from "../elements/RoundBtn";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Comment = ({ list }) => {
  const dispatch = useDispatch();
  const is_login = sessionStorage.getItem("isLogin");
  const pid = useParams().pid;
  const uid = sessionStorage.getItem("uid");
  const answerId = list.answerId;
  const [comment, setComment] = React.useState("");

  const addComment = () => {
    if (is_login) {
      dispatch(commentActions.addCommentDB(uid, pid, answerId, comment));
    } else {
      Swal.fire("", "로그인 후 사용할 수 있습니다:)", "error");
    }
  };

  const onChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <Container>
      <CommentInput>
        <CommentWrite onChange={onChange} />
        <RoundBtn onClick={addComment} title='등록' />
      </CommentInput>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const CommentInput = styled.div`
  flex: auto;
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  overflow: hidden;
`;

const CommentWrite = styled.textarea`
  flex: auto;
  height: 100%;
  padding: 14px;
  border-radius: 8px;
  background-color: #fbfbfd;
`;

export default Comment;
