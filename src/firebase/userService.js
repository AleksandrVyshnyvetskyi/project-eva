import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // убедись, что путь правильный

export async function getUserData(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    console.log("Пользователь не найден!");
    return null;
  }
}