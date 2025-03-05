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
        <h1 className="text-2xl font-bold">Orders</h1>
        
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="p-2 border rounded-md"
          />
          <select className="p-2 border rounded-md">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        {/* Orders list */}
        <div className="grid gap-4">
          {ordersData.items && ordersData.items.length > 0 ? (
            ordersData.items.map((order) => (
              <div key={order._id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                    <p className="text-gray-600">Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full
                    ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                    order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'}`}>
                    {order.orderStatus || 'Processing'}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Customer Information</h3>
                    <p>Name: {order.customerName}</p>
                    <p>Email: {order.email}</p>
                    <p>Phone: {order.phoneNumber}</p>
                    <p>Address: {order.address}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Order Details</h3>
                    <p>Products: {order.productsOrdered}</p>
                    <p>Quantity: {order.productQuantity}</p>
                    <p className="font-semibold mt-2">Total Amount: ${order.totalAmount}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    Update Status
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 bg-gray-50 rounded-lg">No orders found</p>
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
        <h1 className="text-2xl font-bold text-red-600">Orders</h1>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <p className="text-red-600">Error loading orders: {errorMessage}</p>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    );
  }
}