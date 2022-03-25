// import React, { useState } from "react";
// import { over } from "stompjs";
// import SockJS from "sockjs-client";

// var stompClient = null;

// const _Test = () => {
//   const username1 = sessionStorage.getItem("nickname");
//   const token = {
//     Authorization: sessionStorage.getItem("token"),
//   };
//   const [publicChats, setpublicChats] = useState([]);
//   const [privateChats, setprivateChats] = useState(new Map());
//   // const [tab, setTab] = useState("CHATROOM")
//   const [userData, setUserData] = React.useState({
//     username: "",
//     message: "",
//     opposingUserName: "",
//     pid: "",
//   });
//   // 해당 페이지오면 바로 실행 return disconnet는 모르겠다.
//   React.useEffect(() => {
//     connect();
//     return () => disconnect();
//   }, []);

//   // Start!!
//   const connect = () => {
//     // 접속하고자라는 Sock 주소 가져오기
//     let Sock = new SockJS("http://175.118.48.164:7050/ws");
//     // let Sock = new SockJS("http://15.164.231.31/ws");
//     // Sock 열기
//     stompClient = over(Sock);

//     //Sock 연결하기 (헤더(토큰값 필요시 여기에 넣기), 바디(실행함수), 에러)
//     stompClient.connect({}, onConnected, onError);
//   };

//   // 연결 끊기
//   const disconnect = () => {
//     let chatMessage = {
//       status: "OUT",
//     };
//     stompClient.send(
//       "/app/message1",
//       token,
//       JSON.stringify(chatMessage),
//       console.log("전체 채팅방 OUT")
//     );
//     stompClient.send(
//       "/app/user",
//       token,
//       JSON.stringify(chatMessage),
//       console.log("1:1 채팅방 OUT")
//     );

//     stompClient.disconnect();
//   };

//   // input값이 바뀔때마다 userData 안에 username키의 value를 input값으로 바꾼다
//   const handleValue = (event) => {
//     // userData의 name의 value 값만 바꿔서 저장한다
//     const { name, value } = event.target;
//     setUserData({ ...userData, [name]: value });
//   };

//   //  연결하면 onConnented 함수 실행으로 userData 안에 connected 값을 true로 변경
//   const onConnected = () => {
//     // //userData 의 connected값을 true 로 바꾼다 나머지는 그대로
//     // setUserData({...userData,"connected":true});
//     // subscribe - store가 변할때 마다 호출 subscribe(함수()) / dispatch가 실행될 때마다 subscribe에 전달함수가 호출
//     // 포스트별 채팅방만들대 이곳을 바꾸어야 할수도? ***********
//     stompClient.subscribe("/topic/greetings", Public, token);

//     //1:1 대화에서는 topic이 아닌 quene를 사용해볼수도? ( topic은 1대 다수 - quene는 1:1)
//     // stompClient.subscribe(
//     //   `/queue/user${username1}`,
//     //   token,
//     //   onPrivateMessageReceived
//     // );

//     //userJoin 함수 실행
//     userJoin();
//   };

//   const userJoin = () => {
//     // chatMessage 선언 store 바뀔때마다 계속 바뀜
//     let chatMessage = {
//       senderName: username1,
//       message: userData.message,
//       opposingUserName: userData.opposingUserName,
//       pid: userData.pid,
//       status: "JOIN",
//     };
//     console.log(chatMessage);
//     //포스트에따라 여기가 바뀔수도!! *****************
//     stompClient.send("/app/message1", token, JSON.stringify(chatMessage));
//   };

//   // 에러일경우
//   const onError = (err) => {
//     console.log(err);
//   };
//   // // 1:1메세지 (귓속말) 함수
//   const onPrivateMessageReceived = (payload) => {
//     let payloadData = JSON.parse(payload.body);
//     if (privateChats.get(payloadData.senderName)) {
//       privateChats.get(payloadData.senderName).push(payloadData);
//       setprivateChats(new Map(privateChats));
//     } else {
//       let list = [];
//       list.push(payloadData);
//       privateChats.set(payloadData.senderName, list);
//       setprivateChats(new Map(privateChats));
//     }
//   };

