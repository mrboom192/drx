import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// In-memory cache
const cache: Record<string, any[]> = {};

export const getDoctorsByField = async (field: string, values: string[]) => {
  try {
    if (!field || values.length === 0) {
      return []; // No valid query
    }

    // Create a unique cache key based on field and values
    const cacheKey = `${field}:${values.sort().join(",")}`;

    // Check cache first
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    const doctorsRef = collection(db, "publicProfiles");
    let q;

    if (values.length === 1) {
      q = query(doctorsRef, where(field, "array-contains", values[0]));
    } else {
      q = query(doctorsRef, where(field, "array-contains-any", values));
    }

    const querySnapshot = await getDocs(q);
    const doctors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Store in cache
    cache[cacheKey] = doctors;

    return doctors;
  } catch (error) {
    console.error(`Error fetching doctors by ${field}:`, error);
    return [];
  }
};
