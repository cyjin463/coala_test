import React, { useState } from "react";
import styled from "styled-components";

import Stomp, { over } from "stompjs";
import SockJs from "sockjs-client";

import { history } from "../redux/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as loOutAction } from "../redux/modules/user";
import Serch from "./Serch";
import Profile from "../elements/Profile";
import Category from "./Category";
import { delToken } from "../shared/token";
import { apiUrl } from "../elements/testApiUrl";
import { ReactComponent as LogoSvg } from "../svg/logo_header.svg";
import { ReactComponent as ArrowDown } from "../svg/arrow_down_b.svg";
import { ReactComponent as User } from "../svg/user.svg";

let stompClient = null;
const Header = () => {
  const isLogin = sessionStorage.getItem("isLogin");
  const nickname = sessionStorage.getItem("nickname");
  const userImage = sessionStorage.getItem("userImage");
  const [view, setView] = useState(false);
  const View = () => {
    setView(!view);
  };

  const [goPost, setGoPost] = React.useState("");
  const token = {
    Authorization: sessionStorage.getItem("token"),
  };

  const Logout = () => {
    delToken();
  };

  React.useEffect(() => {
    if (nickname) {
      let socket = new SockJs(`${apiUrl}/ws`);

      stompClient = Stomp.over(socket);
      stompClient.connect({}, () => {
        stompClient.subscribe(
          `/queue/user/${nickname}`,
          (payload) => {
            let payloadData = JSON.parse(payload.body);
            console.log(payloadData);
            setGoPost(payloadData);
          },
          token
        );
      });
    } else {
      // stompClient.disconnect(() => {
      //   stompClient.unsubscribe(`/queue/user/${nickname}`);
      // });
    }
  }, []);

  return (
    <Container>
      <div>
        <LogoSvg className='Logo' onClick={() => history.push("/")} />

        <Category />

        <Serch />
        {!isLogin ? (
          <div className='auth none' onClick={() => history.push("/login")}>
            <i>
              <User />
            </i>
            <span>회원가입/로그인</span>
          </div>
        ) : (
          <div className='auth my' onClick={View}>
            <i className={goPost.status ? "active" : ""}>
              <Profile size={36} imgUrl={userImage} />
            </i>
            {nickname}
            <ArrowDown className='arrow' />
            {view ? (
              <ul className='view'>
                <li onClick={() => history.push("/useredit")}>프로필 편집</li>
                <li onClick={() => history.push("/passedit")}>
                  비밀번호 재설정
                </li>
                <li onClick={() => history.push("/alarms")}>알람 내역</li>
                <li onClick={() => history.push("/scrap")}>관심글</li>
                <li className='logout' onClick={Logout}>
                  로그아웃
                </li>
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  min-width: 1440px;
  height: 100px;
  margin-bottom: 24px;
  box-shadow: -4px 5px 14px 0 rgb(65 0 131 / 6%);

  > div {
    display: flex;
    width: 1440px;
    height: 100%;
    margin: 0 auto;
    align-items: center;
  }

  .auth {
    position: relative;
    align-items: center;
    justify-content: center;
    width: 280px;
    height: 52px;
    padding-left: 20px;
    padding-right: 17px;
    border-radius: 8px;
    box-shadow: 0 0 4px 0 rgba(172, 168, 203, 0.2);
    cursor: pointer;
  }

  .Logo {
    flex: none;
    width: 220px;
    height: 38px;
    cursor: pointer;
  }

  div.my {
    display: flex;

    i {
      margin-right: 10px;
    }

    i.active {
      span {
        position: relative;
      }
      span:before {
        --alert-size: 10px;
        content: "";
        position: absolute;
        bottom: 2px;
        right: -2px;
        width: var(--alert-size);
        height: var(--alert-size);
        border-radius: var(--alert-size);
        background-color: #de0000;
        box-shadow: 0 1px 3px 0 rgba(245, 80, 80, 0.25);
      }
    }
  }

  div.my > .arrow {
    margin-left: auto;
    width: 24px;
    height: 24px;
  }

  div.none {
    width: 191;
    height: 63px;
    display: flex;
    color: #7966ff;
    align-items: center;
    cursor: pointer;
  }

  ul.view {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 100%;
    padding: 30px 24px;
    background-color: #fff;
    border-radius: 8px;
    z-index: 10;
    box-shadow: 0 0 10px 0 rgba(172, 168, 203, 0.4);
  }

  ul.view > li {
    height: 2rem;
    padding: 4px 8px;
    margin-bottom: 6px;
    font-size: 1rem;
    text-align: center;
    cursor: pointer;
    color: #333;
    font-size: 16px;
    border-radius: 2px;

    &.logout {
      color: #797979;
      &:hover {
        background-color: #998bff;
      }
    }

    &:hover {
      color: #fff;
      background-color: #7966ff;
    }
  }

  i {
    display: inline-flex;
    margin-right: 12px;
  }

  img {
    width: 100%;
    height: 100%;
  }

  button {
    width: 138px;
    height: 52px;
    border-radius: 2rem;
    font-size: 14px;
    color: black;
  }
`;

export default Header;
