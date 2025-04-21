import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/../firebaseConfig";

interface DoctorContextType {
  doctor: any;
  loading: boolean;
  error: string | null;
}

// UNUSED FOR NOW

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider = ({ children }: { children: ReactNode }) => {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setDoctor(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const userDocRef = doc(db, "users", user.uid);

      const unsubscribeSnapshot = onSnapshot(
        userDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setDoctor({ uid: user.uid, ...snapshot.data() });
            setError(null);
          } else {
            setDoctor(null);
            setError("No user document found.");
          }
          setLoading(false);
        },
        (error) => {
          setError("Error retrieving user information.");
          setLoading(false);
        }
      );

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctor, loading, error }}>
      {children}
    </DoctorContext.Provider>
  );
};

// Custom hook for consuming the context
export const useUser = (): DoctorContextType => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
