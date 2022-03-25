const getToken = () => {
  const token = sessionStorage.getItem("token");

  if (token) {
    return token;
  } else {
    return null;
  }
};

const setToken = (token) => {
  if (!token) {
    return false;
  }
  sessionStorage.setItem("token", token);
};

const delToken = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("uid");
  sessionStorage.removeItem("url");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("nickname");
  sessionStorage.removeItem("isLogin");
  sessionStorage.removeItem("career");
  sessionStorage.removeItem("userImage");
};

export { getToken, setToken, delToken };
