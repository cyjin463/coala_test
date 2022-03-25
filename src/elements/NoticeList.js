import React from "react";
import styled from "styled-components";
import Profile from "./Profile";
import { history } from "../redux/configureStore";

const NoticeList = ({ list, lastEl, viewRef }) => {
  const date = list.createdAt?.split("T")[0];

  return (
    <NoticeListDiv
      className={lastEl ? "last" : ""}
      ref={lastEl ? viewRef : null}
      onClick={() => {
        history.push(`/detail/${list.pid}`);
      }}>
      {list.category && <div className='category'>{list.category}</div>}
      <div className='title'>
        <h3>{list.postTitle}</h3>
        {list.status === "selection" && <em>답변완료</em>}
      </div>
      <div className='content'>
        <div>{list.postComment}</div>
      </div>
      <div className='info'>
        <TagUl>
          {list.tag?.map((v, idx) => (
            <li key={idx}>#{v} </li>
          ))}
        </TagUl>
        <span>
          <Profile imgUrl={list.userImage} size='24' />
          {list.nickname}
        </span>
        <em>{date}</em>
        <i>관심 {list.postLikeCount}</i>
      </div>
    </NoticeListDiv>
  );
};

const NoticeListDiv = styled.div`
  padding: 22px 0 26px;
  border-bottom: solid 1px #dadada;
  margin: 0 24px;

  .category {
    display: inline-block;
    padding: 8px 14px;
    margin-bottom: 14px;
    text-align: center;
    border-radius: 30px;
    color: #5e45f2;
    font-size: 12px;
    border: solid 1px #5e45f2;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;

    em {
      flex: none;
      display: inline-block;
      padding: 4px 6px;
      color: #5e45f2;
      border-radius: 2px;
      background-color: #f0ecfd;
      font-style: normal;
    }
  }

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .content {
    align-items: flex-start;
    height: 56px;
    margin-bottom: 28px;

    > div {
      display: -webkit-box;
      word-wrap: break-word;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .info {
    display: flex;
    align-items: center;
    text-align: right;
    color: #333;

    span {
      margin-left: auto;
      display: inline-flex;
      align-items: center;

      span {
        margin-right: 6px;
      }
    }

    em {
      padding: 0 18px;
      margin: 0 18px;
      font-style: normal;
      border: solid 1px #333;
      border-top: none;
      border-bottom: none;
    }
  }

  i {
    font-style: normal;
  }
`;

const TagUl = styled.div`
  display: inline-flex;

  li {
    color: #797979;
    font-size: 12px;
    margin-right: 10px;
  }
`;
export default NoticeList;
