import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { getUserData } from "../../firebase/userService";
import Loader from "../loader/Loader";

function UserInfo() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const profileData = await getUserData(u.uid);
        setProfile(profileData);
      }
    });

    return () => unsub();
  }, []);

  if (!user || !profile) return <Loader/>;

  return (
    <div>
      <h2>Привіт, {profile.name}</h2>
      <p>Email: {user.email}</p>
      <p>Роль: {profile.role}</p>
    </div>
  );
}

export default UserInfo;