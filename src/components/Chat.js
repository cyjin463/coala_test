import React from "react";
import Stomp, { over } from "stompjs";
import SockJs from "sockjs-client";
import Profile from "../elements/Profile";
import styled from "styled-components";
import Swal from "sweetalert2";
import { ReactComponent as SendSvg } from "../svg/send.svg";

import { apiUrl } from "../elements/testApiUrl";

let stompClient = null;
const Chat = () => {
  const token = {
    Authorization: sessionStorage.getItem("token")
      ? sessionStorage.getItem("token")
      : "Authorization",
  };
  const username = sessionStorage.getItem("nickname");

  const uid = sessionStorage.getItem("uid");
  const is_login = sessionStorage.getItem("is_Login");
  const [welcome, setWelcome] = React.useState(new Map());
  const [publicChats, setPublicChats] = React.useState([]);
  const [connected, setConnected] = React.useState(false);
  const [tab, setTab] = React.useState("CHATROOM");
  const [user, setUser] = React.useState(0);
  const [time, setTime] = React.useState("");
  const [userData, setUserData] = React.useState({
    username: "",
    message: "",
    opposingUserName: "",
  });

  React.useEffect(() => {
    stompConnect();

    return () => {
      stompDisConnect();
    };
  }, []);

  const onKeyPress = (e) => {
    if (e.key == "Enter") {
      sendPublicMessage();
    }
  };

  const stompDisConnect = () => {
    try {
      const user_join = { status: "OUT" };
      stompClient.send("/app/message", {}, JSON.stringify(user_join));

      stompClient.disconnect(() => {
        stompClient.unsubscribe("/topic/greetings");
      }, token);
    } catch (err) {}
  };

  const handleValue = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const stompConnect = () => {
    let socket = new SockJs(`${apiUrl}/ws`);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    try {
      const username = sessionStorage.getItem("nickname");
      const crareer = sessionStorage.getItem("career");
      const userImage = sessionStorage.getItem("userImage");
      const user_join = { status: "JOIN", uid, pid: 0 };

      setConnected(true);
      setUserData({
        ...userData,
        crareer,
        status: "JOIN",
      });

      stompClient.send("/app/hello", {}, JSON.stringify({ username }));
      stompClient.send("/app/message", token, JSON.stringify(user_join));
      stompClient.subscribe("/topic/greetings", onPublicMessageReceived, token);
    } catch (err) {
      console.log(err);
    }
  };

  const sendPublicMessage = () => {
    if (is_login) {
      const username = sessionStorage.getItem("nickname");

      if (stompClient) {
        if (!userData.message) {
          Swal.fire("", "내용을 입력해주세요!", "error");
        } else {
          let chatMessage = {
            senderName: username,
            message: userData.message,
            status: "MESSAGE",
            uid,
            pid: 0,
          };

          stompClient.send("/app/message", token, JSON.stringify(chatMessage));
          setUserData({ ...userData, message: "" });
        }
      }
    } else {
      Swal.fire("", "로그인 후 사용할 수 있습니다:)", "error");
    }
  };

  //subscribe의 함수
  const onPublicMessageReceived = (payload) => {
    let payloadData = JSON.parse(payload.body);

    switch (payloadData.status) {
      case "JOIN":
        if (!welcome.get(payloadData.senderName)) {
          welcome.set(payloadData.message, []);
          setWelcome(new Map(welcome));
          setUser(payloadData.userCount);
        }
        break;
      case "OUT":
        if (!welcome.get(payloadData.senderName)) {
          console.log(payloadData);
          welcome.set(payloadData.message, []);
          setWelcome(new Map(welcome));
          setUser(payloadData.userCount);
        }
        break;
      case "MESSAGE":
        const time1 = payloadData.createdAt.split("T")[1]; //년월 제거
        const time2 = time1.split(".")[0]; // 소수점 제거
        const time3 = time2.split(":")[0] + ":" + time2.split(":")[1]; // 시간, 분
        setTime(time3);
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        setUser(payloadData.userCount);
        break;
    }
  };

  const onError = (err) => {
    console.log(err);
    console.log("plz");
  };

  return (
    <ChatDiv>
      <ChatTab>
        <li
          onClick={() => {
            setTab("CHATROOM");
          }}>
          채팅 {user}
        </li>
      </ChatTab>
      <ChatList>
        <ul>
          {[...welcome.keys()].map((name, index) => {
            return (
              <li className='welcome' key={index}>
                {name}
              </li>
            );
          })}

          {publicChats.map((chat, index) => (
            <li
              className={` ${chat.senderName === username ? "self" : "user"}`}
              key={index}>
              {chat.senderName !== username && (
                <>
                  <Profile size='32' imgUrl={userData.userImage} />
                  <div>
                    <strong>{chat.senderName}</strong>
                    <i>{userData.crareer}</i>
                  </div>
                </>
              )}
              <p className='message-data'>{chat.message}</p>
              {time.split[0] > 12 ? <em> {time}</em> : <em> {time} </em>}
            </li>
          ))}
        </ul>
      </ChatList>
      <ChatInput>
        <div>
          <input
            type='text'
            name='message'
            value={userData.message}
            placeholder='채팅을 입력해주세요 :)'
            onChange={handleValue}
            onKeyPress={onKeyPress}
          />
          <button onClick={sendPublicMessage}>
            <SendSvg />
          </button>
        </div>
      </ChatInput>
    </ChatDiv>
  );
};

const ChatDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 102px);
  background-color: #f9f8ff;
  border-radius: 8px;
  overflow: hidden;
`;

const ChatTab = styled.ul`
  display: flex;
  flex: none;
  overflow: auto;

  li {
    padding: 0 22px;
    margin: 0 10px;
    font-size: 18px;
    font-weight: 700;
    line-height: 58px;
    color: #5e45f2;
    border-bottom: solid 3px #5e45f2;
  }
`;

const ChatList = styled.div`
  flex: auto;
  padding: 0 10px;
  overflow: auto;

  ul {
    padding-top: 30px;
    overflow: hidden;
  }

  li {
    width: 286px;

    p {
      padding: 8px;
      word-break: break-all;
      border-radius: 8px;
    }

    &.welcome {
      color: #5e45f2;
    }

    &.user {
      position: relative;
      padding-left: 36px;
      padding-right: 10px;

      strong {
        font-size: 14px;
        color: #5e45f2;
      }

      p {
        margin-top: 8px;
        color: #333;
        background-color: #fff;
        box-shadow: 0 4px 14px 0 rgba(65, 0, 131, 0.06);
      }

      em {
        display: block;
        text-align: right;
      }
    }

    &.self {
      margin: 12px 0;
      margin-left: auto;

      p {
        color: #fff;
        background-color: #7966ff;
      }
    }
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0 0 4px 0 rgba(121, 102, 255, 0.2);
  }

  i {
    color: #797979;
    font-size: 12px;
    font-style: normal;

    &:before {
      --dat-size: 2px;
      content: ".";
      margin: 0 6px;
      font-size: 16px;
      vertical-align: super;
    }
  }

  em {
    display: block;
    margin-top: 10px;
    color: #797979;
    font-size: 12px;
    font-style: normal;
  }
`;

const ChatInput = styled.div`
  padding: 24px 16px;
  background-color: #f9f8ff;
  box-shadow: 0 -4px 10px 0 rgba(133, 47, 243, 0.05);

  > div {
    display: flex;
    align-items: center;
    height: 42px;
    padding: 8px 14px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: inset 0 2px 6px 0 rgba(60, 4, 105, 0.08);
    background-color: #fff;
  }

  input {
    flex: auto;
    padding: 0;
    background-color: transparent;
  }

  button {
    flex: none;
    svg {
      vertical-align: middle;
    }
  }
`;

export default Chat;
