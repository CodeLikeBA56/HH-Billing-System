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
  query,
  orderBy,
  limit,
  getDocs,
  where,
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
  getReceivableBalance: (uid: string) => number;
  getNextBillNumber: () => Promise<string>;
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

  const getReceivableBalance = useCallback((uid: string) => {
    const customerInvoices = invoices.filter(invoice => invoice.customerId === uid && invoice.remainingBalance > 0);
    return customerInvoices.reduce((receivable, invoice) => {
      return receivable + invoice.remainingBalance;
    }, 0);
  }, [invoices]);

  const getNextBillNumber = useCallback(async (): Promise<string> => {
    try {
      // Query all invoices ordered by createdAt descending to get the latest
      const invoicesQuery = query(
        collection(db, "invoices"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      
      const querySnapshot = await getDocs(invoicesQuery);
      
      if (querySnapshot.empty) {
        // No invoices exist, start with BILL-001
        return "BILL-001";
      }
      
      // Get the latest invoice
      const latestInvoice = querySnapshot.docs[0].data() as Invoice;
      const latestBillNo = latestInvoice.billNo || "";
      
      // Extract numeric part from bill number (handles formats like "BILL-001", "INV-123", "1", etc.)
      const match = latestBillNo.match(/(\d+)$/);
      let maxNumber = 0;
      
      if (match) {
        maxNumber = parseInt(match[1], 10);
      } else {
        // If no numeric part found, check if it's just a number
        const numericMatch = latestBillNo.match(/^\d+$/);
        if (numericMatch) {
          maxNumber = parseInt(latestBillNo, 10);
        }
      }
      
      // If we couldn't parse a number, check all invoices to find the highest bill number
      if (maxNumber === 0) {
        const allInvoicesQuery = query(collection(db, "invoices"));
        const allSnapshot = await getDocs(allInvoicesQuery);
        
        allSnapshot.docs.forEach((docSnap) => {
          const invoiceData = docSnap.data() as Invoice;
          const billNo = invoiceData.billNo || "";
          const match = billNo.match(/(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNumber) {
              maxNumber = num;
            }
          }
        });
      }
      
      // Generate next bill number
      const nextNumber = maxNumber + 1;
      return `BILL-${nextNumber.toString().padStart(3, '0')}`;
    } catch (err) {
      console.error("Error getting next bill number:", err);
      // Fallback: use invoice count + 1
      const nextNumber = invoices.length + 1;
      return `BILL-${nextNumber.toString().padStart(3, '0')}`;
    }
  }, [invoices]);

  return (
    <InvoiceContext.Provider
      value={{
        error,
        loading,
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getReceivableBalance,
        getNextBillNumber,
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