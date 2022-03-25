import React from "react";
import { ReactComponent as FooterLogo } from "../svg/logo_footer.svg";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterWrap>
      <div>
        <h2>
          <FooterLogo />
        </h2>
        <ul>
          <a href='https://github.com/zeze88/sun'>
            <li>문의사항</li>
          </a>
          <a href='https://oasis-cyclamen-45f.notion.site/5-8-_1-28217e32bae849a5bc95389ed1d5dd73'>
            <li>코알리팀 소개</li>
          </a>
          <li>버그 제보</li>
        </ul>
      </div>
    </FooterWrap>
  );
};
const FooterWrap = styled.div`
  min-width: 1440px;
  background-color: #7966ff;

  & > div {
    display: flex;
    gap: 64px;
    width: 1440px;
    margin: 0 auto;
    padding: 0 24px;
    height: 150px;
    line-height: 150px;
    color: #fff;
  }

  svg {
    vertical-align: middle;
  }

  ul {
    display: flex;
    gap: 64px;
  }

  li {
    color: #fff;
  }
  a {
    text-decoration: none;
  }
`;
export default Footer;
