import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as rankingActions } from "../redux/modules/ranking";
import TabMenu from "../components/TabMenu";
import RankingTop from "../components/RankingTop";
import RankingOther from "../components/RankingOther";

const Ranking = () => {
  const tab_list = [
    {
      title: "total",
      value: "종합 랭킹",
    },
    {
      title: "month",
      value: "월간 랭킹",
    },
    {
      title: "week",
      value: "주간 랭킹",
    },
  ];
  const dispatch = useDispatch();
  const ranking_list = useSelector((state) => state.ranking.list);
  const user_ranking = useSelector((state) => state.ranking.user_list);
  const [tabList, setTabList] = React.useState();

  React.useEffect(() => {
    switch (tabList) {
      case "month":
        dispatch(rankingActions.monthRankingDB());
        dispatch(rankingActions.myMonthRankingDB());
        return;
      case "week":
        dispatch(rankingActions.weekRankingDB());
        dispatch(rankingActions.myWeekRankingDB());
        return;
      default:
        dispatch(rankingActions.myTotalRankingDB());
        dispatch(rankingActions.totalRankingDB());
        return;
    }
  }, [tabList]);

  return (
    <SC_Detail>
      <TabMenu tab_list={tab_list} tab={setTabList} />
      <RankingTop list={ranking_list?.slice(0, 3)} />
      <RankingOther
        list={ranking_list?.slice(3, 10)}
        user_ranking={user_ranking}
      />
    </SC_Detail>
  );
};
const SC_Detail = styled.div`
  width: 1440px;
  margin: 0 auto;
  padding-bottom: 220px;

  h2 {
    font-size: 24px;
    padding-bottom: 40px;
  }
`;
export default Ranking;
