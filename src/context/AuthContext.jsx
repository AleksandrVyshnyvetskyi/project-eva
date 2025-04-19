import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);

                const docRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(docRef);

                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
