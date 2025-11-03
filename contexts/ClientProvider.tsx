"use client";
import { Client } from "@/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from "react";

interface ClientContextProps {
    loading: boolean;
    clients: Client[];
    addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    error: string | null;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

const ClientProvider = ({ children }: { children: ReactNode }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { // 🔹 Fetch clients in realtime
        const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
            setClients(snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as Client)));
            setLoading(false);
        }, (err) => {
            console.error("Error fetching clients:", err);
            setError("Failed to load clients. Please try again.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addClient = useCallback(async (client: { name: string; phone: string }) => {
        try {
            setError(null);
            await addDoc(collection(db, "clients"), {
                name: client.name.trim(),
                phone: client.phone.trim(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error adding client:", err);
            setError("Failed to add client. Please try again.");
        }
    }, []);

    useEffect(() => {console.log(clients)}, [clients]);

    return (
        <ClientContext.Provider value={{ clients, addClient, loading, error }}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClientContext = (): ClientContextProps => {
  const context = useContext(ClientContext);
  if (!context) throw new Error("useClientContext must be used within a ClientProvider");
  return context;
};

export default ClientProvider;