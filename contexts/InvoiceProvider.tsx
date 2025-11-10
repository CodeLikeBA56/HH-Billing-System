"use client";
import { Invoice } from "@/types";
import { db } from "@/lib/firebase";
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  useState,
  ReactNode,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";
import { useAuthContext } from "./AuthProvider";

interface InvoiceContextProps {
  loading: boolean;
  invoices: Invoice[];
  error: string | null;
  addInvoice: (invoice: Omit<Invoice, "uid" | "createdAt" | "updatedAt">) => Promise<void>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextProps | undefined>(undefined);

const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useAuthContext();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userInfo?.uid) return;

    const unsubscribe = onSnapshot(
      collection(db, "invoices"),
      (snapshot) => {
        const fetchedInvoices = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            uid: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || null,
            updatedAt: data.updatedAt?.toDate?.() || null,
          } as Invoice;
        });
        setInvoices(fetchedInvoices);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching invoices:", err);
        setError("An error occurred while fetching invoices.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userInfo?.uid]);

  const addInvoice = useCallback(
    async (invoice: Omit<Invoice, "uid" | "createdAt" | "updatedAt">) => {
      try {
        setError(null);
        await addDoc(collection(db, "invoices"), {
          ...invoice,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Error adding invoice:", err);
        setError("An error occurred while adding the invoice.");
      }
    },
    []
  );

  const updateInvoice = useCallback(async (id: string, updates: Partial<Invoice>) => {
    try {
      const docRef = doc(db, "invoices", id);
      await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
    } catch (err) {
      console.error("Error updating invoice:", err);
      setError("An error occurred while updating invoice.");
    }
  }, []);

  const deleteInvoice = useCallback(async (id: string) => {
    try {
      const docRef = doc(db, "invoices", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting invoice:", err);
      setError("An error occurred while deleting invoice.");
    }
  }, []);

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        loading,
        error,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = (): InvoiceContextProps => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoiceContext must be used within an InvoiceProvider");
  }
  return context;
};

export default InvoiceProvider;