//   //오픈 채팅방 메세지 보내기 함수
//   const sendPublicMessage = () => {
//     console.log(userData.opposingUserName);
//     if (stompClient && userData.opposingUserName !== "") {
//       let chatMessage = {
//         senderName: username1,
//         message: userData.message,
//         status: "MESSAGE",
//         pid: userData.pid,
//         opposingUserName: userData.opposingUserName,
//       };
//       stompClient.send("/app/user", token, JSON.stringify(chatMessage));
//       setUserData({ ...userData, message: "" });
//     } else {
//       let chatMessage = {
//         senderName: username1,
//         message: userData.message,
//         status: "MESSAGE",
//         pid: userData.pid,
//       };
//       stompClient.send("/app/message1", token, JSON.stringify(chatMessage));
//       setUserData({ ...userData, message: "" });
//     }
//   };

//   //1:1 메세지보내기 함수
//   const sendPrivateMessage = () => {
//     if (stompClient) {
//       let chatMessage = {
//         senderName: username1,
//         message: userData.message,
//         status: "MESSAGE",
//         opposingUserName: "jjy",
//       };
//       stompClient.send("/app/user", token, JSON.stringify(chatMessage));
//       setUserData({ ...userData, message: "" });
//     }
//   };

//   //전체 채팅방 메세지
//   const Public = (payload) => {
//     let payloadData = JSON.parse(payload.body);
//     switch (payloadData.status) {
//       case "JOIN":
//         if (!privateChats.get(payloadData.senderName)) {
//           privateChats.set(payloadData.senderName, []);
//           setprivateChats(new Map(privateChats));
//           console.log(publicChats);
//         }
//         break;
//       case "MESSAGE":
//         publicChats.push(payloadData);
//         setpublicChats([...publicChats]);
//         console.log(publicChats);
//         break;
//     }
//   };

//   const abc = (chat) => {
//     console.log(chat);
//     setUserData({ ...userData, opposingUserName: chat.senderName });
//     console.log(userData);
//   };

//   return (
//     <div className='container'>
//       <div className='chat-box'>
//         <div className='chat-content'>
//           <ul className='chat-messages'>
//             {/* <div className='member-list'>
//           <ul>
//             {[...privateChats.keys()].map((name, index) =>(
//               <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>
//                 {name}
//                 </li>
//             ))}
//           </ul>
//         </div> */}

//             {/* 오픈 채팅창 */}
//             {/*
//         {tab === "CHATROOM" && <div className='chat-content'>
//           <ul className='chat-message'> */}

//             {publicChats.map((chat, index) => (
//               <li className='message' key={index}>
//                 {/* 보낸사람이  본인이 아닐때*/}
//                 {chat.senderName !== userData.username && (
//                   <div className='avatar'>
//                     <button onClick={(chat) => abc}>{chat.senderName}</button> :{" "}
//                     {chat.message}
//                   </div>
//                 )}
//                 {/* 채팅메세지 */}
//                 {/* 보낸사람이 본인일때 */}
//                 {chat.senderName === userData.username && (
//                   <div className='avatar self'>
//                     {chat.senderName} : {chat.message}
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>

//           <div className='send-message'>
//             <input
//               type='text'
//               className='input-maeeage'
//               name='message'
//               placeholder='메세지를 입력하세요'
//               value={userData.message}
//               onChange={handleValue}
//             />
//             <button
//               type='button'
//               className='send-button'
//               onClick={sendPublicMessage}>
//               send
//             </button>
//             {publicChats.count}
//           </div>
//         </div>
//         {/*
//           <div className='send-message'>
//             <input type='text' className='input-maeeage'
//             name='message' placeholder={'에게 메세지 보내기'} value={userData.message}
//             onChange={handleValue}/>
//             <button type='button' className='send-button' onClick={sendPrivateMessage}>2</button>
//           </div> */}
//         {/* </div>} */}

//         {/* 1:1 채팅창 */}
//         {/* {tab !== "CHATROOM" && <div className='chat-content'>
//         <ul className='chat-message'>
//         {[,,,privateChats.get(tab)].map((chat, index) =>(
//               <li className='message' key={index}>
//                 {chat.senderName !== userData.username && <div className='avatar'>{chat.senderName}</div>}
//                 <div className='message-data'>{chat.message}</div>
//                 {chat.senderName=== userData.username && <div className='avatar self'>{chat.senderName}</div>}
//                 </li>
//             ))}
//           </ul>

//             <div className='send-message'>
//             <input type='text' className='input-maeeage'
//             name='message' placeholder={`${tab}에게 메세지 보내기`} value={userData.message}
//             onChange={handleValue}/>
//             <button type='button' className='send-button' onClick={sendPrivateMessage}>send</button>
//           </div>
//         </div>} */}
//       </div>
//     </div>
//   );
// };

// export default _Test;
