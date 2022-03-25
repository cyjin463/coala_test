import React from "react";
import styled from "styled-components";

const TabMenu = ({ tab_list, tab }) => {
  const [menu, setMenu] = React.useState(tab_list[0].title);

  return (
    <SC_TabMenu>
      {tab_list.map((v, idx) => (
        <li
          key={idx}
          className={menu === v.title ? "active" : ""}
          onClick={() => {
            setMenu(v.title);
            tab(v.title);
          }}>
          {v.value}
        </li>
      ))}
    </SC_TabMenu>
  );
};

const SC_TabMenu = styled.ul`
  display: flex;
  border-bottom: solid 1px #f0ecfd;

  li {
    margin-right: 50px;
    padding: 0 4px;
    padding-bottom: 9px;
    cursor: pointer;
    color: #c4c4c4;
    transition: all 0.2s ease-in-out;
    border-bottom: solid 3px transparent;

    &.active {
      color: #7966ff;
      border-bottom: solid 3px #7966ff;
    }
  }
`;
export default TabMenu;
