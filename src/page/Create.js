import React from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useLocation, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as ArrowSvg } from "../svg/arrow_down_b.svg";
import { ReactComponent as ArrowActiveSvg } from "../svg/arrow_up_b.svg";
import { actionCreators as postActions } from "../redux/modules/post";
import { history } from "../redux/configureStore";
import { category } from "../elements/category";
import ImgUpload from "../components/ImgUpload";
import Chat from "../components/Chat";
import Banner from "../elements/Banner";

const Create = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams().pid;

  const isCreate = location.pathname === "/create";
  const img_list = useSelector((state) => state.post?.preview);
  const post_one = useSelector((state) => state.post.one_list);
  const [addPost, setAddPost] = React.useState(!isCreate ? post_one : []);
  const [isSelect, setIsSelect] = React.useState(false);
  const [oneCategory, setOneCategory] = React.useState("");
  const token = sessionStorage.getItem("token");
  const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (!isCreate) {
      dispatch(postActions.getOnePostDB(params));
      setAddPost(post_one);
      setOneCategory(addPost.category);
    }
  }, []);

  const onChange = (e) => {
    const id = e.target.id;
    const content = e.target.value;

    setAddPost({ ...addPost, [id]: content });
  };

  const submit = () => {
    if (!addPost.title || !addPost.comment) {
      Swal.fire("", "내용을 모두 입력해주세요 :)", "error");
      return;
    } else if (!oneCategory) {
      Swal.fire("", "카테고리를 선택해 주세요 :)", "error");
      return;
    } else if (addPost.tags) {
      const tags = addPost.tags?.split("#").splice(1);

      let text_tag = tags
        .map((v) => (reg.test(v) ? v.replace(reg, "") : v))
        .filter((v) => v !== "");

      dispatch(
        postActions.addPostDB({
          ...addPost,
          tags: text_tag,
          category: oneCategory,
        })
      );
    } else {
      dispatch(
        postActions.addPostDB({
          ...addPost,
          category: oneCategory,
        })
      );
    }
  };

  const revise = () => {
    if (typeof addPost.tags === "string") {
      const tags = addPost.tags?.split("#").splice(1);

      let text_tag = tags
        .map((v) => (reg.test(v) ? v.replace(reg, "") : v))
        .filter((v) => v !== "");

      dispatch(
        postActions.editPostDB({
          ...addPost,
          pid: params,
          tag: text_tag,
          category: oneCategory,
        })
      );
    } else {
      dispatch(
        postActions.editPostDB({
          ...addPost,
          pid: params,
          category: oneCategory,
        })
      );
    }
  };

  if (!isCreate) {
    return (
      <CreateWrap>
        <PostWrap>
          <h1>수정 페이지</h1>

          <h2>카테고리 선택</h2>
          <CategoryDiv length={category.length}>
            <span
              className={oneCategory === "" ? "" : "choose"}
              onClick={() => {
                setIsSelect(!isSelect);
              }}>
              {oneCategory
                ? oneCategory
                : addPost.category
                ? addPost.category
                : " 카테고리를 선택"}

              {isSelect ? <ArrowActiveSvg /> : <ArrowSvg />}
            </span>
            <ul className={isSelect ? "" : "close"}>
              {category.map((v, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setOneCategory(v.name);
                    setIsSelect(false);
                  }}>
                  {v.name}
                </li>
              ))}
            </ul>
          </CategoryDiv>

          <h2>제목</h2>
          <input
            id='postTitle'
            onChange={onChange}
            type='text'
            value={addPost.postTitle}
          />

          <h2>내용</h2>
          <TextareaImg>
            <textarea
              id='postComment'
              onChange={onChange}
              type='text'
              value={addPost.postComment}></textarea>
            <ImgUpload isEdit={true} editImg={addPost.postImg} />
          </TextareaImg>

          <h2>
            태그입력<em></em>
          </h2>
          <input
            id='tags'
            onChange={onChange}
            type='text'
            placeholder={`#${addPost.tag?.join(" #")}`}
          />
          <button onClick={revise}>수정 click</button>
          <button
            onClick={() => {
              history.replace(`/detail/${params}`);
            }}>
            취소
          </button>
        </PostWrap>
        <div className='right'>
          <div>
            <Chat />
            <Banner />
          </div>
        </div>
      </CreateWrap>
    );
  }

  return (
    <CreateWrap>
      <PostWrap>
        <h1>글쓰기 페이지</h1>

        <h2>카테고리 선택</h2>
        <CategoryDiv length={category.length}>
          <span
            className={oneCategory === "" ? "" : "choose"}
            onClick={() => {
              setIsSelect(!isSelect);
            }}>
            {oneCategory === "" ? " 카테고리를 선택" : oneCategory}
            {isSelect ? <ArrowActiveSvg /> : <ArrowSvg />}
          </span>
          <ul className={isSelect ? "" : "close"}>
            {category.map((v, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setOneCategory(v.name);
                  setIsSelect(false);
                }}>
                {v.name}
              </li>
            ))}
          </ul>
        </CategoryDiv>
        <h2>제목</h2>
        <input id='title' onChange={onChange} type='text' placeholder='제목' />

        <h2>내용</h2>
        <TextareaImg>
          <textarea
            id='comment'
            onChange={onChange}
            type='text'
            placeholder='내용'></textarea>
          <ImgUpload />
        </TextareaImg>

        <h2>
          태그입력<em>(선택사항)</em>
        </h2>
        <input
          id='tags'
          onChange={onChange}
          type='text'
          placeholder='특수문자는 # 만 입력 가능합니다.'
        />
        <button onClick={submit}>올리기</button>
      </PostWrap>

      <div className='right'>
        <div>
          <Chat />
          <Banner />
        </div>
      </div>
    </CreateWrap>
  );
};
const CreateWrap = styled.div`
  display: flex;
  width: 1440px;
  margin: 0 auto;
  margin-bottom: 24px;
  gap: 24px;

  .right {
    flex: none;
    width: 342px;

    > div {
      position: sticky;
      top: 0;
    }
  }
`;

