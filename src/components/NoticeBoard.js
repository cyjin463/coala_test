import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import Swal from "sweetalert2";
import styled from "styled-components";
import NoticeList from "../elements/NoticeList";
import TabMenu from "./TabMenu";
import Loader from "./Loader";

import { ReactComponent as WriteSvg } from "../svg/write.svg";
import { useInView } from "react-intersection-observer";
import { history } from "../redux/configureStore";

const NoticeBoard = () => {
  const tab_list = [
    {
      title: "nockeck",
      value: "답변대기",
    },
    {
      title: "check",
      value: "답변완료",
    },
  ];
  const dispatch = useDispatch();
  const user_info = sessionStorage.getItem("uid");
  const [TabList, setTabList] = React.useState(tab_list[0].title);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [pageNum, setPageNum] = React.useState(1);
  const [pageNum1, setPageNum1] = React.useState(1);
  const post_list = useSelector((state) => state.post.list);
  const post_nocheck = useSelector((state) => state.post.nockeckList);
  const postList = TabList === "check" ? post_list : post_nocheck;

  const [ref, inView] = useInView({
    threshold: 0.4,
  });

  React.useEffect(() => {
    if (TabList === "check") {
      dispatch(postActions.getPostDB(pageNum));
    } else {
      dispatch(postActions.getPostNocheckDB(pageNum1));
    }
  }, [TabList, pageNum, pageNum1]);

  const getMoreItem = () => {
    if (TabList === "check") {
      setPageNum(pageNum + 1);
    } else {
      setPageNum1(pageNum1 + 1);
    }
  };

  const goWrite = () => {
    if (!user_info) {
      Swal.fire("", "로그인 후 사용할 수 있습니다:)", "error");
      return;
    }
    history.push("/create");
  };

  React.useEffect(() => {
    if (inView) {
      getMoreItem();
    }
  }, [inView]);

  return (
    <React.Fragment>
      <SC_NoticeDiv>
        <h2>전체 게시물</h2>
        <TabMenu tab_list={tab_list} tab={setTabList} />
        <div className='list_wrap'>
          {postList.map((v, idx) => {
            const lastEl = idx === postList.length - 1;
            return (
              <NoticeList key={idx} list={v} lastEl={lastEl} viewRef={ref} />
            );
          })}
        </div>
        <div className='last'>{isLoaded && <Loader />}</div>
        <SC_BtnWrap>
          <button onClick={goWrite}>
            <WriteSvg />
            글쓰기
          </button>
        </SC_BtnWrap>
      </SC_NoticeDiv>
    </React.Fragment>
  );
};

const SC_NoticeDiv = styled.div`
  width: calc(100% - 342px - 24px);
  background-color: #fff;
  border-radius: 8px;

  h2 {
    padding: 30px 20px;
    font-weight: 700;
  }
  > ul {
    margin: 0 24px;
  }
`;

const SC_BtnWrap = styled.div`
  margin: 32px 24px 48px;
  text-align: right;

  button {
    color: #fff;
    padding: 16px 40px;
    border-radius: 5px;
    background-color: #7966ff;

    svg {
      vertical-align: middle;
      margin-right: 16px;
    }
  }
`;
export default React.memo(NoticeBoard);
