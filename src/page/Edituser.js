import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Profile from "../elements/Profile";
import { actionCreators as userActions } from "../redux/modules/user";
import img_down from "../svg/arrow_down_b.svg";
import camera from "../svg/camera_fill.svg";
import Swal from "sweetalert2";
// import { ReactComponent as img_down } from "../svg/arrow_down_b.svg";
// import { ReactComponent as camera } from "../svg/camera_fill.svg";

const userNickname = sessionStorage.getItem("nickname");
const userCareer = sessionStorage.getItem("career");
const userImage = sessionStorage.getItem("userImage");
const userURL = sessionStorage.getItem("url");
const uid = sessionStorage.getItem("uid");

const Edituser = (props) => {
  const dispatch = useDispatch();
  const [isCheckNickname, setIsCheckNickname] = React.useState(false);
  const [nickname, setNickname] = useState(userNickname);
  const [userImg, setUserImg] = useState(userImage);
  const [blogUrl, setBlogUrl] = useState(userURL);
  const [career, setCareer] = useState(userCareer);
  const [careerSelect, setCareerSelect] = useState(userCareer);
  const [nicknameRuleCheck, setNicknameRuleCheck] = React.useState(true);
  const imgInput = React.useRef();
  const options = [
    { value: "1년차 이내", name: "1년차 이내" },
    { value: "1~2년차", name: "1~2년차" },
    { value: "3~4년차", name: "3~4년차" },
    { value: "5년차 이상", name: "5년차 이상" },
  ];

  const nicknameRule = (e) => {
    const rule = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣A-Za-z0-9]{2,8}$/;
    const nick = e.target.value;
    setNickname(nick);
    rule.test(nick) ? setNicknameRuleCheck(true) : setNicknameRuleCheck(false);
  };

  const Check = () => {
    if (userNickname === nickname) {
      setIsCheckNickname(true);
      Swal.fire("", "사용 가능합니다.", "success");
    } else if (nicknameRuleCheck !== true) {
      Swal.fire("", "닉네임 형식이 맞지 않습니다.", "error");
    }
    check();
  };

  const check = () => {
    if (nickname === "") {
      Swal.fire("", "닉네임이 공란입니다.", "error");
      return;
    }
    dispatch(userActions.checkNicknameDB(nickname, false));
    setIsCheckNickname(true);
  };

  const url = (e) => {
    setBlogUrl(e.target.value);
  };

  ////////////////////////////////////////사진 변경
  const editImg = () => {
    const img = imgInput.current.files[0];
    console.log(img);
    const imgReader = new FileReader();
    imgReader.readAsDataURL(img);
    imgReader.onloadend = () => {
      setUserImg(imgReader.result);
    };
    dispatch(userActions.imgPost(img));
  };
  //////////////////////////////////////////SAVE

  const Save = () => {
    if (
      userNickname === nickname &&
      userCareer === career &&
      userImage === userImg &&
      userURL === blogUrl
    ) {
      Swal.fire("", "변경 사항이 없습니다.", "error");
      return;
    } else if (nickname === "") {
      Swal.fire("", "닉네임이 공란입니다.", "error");
      return;
    } else if (isCheckNickname === false) {
      if (userNickname === nickname) {
        setIsCheckNickname(true);
      } else {
        Swal.fire("", "중복체크를 해주세요", "error");
      }
      return;
    } else if (userImg === userImage) {
      Swal.fire({
        title: "회원정보를 수정하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네 수정하겠습니다.",
        confirmButtonColor: "#7966FF",
        cancelButtonText: "아니오",
        cancelTextColor: "#7966FF",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("", "회원정보가 수정 되었습니다.", "success");
          dispatch(
            userActions.logEditDB(uid, nickname, career, blogUrl, userImg)
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("", "수정이 취소 되었습니다 :)", "error");
        }
      });
      return;
    } else if (userImg !== userImage) {
      Swal.fire({
        title: "회원정보를 수정하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "네 수정하겠습니다.",
        confirmButtonColor: "#7966FF",
        cancelButtonText: "아니오",
        cancelTextColor: "#7966FF",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("", "회원정보가 수정 되었습니다.", "success");
          dispatch(
            userActions.logEditDB2(uid, nickname, career, blogUrl, userImg)
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("", "수정이 취소 되었습니다 :)", "error");
        }
      });
      return;
    }
  };

  return (
    <Container>
      <div className='title'>프로필 편집</div>
      <div className='user'>
        <ProfileImg>
          <i>
            <Profile imgUrl={userImg} size={175} />
          </i>
          <input
            id='profile'
            type='file'
            hidden={true}
            onChange={editImg}
            ref={imgInput}
          />
          <label htmlFor='profile'>
            <img src={camera} />
            사진 업로드
          </label>
        </ProfileImg>
        <div className='container'>
          <EditNickname>
            <div>
              <div>
                <input
                  placeholder='닉네임'
                  onChange={nicknameRule}
                  value={nickname}></input>
                <button className='check' onClick={Check}>
                  중복체크
                </button>
              </div>
              {nickname.length > 0 && !nicknameRuleCheck && (
                <span className='rule'> *닉네임 형식이 맞지 않습니다. </span>
              )}
            </div>
          </EditNickname>

          <EditBlog>
            <div>
              <input
                className='blog'
                placeholder='sns 계정 url 기입'
                onChange={url}
                value={userURL === "undefined" ? null : blogUrl}></input>
            </div>
          </EditBlog>
          <EditCareer>
            <div>
              <span onClick={() => setCareerSelect(!careerSelect)}>
                {career}
              </span>
              {careerSelect === true ? (
                <ul>
                  {options.map((v, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setCareer(v.name);
                        setCareerSelect(false);
                      }}>
                      {v.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <img
              onClick={() => setCareerSelect(!careerSelect)}
              src={img_down}></img>
          </EditCareer>
          <button className='save' onClick={Save}>
            저장
          </button>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 1440px;
  height: 830px;
  margin: auto;
  > div.title {
    width: 116px;
    height: 35px;
    font-size: 24px;
    font-weight: 600;
  }
  > div.user {
    width: 830px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    > div.container {
      width: 500px;
      height: 312px;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > button {
        width: 100%;
        height: 72px;
        background-color: #5e45f2;
        color: white;
        border-radius: 0.5rem;
      }
    }
  }
`;
const ProfileImg = styled.div`
  width: 350px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > i {
    width: 175px;
    height: 175px;
    margin-bottom: 1.5rem;
  }
  > label {
    display: flex;
    width: 135px;
    height: 40px;
    padding: 0 8px;
    border: 2px solid #7966ff;
    border-radius: 0.5rem;
    font-size: 16px;
    font-weight: 600;
    justify-content: space-around;
    align-items: center;
    color: #7966ff;
  }
`;

const EditNickname = styled.div`
  width: 500px;
  height: 72px;
  display: flex;
  text-align: center;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  div {
    width: 100%;
    height: 72px;
    display: flex;
    flex-direction: column-reverse;
    > span.rule {
      color: red;
      font-size: 12px;
      position: absolute;
      justify-content: start;
      padding-left: 15px;
    }
    > div {
      width: 100%;
      height: 72px;
      display: flex;
      flex-direction: row;
      position: relative;
      justify-content: end;
      align-items: center;
      background-color: #f9f8ff;
      border-radius: 0.5rem;
      padding: 15px;
      > input {
        width: 100%;
        height: 72px;
        border-radius: 0.5rem;
        font-size: 16px;
        font-weight: 600;
        outline: 0;
        background-color: #f9f8ff;
      }
      > button {
        width: 76px;
        height: 32px;
        background-color: #7966ff;
        color: white;
        border-radius: 32px;
        position: absolute;
        margin-right: 20px;
      }
    }
  }
`;

const EditBlog = styled.div`
  width: 500px;
  > div {
    width: 100%;
    height: 72px;
    padding: 0 15px;
    background-color: #f9f8ff;
    border-radius: 0.5rem;
    > input {
      width: 100%;
      height: 72px;
      font-size: 16px;
      font-weight: 600;
      outline: 0;
      background-color: #f9f8ff;
    }
  }
`;

const EditCareer = styled.div`
  width: 500px;
  display: flex;
  position: relative;
  justify-content: end;
  align-items: center;
  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    > span {
      width: 100%;
      height: 72px;
      line-height: 72px;
      padding: 0 16px;
      border-radius: 8px;
      background-color: #f9f8ff;
      cursor: pointer;
      color: #7966ff;
      font-size: 16px;
      font-weight: 600;
    }
    > ul {
      width: 100%;
      height: 72px;
      border-radius: 0.5rem;
      border: 0px;
      position: absolute;
      margin-top: 80px;
      > li {
        display: flex;
        width: 100%;
        height: 72px;
        font-size: 16px;
        font-weight: 600;
        padding-left: 10px;
        background-color: #f9f8ff;
        align-items: center;
        justify-content: start;
        cursor: pointer;
        &:hover {
          background-color: #5e45f2;
          color: #f9f8ff;
        }
      }
    }
  }
  > img {
    width: 50px;
    height: 50px;
    position: absolute;
  }
`;

export default Edituser;
