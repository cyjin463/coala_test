import React from "react";
import styled from "styled-components";
import RoundTab from "../components/RoundTab";
import TableList from "../components/TableList";

const Alarms = () => {
  const [curTab, setCurTab] = React.useState("total");

  return (
    <SC_AlarmsWrap>
      <h2>알림</h2>
      <RoundTab currTab={setCurTab} />
      <TableList currTab={curTab} />
    </SC_AlarmsWrap>
  );
};

const SC_AlarmsWrap = styled.div`
  width: 1440px;
  min-height: calc(100vh - 100px - 150px);
  margin: 0 auto;

  h2 {
    padding: 0 24px;
    margin-top: 64px;
    margin-bottom: 115px;
  }
`;
export default Alarms;
