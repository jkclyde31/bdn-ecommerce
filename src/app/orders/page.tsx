import { wixClientServer } from "../../../lib/wixClientServer";

export default async function Orders() {
  try {
    // Get the Wix client instance
    const wixClient = await wixClientServer();

    // Query the "Orders" collection
    const ordersData = await wixClient.items
      .query("Orders")
      .find();
    
    console.log("Orders retrieved: ", ordersData.items);

    return (
      <div className="container mx-auto py-12 space-y-8">
        <h1>Orders</h1>
        <div>
          {ordersData.items && ordersData.items.length > 0 ? (
            ordersData.items.map((order) => (
              <div key={order._id} className="border p-4 my-2">
                <p>Order ID: {order._id}</p>
                <p>Customer Name: {order.customerName}</p>
                <p>Products Ordered: {order.products}</p>
              </div>
            ))
          ) : (
            <p>No orders found</p>
          )}
        </div>
      </div>
    );
  } catch (error: unknown) {
    // Properly type the error and safely access its properties
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error("Error fetching orders: ", errorMessage);
    
    return (
      <div className="container mx-auto py-12 space-y-8">
        <h1>Orders</h1>
        <p>Error loading orders: {errorMessage}</p>
      </div>
    );
  }
}