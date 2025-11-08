"use client";
import { Product } from "@/types";
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

interface ProductContextProps {
    loading: boolean;
    products: Product[],
    error: string | null;
    addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "products"),
            (snapshot) => {
                setProducts(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data()} as Product)));
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching products:", err);
                setError("An error occured while fetching the products.");
                setLoading(false);
            }
        )

        return () => unsubscribe();
    }, []);

    const addProduct = useCallback(async (product: { name: string, designNumber: string, price: number }) => {
        try {
            setError(null);
            await addDoc(collection(db, "products"), {
                name: product.name.trim(),
                price: product.price,
                designNumber: product.designNumber.trim(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
        } catch (error) {
            console.error("Error adding product:", error);
            setError("An error occurred while adding product. Please check your network connection.");
        }
    }, []);

    const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
        try {
            const docRef = doc(db, "products", id);
            await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
        } catch (err) {
            console.error("Error updating product:", err);
            setError("An error occurred while updating product info.");
        }
    }, []);

    const deleteProduct = useCallback(async (id: string) => {
        try {
            const docRef = doc(db, "products", id);
            await deleteDoc(docRef);
        } catch (err) {
            console.error("Error deleting product:", err);
            setError("An error occurred while deleting product.");
        }
    }, []);

    return (
        <ProductContext.Provider
            value={{
                products,
                addProduct,
                updateProduct,
                deleteProduct,
                loading,
                error,
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}

export const useProductContext = (): ProductContextProps => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }
    return context;
}

export default ProductProvider;