"use client";
import { Client } from "@/types";
import { db } from "@/lib/firebase";
import {
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    collection,
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

interface ClientContextProps {
    loading: boolean;
    clients: Client[];
    error: string | null;
    addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

const ClientProvider = ({ children }: { children: ReactNode }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { // Realtime sync
        const unsubscribe = onSnapshot(
            collection(db, "clients"),
            (snapshot) => {
                setClients(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Client)));
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching clients:", err);
                setError("An error occurred while fething the clients.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

  // Add client
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

  // Update client
    const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
        try {
            const docRef = doc(db, "clients", id);
            await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
        } catch (err) {
            console.error("Error updating client:", err);
            setError("An error occurred while updating client info.");
        }
    }, []);

    // Delete client
    const deleteClient = useCallback(async (id: string) => {
        try {
            const docRef = doc(db, "clients", id);
            await deleteDoc(docRef);
        } catch (err) {
            console.error("Error deleting client:", err);
            setError("An error occurred while deleting product.");
        }
    }, []);

    return (
        <ClientContext.Provider
            value={{
                clients,
                addClient,
                updateClient,
                deleteClient,
                loading,
                error,
            }}
        >
            {children}
        </ClientContext.Provider>
    );
};

export const useClientContext = (): ClientContextProps => {
    const context = useContext(ClientContext);
    if (!context)
        throw new Error("useClientContext must be used within a ClientProvider");
    return context;
};

export default ClientProvider;