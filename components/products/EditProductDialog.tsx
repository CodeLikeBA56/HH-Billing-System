"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProductContext } from "@/contexts/ProductProvider";
import { useNotification } from "@/contexts/NotificationProvider";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const EditProductDialog: React.FC<EditProductDialogProps> = React.memo(({ open, onOpenChange, product }) => {
    const { updateProduct } = useProductContext();
    const { pushNotification } = useNotification();

    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [designNumber, setDesignNumber] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      if (product) {
        setName(product.name);
        setPrice(product.price);
        setDesignNumber(product.designNumber);
      }
    }, [product]);

    const handleUpdateProduct = async () => {
      if (!product) return;

      if (!name.trim() || !designNumber.trim()) {
        return pushNotification("warning", "Name and design number are required.");
      }

      if (price <= 0) {
        return pushNotification("warning", "Price must be a positive number.");
      }

      try {
        setSubmitting(true);
        await updateProduct(product.uid as string, {
          name: name.trim(),
          designNumber: designNumber.trim(),
          price: Number(price),
        });
        pushNotification("success", "Product updated successfully.");
        onOpenChange(false);
      } catch {
        pushNotification("error", "Failed to update product.");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-4">
            <Input
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Design number"
              value={designNumber}
              onChange={(e) => setDesignNumber(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleUpdateProduct} disabled={submitting}>
              {submitting ? "Updating..." : "Update Product"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

EditProductDialog.displayName = "EditProductDialog";

export default EditProductDialog;