const PostWrap = styled.div`
  width: 100%;
  padding: 50px 26px;
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 rgba(228, 226, 242, 0.45);

  h1 {
    display: none;
  }

  h2 {
    font-size: 16px;
    margin-bottom: 8px;

    em {
      font-weight: normal;
      font-style: normal;
      margin-left: 4px;
      color: #797979;
      font-size: 12px;
    }
  }

  label > input#file-upload-button {
    display: none;
  }

  input {
    display: block;
    width: 100%;
    height: 52px;
    padding: 16px;
    margin-bottom: 24px;
    border: none;
    border-radius: 8px;
    background-color: #fbfbfd;

    &::placeholder {
      color: #797979;
    }
  }

  button {
    display: block;
    width: 200px;
    line-height: 50px;
    margin-top: 48px;
    margin-left: auto;
    background-color: #7966ff;
    border-radius: 8px;
    font-size: 16px;
    color: #fff;
  }
`;

const TextareaImg = styled.div`
  margin-bottom: 40px;
  border-radius: 8px;
  background-color: #fbfbfd;

  textarea {
    display: block;
    width: 100%;
    padding: 16px;
    min-height: 400px;
    border: none;
    background-color: transparent;
    resize: none;

    &::placeholder {
      color: #797979;
    }
  }

  .img_load {
    border-radius: 8px;
    border-bottom: none;
    background-color: #f4f4fb;
  }
`;

const CategoryDiv = styled.div`
  display: inline-block;
  width: 300px;
  margin-bottom: 24px;
  position: relative;

  > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 52px;
    line-height: 52px;
    padding: 0 16px;
    line-height: 46px;
    color: #797979;
    border-radius: 8px;
    background-color: #fbfbfd;

    &.choose {
      color: #7966ff;
    }
  }

  ul {
    position: absolute;
    top: calc(46px + 8px);
    left: 0;
    width: 100%;
    height: ${(props) => `calc(${props.length} * 46px + 20px)`};
    overflow: hidden;
    margin: 0;
    transition: height 0.5s ease-out;
    background-color: #fff;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 14px 0 rgba(65, 0, 131, 0.06);

    &.close {
      height: 0;
      padding: 0;
    }
  }

  li {
    margin: 0 10px;
    text-align: center;
    line-height: 46px;
    cursor: pointer;

    &:nth-child(1) {
      margin-top: 10px;
    }

    &:last-child {
      margin-bottom: 10px;
    }
    &:hover {
      background-color: #7966ff;
      color: #fff;
    }
  }
`;

export default Create;
