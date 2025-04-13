import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/Sales.module.css";

const AdminPanel = () => {
  const { role } = useAuth();
  const [users, setUsers] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    };

    if (role === "creater") {
      fetchUsers();
    }
  }, [role]);

  const handleRoleChange = async (uid, newRole) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { role: newRole });

    // Обновим в UI
    setUsers(prev =>
      prev.map(user =>
        user.id === uid ? { ...user, role: newRole } : user
      )
    );
  };

  if (role !== "creater") {
    return <p>У Вас немає прав доступу</p>;
  }

  return (
    <div>
      <h2 className={styles.title}>🧍‍♂️ Управління користувачами:</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Роль</th>
            <th>Зміна ролі</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="admin">admin</option>
                  <option value="creater">creater</option>
                  <option value="viewer">viewer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
