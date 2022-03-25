import React from "react";
import styled from "styled-components";

const RoundBtn = ({ onClick, title, isLine = false }) => {
  return (
    <Button onClick={onClick} isLine={isLine}>
      {title}
    </Button>
  );
};

const Button = styled.button`
  --main-color: #7966ff;
  height: 39px;
  flex: none;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 32px;
  box-size: border-box;
  ${(props) =>
    props.isLine
      ? `
    color:var(--main-color) !important;
    border:solid 3px var(--main-color) !important;
    background-color:#fff !important;
    
    `
      : `
    color: #fff !important;
    background-color: var(--main-color) !important;
  `};
`;

export default RoundBtn;
