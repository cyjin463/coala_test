import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import img_down from "../svg/arrow_down_b.svg";
import { actionCreators as userActions } from "../redux/modules/user";
import Swal from "sweetalert2";

function Signup(props) {
  const dispatch = useDispatch();
  const [username, setUsername] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [checkPassword, setCheckPassword] = React.useState("");
  const [career, setCareer] = React.useState("경력");
  const [careerSelect, setCareerSelect] = React.useState("");

  ////유효성 검사
  const [idRuleCheck, setIdRuleCheck] = React.useState(false);
  const [passwordRuleCheck, setPasswordRuleCheck] = React.useState(false);
  const [nicknameRuleCheck, setNicknameRuleCheck] = React.useState(false);

  //////중복 체크
  const [isCheckUsername, setIsCheckUsername] = React.useState(false);
  const [isCheckNickname, setIsCheckNickname] = React.useState(false);

  ///경력 리스트
  const options = [
    { value: "1년차 이내", name: "1년차 이내" },
    { value: "1~2년차", name: "1~2년차" },
    { value: "3~4년차", name: "3~4년차" },
    { value: "5년차 이상", name: "5년차 이상" },
  ];

  /////////////////////////////////경고 문구
  const idRule = (e) => {
    const rule =
      /^(((?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{4,10})|([A-Za-z]{4,10}))$/;
    const id = e.target.value;
    setUsername(id);
    rule.test(id) ? setIdRuleCheck(true) : setIdRuleCheck(false);
  };

  const nicknameRule = (e) => {
    const rule = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣A-Za-z0-9]{2,8}$/;
    const nick = e.target.value;
    setNickname(nick);
    rule.test(nick) ? setNicknameRuleCheck(true) : setNicknameRuleCheck(false);
  };

  const passwordRule = (e) => {
    const rule = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{4,10}$/;
    const password = e.target.value;
    setPassword(password);
    rule.test(password)
      ? setPasswordRuleCheck(true)
      : setPasswordRuleCheck(false);
  };

  ///////////////////////////////////// 중복체크

  const checkUsername = () => {
    if (username === "") {
      Swal.fire("", "아이디를 입력해 주세요.", "error");
      return;
    } else if (idRuleCheck === false) {
      Swal.fire("", "아이디 형식이 맞지않습니다.", "error");
      return;
    }
    console.log(username, "중복요청");
    dispatch(userActions.checkUsernameDB(username, false));
    setIsCheckUsername(true);
  };

  const checkNickname = () => {
    if (nickname === "") {
      Swal.fire("", "닉네임이 공란입니다.", "error");
      return;
    } else if (nicknameRuleCheck === false) {
      Swal.fire("", "닉네임 형식이 맞지않습니다.", "error");
      return;
    }
    console.log(nickname, "의 중복확인 요청을 dispatch 했습니다.");
    dispatch(userActions.checkNicknameDB(nickname, false));
    setIsCheckNickname(true);
  };

  ///////////////////////회원가입
  const signup = (e) => {
    e.preventDefault();

    setIsCheckNickname(true);
    setIsCheckUsername(true);
    console.log(isCheckUsername, isCheckNickname);
    if (username === "" || nickname === "" || password === "") {
      Swal.fire("", "빈칸을 채워주세요.", "error");
      return;
    } else if (passwordRuleCheck !== true) {
      Swal.fire("", "패스워드 형식이 맞지 않습니다.", "error");
      return;
    } else if (password !== checkPassword) {
      Swal.fire("", "패스워드가 다릅니다.", "error");
      return;
    } else if (isCheckUsername === false || isCheckNickname === false) {
      Swal.fire("", "중복확인을 해주세요.", "error");
      return;
    } else if (career === "경력") {
      Swal.fire("", "경력을 선택해 주세요.", "error");
      return;
    }
    dispatch(
      userActions.signupDB(username, nickname, password, checkPassword, career)
    );
    setIsCheckUsername(false);
    setIsCheckNickname(false);
  };
  return (
    <Container>
      <div>
        <div>
          <span className='inputSpan'>아이디</span>
          <input
            type='text'
            placeholder='영문과 숫자를 4자 이상 10글자 이내 입력하세요.'
            onChange={idRule}
          />
          <button className='CheckButton' onClick={checkUsername}>
            중복체크
          </button>
        </div>
        {username.length > 0 && !idRuleCheck && (
          <span className='rule'> *아이디 형식이 맞지 않습니다. </span>
        )}
      </div>

      <div>
        <div>
          <span style={{ width: "58px" }} className='inputSpan'>
            비밀번호
          </span>
          <input
            type='password'
            placeholder='password'
            onChange={passwordRule}
          />
        </div>
        {password.length > 0 && !passwordRuleCheck && (
          <span className='rule'> *영문 숫자 조합 4자 이상 입력해주세요. </span>
        )}
      </div>

      <div>
        <div>
          <span style={{ width: "100px" }} className='inputSpan'>
            비밀번호 확인
          </span>
          <input
            type='password'
            onChange={(e) => {
              setCheckPassword(e.target.value);
            }}
          />
        </div>{" "}
        {checkPassword !== password && (
          <span className='rule'> *일치하지않는 비밀번호입니다. </span>
        )}
      </div>

      <div>
        <div>
          <span className='inputSpan'>닉네임</span>
          <input type='text' placeholder='Nickname' onChange={nicknameRule} />
          <button className='CheckButton' onClick={checkNickname}>
            중복체크
          </button>
        </div>
        {nickname.length > 0 && !nicknameRuleCheck && (
          <span className='rule'> *닉네임 형식이 맞지 않습니다. </span>
        )}
      </div>

      <Career>
        <div>
          <span onClick={() => setCareerSelect(!careerSelect)}>{career}</span>
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
        {career === "경력" && (
          <span className='rule'> *경력을 선택해주세요 </span>
        )}
      </Career>
      <div>
        <button className='SignupButtom' onClick={signup}>
          회원가입
        </button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 500px;
  height: 472px;
  margin: 0 auto;
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
      > span.inputSpan {
        color: #7966ff;
        font-size: 16px;
        font-weight: 800;
      }
    }
  }
  input {
    width: 90%;
    height: 32px;
    border: 0px solid black;
    font-size: 16px;
  }
  button.CheckButton {
    width: 76px;
    height: 32px;
    background-color: #7966ff;
    color: white;
    border-radius: 32px;
    position: absolute;
  }
  button.SignupButtom {
    width: 100%;
    height: 72px;
    background-color: #5e45f2;
    color: white;
    border-radius: 0.5rem;
  }
`;
const Career = styled.div`
  width: 500px;
  display: flex;
  position: relative;
  justify-content: end;

  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    > span {
      width: 100%;
      height: 72px;
      line-height: 72px;
      padding-left: 5px;
      border-radius: 8px;
      background-color: #f9f8ff;
      cursor: pointer;
      color: #7966ff;
      font-size: 16px;
      font-weight: 800;
      text-align: start;
    }
    > ul {
      width: 100%;
      height: 72px;
      border-radius: 0.5rem;
      border: 0px;
      position: absolute;
      margin-top: 150px;
      > li {
        display: flex;
        width: 100%;
        height: 72px;
        margin-left: 15px;
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
    width: 30px;
    height: 30px;
    display: flex;
    position: absolute;
    margin: 0 0 20px 450px;
    cursor: pointer;
  }
`;
export default Signup;
