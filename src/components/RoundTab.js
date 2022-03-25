import { map } from "bluebird";
import React from "react";
import styled from "styled-components";
const RoundTab = ({ currTab }) => {
  const tab_list = [
    {
      title: "total",
      value: "전체",
    },
    {
      title: "answer",
      value: "답변",
    },
    {
      title: "choose",
      value: "채택",
    },
  ];
  const [tab, setTab] = React.useState("total");
  console.log(tab);

  return (
    <RoundTabUl>
      {tab_list.map((v, idx) => (
        <li
          key={idx}
          className={tab === v.title ? "active" : ""}
          onClick={() => {
            setTab(v.title);
            currTab(v.title);
          }}>
          {v.value}
        </li>
      ))}
    </RoundTabUl>
  );
};

const RoundTabUl = styled.ul`
  --main-color: #7966ff;
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  padding: 0 24px;

  li {
    padding: 10px 32px;
    border: solid 1px var(--main-color);
    border-radius: 40px;
    cursor: pointer;
    transition: all 0.3s;
    color: var(--main-color);

    &.active {
      color: #fff;
      background-color: var(--main-color);
    }
  }
`;
export default RoundTab;
