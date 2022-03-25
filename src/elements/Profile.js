import React from "react";
import styled from "styled-components";

import { ReactComponent as UserDefault } from "../svg/logo-1.svg";

const Profile = ({ imgUrl, size = "30" }) => {
  return (
    <ProfileImg imgUrl={imgUrl} size={size}>
      {!imgUrl && <UserDefault />}
    </ProfileImg>
  );
};

const ProfileImg = styled.span`
  display: inline-block;

  svg {
    width: 100%;
    height: 100%;
  }

  ${(props) =>
    props.size &&
    `
  width: ${props.size}px;
  height: ${props.size}px;
  border-radius:${props.size}px;
  `}

  background: url(${(props) => props.imgUrl && props.imgUrl})

    no-repeat center / cover;
`;

export default Profile;
