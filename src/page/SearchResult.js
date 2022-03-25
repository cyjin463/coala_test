import React from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useInView } from "react-intersection-observer";
import NoticeList from "../elements/NoticeList";
import { history } from "../redux/configureStore";
import { actionsCreators as searchActions } from "../redux/modules/serch";

const SearchResult = () => {
  const dispatch = useDispatch();
  const search_type = useParams().keyword.split("_")[0];
  const search_keyword = useParams().keyword.split("_")[1];
  const tag_list = useSelector((state) => state.search.tag_list);
  const serch_list = useSelector((state) => state.search.serch_list);
  const category_list = useSelector((state) => state.search.category_list);
  const postList =
    search_type === "tag"
      ? tag_list
      : search_type === "serch"
      ? serch_list
      : category_list;
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [pageNum, setPageNum] = React.useState(1);
  const [pageNum1, setPageNum1] = React.useState(1);
  const [pageNum2, setPageNum2] = React.useState(1);
  const [ref, inView] = useInView({
    threshold: 0.4,
  });

  React.useEffect(() => {
    switch (search_type) {
      case "tag":
        return dispatch(searchActions.tagDB(search_keyword, pageNum));
      case "serch":
        return dispatch(searchActions.serchDB(search_keyword, pageNum1));
      case "category":
        return dispatch(searchActions.categoryDB(search_keyword, pageNum2));
      default:
        return null;
    }
  }, [search_keyword, pageNum, pageNum1, pageNum2]);

  const getMoreItem = () => {
    switch (search_type) {
      case "tag":
        setPageNum(pageNum + 1);
      case "serch":
        setPageNum1(pageNum1 + 1);
      case "category":
        setPageNum2(pageNum2 + 1);
      default:
        return null;
    }
  };

  React.useEffect(() => {
    if (inView) {
      getMoreItem();
    }
  }, [inView]);

  return (
    <Container>
      {postList.map((v, idx) => {
        const lastEl = idx === postList.length - 1;
        return <NoticeList key={idx} list={v} lastEl={lastEl} viewRef={ref} />;
      })}

      {postList.length === 0 && (
        <NoSearch>
          <h2>검색 결과가 없습니다 :)</h2>
          <button
            onClick={() => {
              history.replace("/");
            }}>
            되돌아가기
          </button>
        </NoSearch>
      )}
    </Container>
  );
};
const NoSearch = styled.div`
  padding: 200px;
  min-height: calc(100vh - 250px);
  text-align: center;

  h2 {
    font-size: 30px;
    font-weight: 700;
  }

  button {
    margin-top: 40px;
    padding: 16px 40px;
    background-color: #ddd;
    border-radius: 8px;
    color: #fff;
    transition: all 0.4s;

    &:hover {
      background-color: #7966ff;
    }
  }
`;
const Container = styled.div`
  width: 1440px;
  min-height: calc(100vh - 100px - 150px);
  margin: auto;
`;
export default SearchResult;
