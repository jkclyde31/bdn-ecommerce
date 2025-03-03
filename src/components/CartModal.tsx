"use client";

import Image from "next/image";
import { useCartStore } from "../../hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "../../hooks/useWixClient";
import { useEffect, useRef } from 'react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleCheckout = async () => {
    console.log(cart);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 px-4 sm:pt-20">
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div 
        ref={modalRef}
        className="w-full sm:w-96 rounded-lg shadow-xl bg-white flex flex-col z-20 max-h-[85vh] overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-5 border-b border-gray-100 bg-white sticky top-0">
          <h2 className="text-lg font-medium">Your Cart</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow overflow-y-auto">
          {!cart.lineItems ? (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300 mb-4">
                <path d="M8 12L8 8C8 5.79086 9.79086 4 12 4V4C14.2091 4 16 5.79086 16 8L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3.69435 12.6678C3.83942 10.9269 3.91196 10.0565 4.48605 9.52824C5.06013 9 5.9336 9 7.68053 9H16.3195C18.0664 9 18.9399 9 19.514 9.52824C20.088 10.0565 20.1606 10.9269 20.3057 12.6678L20.8195 18.8339C20.8845 19.6686 20.917 20.0859 20.7227 20.3888C20.5284 20.6916 20.1141 20.8278 19.2855 21.1L18.1213 21.4944C17.6797 21.6339 17.459 21.7037 17.2281 21.7037H6.77192C6.54103 21.7037 6.32028 21.6339 5.87878 21.4944L4.71451 21.1C3.88594 20.8278 3.47165 20.6916 3.27735 20.3888C3.08306 20.0859 3.11553 19.6686 3.18047 18.8339L3.69435 12.6678Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <p className="text-gray-500">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex flex-col divide-y divide-gray-100">
                {cart.lineItems.map((item) => (
                  <div className="py-4 first:pt-0 flex gap-3" key={item._id}>
                    {/* Product Image */}
                    <div className="flex-shrink-0 rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                      {item.image && (
                        <Image
                          src={wixMedia.getScaledToFillImageUrl(
                            item.image,
                            80,
                            80,
                            {}
                          )}
                          alt={item.productName?.original || "Product"}
                          width={80}
                          height={80}
                          className="object-cover h-full w-full"
                        />
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex flex-col flex-grow min-w-0 gap-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm text-gray-900 truncate pr-2">
                          {item.productName?.original}
                        </h3>
                        <div className="font-medium text-sm">
                          ₱{item.price?.amount}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {item.availability?.status}
                      </div>
                      
                      {/* Quantity and Remove */}
                      <div className="mt-auto flex justify-between items-center pt-2">
                        <div className="flex items-center bg-gray-50 rounded-md px-2 py-1">
                          <span className="text-xs text-gray-600">
                            Qty: {item.quantity}
                          </span>
                          {item.quantity && item.quantity > 1 && (
                            <span className="ml-1 text-xs text-green-600">
                              × {item.quantity}
                            </span>
                          )}
                        </div>
                        
                        <button
                          className="text-xs text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                          disabled={isLoading}
                          onClick={() => removeItem(wixClient, item._id!)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                            <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16M10 12V16M14 12V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Cart Footer */}
        {cart.lineItems && (
          <div className="border-t border-gray-100 p-5 bg-gray-50">
            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₱{(cart as any).subtotal?.amount || "0.00"}</span>
              </div>
              
              <p className="text-xs text-gray-500 pb-2">
                Shipping and taxes calculated at checkout.
              </p>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="py-2.5 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  View Cart
                </button>
                <button
                  className="py-2.5 px-4 rounded-md bg-green-700 text-white hover:bg-green-800 transition-colors disabled:cursor-not-allowed disabled:opacity-75 text-sm font-medium"
                  disabled={isLoading}
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;