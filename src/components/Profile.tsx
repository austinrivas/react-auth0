import React from "react";
import LogoutButton from './LogoutButton';

interface Props {
  user: any;
}

const Profile = ({ user }: Props) => {

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <LogoutButton />
    </div>
  );
};

export default Profile;