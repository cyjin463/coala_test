import React from "react";
import styled from "styled-components";
import { useParams } from "react-router";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as answerActions } from "../redux/modules/answer";
import { actionCreators as commentActions } from "../redux/modules/comment";
import Comment from "./Comment";
import Answer from "./Answer";
import Profile from "../elements/Profile";
import Swal from "sweetalert2";
import RoundBtn from "../elements/RoundBtn";

const AnswerList = ({ isWriter }) => {
  const pid = useParams().pid;
  const dispatch = useDispatch();
  const list = useSelector((state) => state.answer.list);
  const user_info = sessionStorage.getItem("uid");
  const [isEdit, setIsEdit] = React.useState(null);
  const [isCommentEdit, setIsCommentEdit] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [commentView, setCommentView] = React.useState("");
  const [commentViewSelect, setCommentViewSelect] = React.useState(false);
  const [commentId, setCommentId] = React.useState(0);
  const isChoose = list?.find((v) => v.status === "true");

  React.useEffect(() => {
    if (list.length <= 1) {
      return;
    }
    dispatch(answerActions.getAnswerDB(pid));
  }, []);

  const chooseAnswer = (choose_list) => {
    if (!isChoose) {
      Swal.fire({
        title: "답변을 채택하시겠습니까?",
        text: "한번 채택한 답변은 취소 할 수 없습니다",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네 채택하겠습니다.",
        confirmButtonColor: "#7966FF",
        cancelButtonText: "아니오",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("", "답변이 채택 되었습니다.", "success");
          dispatch(
            answerActions.chooseAnswerDB({
              ...choose_list,
              answerUid: choose_list.uid,
            })
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("", "채택이 취소 되었습니다 :)", "error");
        }
      });
    } else {
      Swal.fire({
        title: "",
        text: "채택 된 답변이 존재합니다. :)",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#7966FF",
      });
    }
  };

  const deleAnswer = (answerId) => {
    Swal.fire({
      title: "답변을 삭제하시겠습니까?",
      text: "삭제 된 답변은 복구 할 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네 삭제하겠습니다.",
      confirmButtonColor: "#7966FF",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("", "답변이 삭제 되었습니다.", "success");
        dispatch(answerActions.delAnswerDB(answerId));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("", "취소 되었습니다 :)", "error");
      }
    });
  };

  const commentViewList = (pid) => {
    setCommentView(pid);
    if (commentView === "") {
      setCommentViewSelect(!commentViewSelect);
    } else if (commentView === pid) {
      setCommentViewSelect(!commentViewSelect);
    } else if (commentView !== pid) {
      setCommentViewSelect("true");
    }
  };

  const setCommentEdit = (commentId) => {
    setCommentId(commentId);
  };

  const commentChange = (e) => {
    setComment(e.target.value);
  };

  const commentEdit = (e) => {
    const commentEditId = e.target.value;
    Swal.fire({
      title: "댓글을 수정하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네",
      confirmButtonColor: "#7966FF",
      cancelButtonText: "아니오",
      Buttons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(commentActions.editCommentDB(commentEditId, comment, pid));
      } else {
        return;
      }
    });
  };

  const commentDelete = (e) => {
    Swal.fire({
      title: "댓글을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네",
      confirmButtonColor: "#7966FF",
      cancelButtonText: "아니오",
      Buttons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(commentActions.deleteCommentDB(e.target.value));
      } else {
        return;
      }
    });
  };

  return (
    <SC_List>
      {list.map((v, idx) => {
        const comment_count = Object.keys(v.commnetResponseDtoList).length;
        console.log(v);
        return (
          <React.Fragment key={idx}>
            <div>
              <div className='answer_wrap'>
                <div className='answer_box'>
                  <div className='header'>
                    <Profile size='48' imgUrl={v.userImage} />
                    <span>{v.nickname}</span>
                  </div>
                  <div className='content'>
                    <div>{v.answerTitle}</div>
                    <p>{v.answerComment}</p>
                    <div>
                      <img src={v.answerImg} />
                    </div>
                  </div>

                  <div className='btn_wrap'>
                    <span onClick={() => commentViewList(v.answerId)}>
                      댓글 {comment_count}
                    </span>
                    {/* 채택 하기 , 수적 삭제, 채택된 상태 */}
                    {v.status === "true" ? (
                      <button className='choose'>채택</button>
                    ) : Number(user_info) === Number(v.uid) ? (
                      <>
                        <button
                          onClick={() => {
                            deleAnswer(v.answerId);
                          }}>
                          삭제
                        </button>
                        <button
                          className='edit_btn'
                          onClick={() => {
                            setIsEdit(v.answerId);
                          }}>
                          수정
                        </button>
                      </>
                    ) : (
                      Number(user_info) === Number(isWriter) &&
                      Number(isWriter) !== Number(v.uid) && (
                        <RoundBtn
                          isLine
                          title='
                            채택
                            '
                          onClick={() => {
                            chooseAnswer(v);
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
                <div className='comment_box'>
                  <SC_Commentbox className='comment'>
                    <Comment list={v} />
                  </SC_Commentbox>
                </div>
              </div>

              <SC_CommentList className='comment_wrap'>
                {v.commnetResponseDtoList.map((list, idx) => {
                  return (
                    <div key={idx}>
                      {commentViewSelect && commentView === list.answerId && (
                        <>
                          {user_info == list.uid && (
                            <>
                              {isCommentEdit && list.commentId === commentId ? (
                                <div>
                                  <div className='mycomment'>
                                    <div>
                                      <Profile
                                        size={24}
                                        imgUrl={list.userImage}
                                      />
                                      <strong>{list.nickname}</strong>
                                    </div>
                                    <div className='button'>
                                      <button
                                        className='comment'
                                        onClick={commentEdit}
                                        value={list.commentId}>
                                        수정완료
                                      </button>
                                    </div>
                                  </div>
                                  <p>
                                    <textarea
                                      type='text'
                                      onChange={commentChange}>
                                      {list.comment}
                                    </textarea>
                                  </p>
                                  <p> {list.createdAt?.split("T")[0]}</p>
                                </div>
                              ) : (
                                <div>
                                  <div className='mycomment'>
                                    <div>
                                      <Profile
                                        size={24}
                                        imgUrl={list.userImage}
                                      />
                                      <strong>{list.nickname}</strong>
                                    </div>
                                    <div className='button'>
                                      <button
                                        className='comment'
                                        onClick={() => {
                                          setCommentEdit(list.commentId);
                                          setIsCommentEdit(!isCommentEdit);
                                        }}>
                                        수정
                                      </button>
                                      <button
                                        className='comment'
                                        onClick={commentDelete}
                                        value={list.commentId}>
                                        삭제
                                      </button>
                                    </div>
                                  </div>
                                  <p className='comment'>{list.comment}</p>
                                  <p> {list.createdAt?.split("T")[0]}</p>
                                </div>
                              )}
                            </>
                          )}
                          {list.uid != user_info && (
                            <div>
                              <div>
                                <div className='comment'>
                                  <Profile size={24} imgUrl={list.userImage} />
                                  <strong>{list.nickname}</strong>
                                </div>
                                <p className='comment'>{list.comment}</p>
                                <p> {list.createdAt?.split("T")[0]}</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </SC_CommentList>

              {isEdit === v.answerId && (
                <Answer close={setIsEdit} isEdit={true} list={v} />
              )}
            </div>
          </React.Fragment>
        );
      })}
    </SC_List>
  );
};

const SC_List = styled.div`
  .answer_wrap {
    padding: 24px;
    box-shadow: 0 4px 20px 0 rgba(228, 226, 242, 0.45);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  h2 {
    margin: 0;
  }

  .comment_box {
    border-radius: 8px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;

    button {
      margin-left: auto;
    }

    span {
      font-size: 18px;
    }
  }

  .content {
    padding: 24px 0;

    > div {
      font-size: 20px;
      font-weight: 700;
    }

    > *:not(style) {
      margin-bottom: 10px;
    }
  }

  .btn_wrap {
    display: flex;
    padding-bottom: 16px;

    span {
      margin-right: auto;
    }

    button {
      color: #7966ff;
      font-size: 16px;

      &.choose {
        width: 94px;
        height: 40px;
        background-color: #ffd703;
        color: #fff;
        border-radius: 40px;
        cursor: default;
      }
    }

    .edit_btn:before {
      content: "";
      margin: 0 12px;
      border-left: solid 1px #7966ff;
    }
  }
`;

const SC_Commentbox = styled.div`
  padding-top: 24px;
  border-top: solid 1px #dadada;
`;

const SC_CommentList = styled.div`
  --gray-color: #c4c4c4;

  > div {
    display: flex;
    padding: 18px 24px;
    border-bottom: solid 1px #dadada;
    color: var(--gray-color);
    flex-direction: column;
    justify-content: space-between;

    &:last-child {
      border-bottom: none;
    }
  }

  p {
    flex: auto;
    margin: 3px;

    > textarea {
      width: 1000px;
      height: 100px;
    }
  }

  p.comment {
    flex: auto;
    margin: 3px;
    height: 2rem;
    width: 100%;
    height: 100%;
    color: #797979;

    > textarea {
      width: 100%;
      height: 100%;
    }
  }

  strong {
    color: #333;
    font-weight: normal;
    margin-left: 8px;
  }

  em {
    font-style: normal;
    padding-left: 16px;
    margin-left: 16px;
    border-left: solid 1px var(--gray-color);
  }
  div.mycomment {
    display: flex;
    justify-content: space-between;
    > div {
      display: flex;
      align-items: center;
      line-height: 1rem;
    }
    > div.button {
      width: 60px;
      justify-content: space-between;
    }
  }
  div.comment {
    display: flex;
    align-items: center;
  }
  button {
    color: var(--gray-color);
    font-size: 1rem;
  }
`;

export default AnswerList;
