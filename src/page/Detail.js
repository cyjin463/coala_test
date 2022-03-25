import React from "react";
import styled from "styled-components";
import Comment from "../components/Comment";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as answerActions } from "../redux/modules/answer";
import { actionsCreators as searchActions } from "../redux/modules/serch";
import Swal from "sweetalert2";

import { history } from "../redux/configureStore";
import Answer from "../components/Answer";
import AnswerList from "../components/AnswerList";
import Profile from "../elements/Profile";
import user from "../redux/modules/user";
import Postchat from "../components/Postchat";
import Banner from "../elements/Banner";

const Detail = () => {
  const dispatch = useDispatch();
  const pid = useParams().pid;
  const post_one = useSelector((state) => state.post.one_list);
  const user_info = sessionStorage.getItem("uid");
  const delPost = () => {
    Swal.fire({
      title: "게시글을 삭제하시겠습니까?",
      text: "삭제된 게시물은 다시 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네 삭제하겠습니다.",
      confirmButtonColor: "#7966FF",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("", "게시글이 삭제 되었습니다.", "success");
        dispatch(postActions.delPostDB(pid));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("", "삭제가 취소 되었습니다 :)", "error");
      }
    });
  };

  const likebtn = () => {
    if (!user_info) {
      Swal.fire("", "로그인 후 이용해주세요", "error");
    } else {
      dispatch(postActions.postLikeDB(user_info, pid));
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(answerActions.getAnswerDB(pid));
    dispatch(postActions.getOnePostDB(pid));
  }, []);
  // const date = post_one.createdAt?.split(".")[0].split("T").join(" ");
  const date = post_one.createdAt?.split("T")[0];

  return (
    <Container>
      <div className='post_wrap'>
        <Question>
          <Top>
            <div className='header'>
              <h2>{post_one.postTitle}</h2>
              <span
                className='category'
                onClick={() => {
                  history.push(`/search/category_${post_one.category}`);
                }}>
                {post_one.category}
              </span>
            </div>
            <div className='post_info'>
              <dl className='user_info'>
                <dt>
                  <Profile size='24' migUrl={post_one.userImage} />
                </dt>
                <dd>{post_one.nickname}</dd>
              </dl>
              <em>{date}</em>
              <i>관심 {post_one.postLikeCount}</i>
            </div>
          </Top>
          <ContextWrap>
            <div className='text-wrap'>
              <p>{post_one.postComment}</p>
              {post_one.postImg && <img src={post_one.postImg} />}
            </div>

            <div className='btn_wrap'>
              <TagUl>
                {post_one.tag?.map((v, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      history.push(`/search/tag_${v}`);
                    }}>
                    #{v}
                  </li>
                ))}
              </TagUl>
              {Number(user_info) === post_one.uid ? (
                <>
                  <button styled={{ fontSize: "40px" }} onClick={delPost}>
                    삭제
                  </button>
                  <button
                    styled={{ fontSize: "40px" }}
                    onClick={() => {
                      history.push(`/edit/${pid}`);
                    }}>
                    수정
                  </button>
                </>
              ) : (
                <button onClick={likebtn}>관심 {post_one.postLikeCount}</button>
              )}
            </div>
          </ContextWrap>
        </Question>
        {user_info && <Answer />}
        <AnswerList isWriter={post_one.uid} />
      </div>
      <div className='right'>
        <div>
          <Postchat pid={pid} />
          <Banner />
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 22px;
  width: 1440px;
  margin: 0 auto;

  .post_wrap {
    width: calc(100% - 342px - 22px);
  }

  .right {
    flex: none;
    width: 342px;
    margin-bottom: 24px;

    > div {
      position: sticky;
      top: 0;
    }
  }
`;

const Question = styled.div`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px 0 rgba(228, 226, 242, 0.45);
`;

const Top = styled.div`
  padding: 30px 24px;
  border-bottom: solid 1px #dadada;

  h2 {
    font-size: 20px;
    word-break: break-all;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header {
    padding-bottom: 26px;

    span {
      cursor: pointer;
    }
  }

  .category {
    --cate-color: #797979;
    font-size: 12px;
    color: var(--cate-color);
    border: solid 1px var(--cate-color);
    margin-left: 10px;
    padding: 8px 12px;
    border-radius: 20px;
  }

  .post_info {
    --main-color: #c4c4c4;
    justify-content: flex-end;
    color: var(--main-color);
    font-weight: 700;

    span {
      vertical-align: middle;
    }

    em {
      padding: 0 16px;
      margin: 0 16px;
      font-style: normal;
      border-left: solid 1px var(--main-color);
      border-right: solid 1px var(--main-color);
    }
  }

  .user_info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const ContextWrap = styled.div`
  padding: 24px;

  .text-wrap {
    min-height: 250px;

    > *:not(style) {
      margin-bottom: 10px;
    }
  }

  p {
    word-break: break-all;
  }

  .btn_wrap {
    display: flex;
    align-items: center;

    ul {
      margin-right: auto;
    }

    button {
      padding: 10px 16px;
      color: #7966ff;
      font-size: 16px;
    }
  }
`;

const TagUl = styled.ul`
  --main-color: #797979;

  display: inline-flex;
  color: var(--main-color);
  font-size: 14px;

  li {
    padding: 6px 10px;
    margin-right: 10px;
    border-radius: 30px;
    border: solid 1px var(--main-color);
    cursor: pointer;
  }
`;

export default Detail;
