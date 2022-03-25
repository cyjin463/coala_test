import React from "react";
import styled from "styled-components";
import { ReactComponent as Search } from "../svg/search.svg";

import { useDispatch } from "react-redux";
import { actionsCreators as serchActions } from "../redux/modules/serch";
import { history } from "../redux/configureStore";

const Serch = () => {
  const [find, setFind] = React.useState();
  const [showSearch, setShowSearch] = React.useState(false);

  const onKeyPress = (e) => {
    if (e.key == "Enter") {
      const setFind = e.target.value;
      // history.push(`/search/serch_${setFind}`);
      window.location.replace(`/search/serch_${setFind}`);
    }
  };

  React.useEffect(() => {
    setShowSearch(false);
  }, []);

  return (
    <Container className={showSearch ? "active" : ""}>
      <div className='inputdiv'>
        <Search
          className='search_icon'
          onClick={() => {
            setShowSearch(!showSearch);
          }}
        />
        <input
          onKeyPress={onKeyPress}
          onChange={(e) => {
            setFind(e.target.value);
          }}
          placeholder='검색'></input>
      </div>
    </Container>
  );
};
const Container = styled.div`
  flex: auto;
  margin: 0 10px;

  &.active {
    div.inputdiv {
      width: 100% !important;
      padding: 5px;
      border: 1px solid #5e45f2;
    }

    input {
      display: block;
      width: calc(100% - 37px);
      padding: 10px;
      margin-left: auto;
    }
  }

  div.inputdiv {
    position: relative;
    display: flex;
    width: 0%;
    align-items: center;
    margin-left: auto;
    height: 52px;
    border-radius: 2rem;
    padding: 5px;
    padding-left: 37px;
    transition: width 0.4s ease-in-out;
  }

  .search_icon {
    position: absolute;
    top: 50%;
    left: 12px;
    display: inline-block;
    width: 32px;
    height: 32px;
    cursor: pointer;
    transform: translateY(-50%);
    background: url("icon/search.svg") no-repeat center/contain;
    z-index: 10;
  }

  input {
    display: inline-block;
    width: 0;
    height: 100%;
    border: 0px solid;
    outline: 0;
    background-color: transparent;
    color: #333;
  }
`;

export default Serch;
