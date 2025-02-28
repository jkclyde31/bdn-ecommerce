"use client";


import React from 'react'
import { WixClientContext } from '@/context/wixContext'
import { useWixClient } from '../../../hooks/useWixClient';
import { useEffect } from 'react';

const page =  () => {

  const wixClient = useWixClient()

  useEffect(() => {
    console.log("Wix Client:", wixClient);
    const getOrders = async () => {
      try {
        const orders = await wixClient.orders.queryDataItems({
          dataCollectionId: "orders",
        });
        console.log("Orders", orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    getOrders();
  }, [wixClient]);




  return (
    <div>page</div>
  )
}

export default page