import React from "react";
import styled from "styled-components";

import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import ImgUpload from "./ImgUpload";

import { actionCreators as answerActions } from "../redux/modules/answer";
import RoundBtn from "../elements/RoundBtn";

const Answer = ({ close = null, isEdit = null, list = null }) => {
  const dispatch = useDispatch();
  const params = useParams().pid;
  const user_info = sessionStorage.getItem("uid");
  const nickname = sessionStorage.getItem("nickname");
  const [addAnswer, setAddAnswer] = React.useState(
    isEdit ? list : { answerTitle: "", answerComment: "" }
  );
  const { answerTitle, answerComment } = addAnswer;

  const onChange = (e) => {
    const id = e.target.id;
    const content = e.target.value;

    setAddAnswer({ ...addAnswer, [id]: content });
  };

  const answerSubmit = () => {
    dispatch(
      answerActions.addAnswerDB({ pid: params, uid: user_info, ...addAnswer })
    );
    setAddAnswer({ answerTitle: "", answerComment: "" });
  };

  const editAnswer = () => {
    dispatch(
      answerActions.editAnswerDB({
        ...addAnswer,
      })
    );
    close(list.pid);
  };

  if (isEdit) {
    return (
      <SC_Answer>
        <SC_InputWrap>
          <h5>답변 수정하기</h5>
          <input
            id='answerTitle'
            onChange={onChange}
            type='text'
            value={answerTitle}
          />
          <textarea
            id='answerComment'
            onChange={onChange}
            type='text'
            value={answerComment}></textarea>
        </SC_InputWrap>
        <ImgUpload isEdit={isEdit} editImg={list.answerImg} />
        <RoundBtn onClick={editAnswer} title='수정' />
      </SC_Answer>
    );
  }

  return (
    <SC_Answer>
      <h5>답변 작성하기</h5>
      <SC_InputWrap>
        <input
          id='answerTitle'
          value={answerTitle}
          onChange={onChange}
          type='text'
          placeholder='답변 제목 입력 해주세요'
        />
        <textarea
          id='answerComment'
          value={answerComment}
          onChange={onChange}
          type='text'
          placeholder='답변을 입력 해주세요'></textarea>
      </SC_InputWrap>
      <ImgUpload cleanImg={addAnswer.answerTitle} />
      <RoundBtn onClick={answerSubmit} title='등록' />
    </SC_Answer>
  );
};

const SC_InputWrap = styled.div`
  input {
    display: block;
    width: 100%;
    padding: 18px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }

  textarea {
    width: 100%;
    height: 130px;
    padding: 18px 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
`;

const SC_Answer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  padding: 0 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 rgba(228, 226, 242, 0.45);

  h5 {
    font-size: 20px;
    font-weight: 700;
    padding-top: 30px;
    padding-bottom: 16px;
  }

  button {
    margin: 16px 0;
    margin-left: auto;
  }
`;
export default Answer;
