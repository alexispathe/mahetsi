'use client'

export default function UserAddress() {
  return (
    <div className="user-details-container bg-white py-10 px-6 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
      <div className="contact-info mb-8">
        <label className="text-lg font-semibold" htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          className="w-full p-3 mt-2 border rounded-md" 
          placeholder="you@example.com" 
        />
        <div className="mt-2">
          <label className="text-sm">
            <input type="checkbox" /> Keep me updated with your latest news and offers
          </label>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6">Shipping Address</h2>
      <div className="shipping-address mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="text-lg font-semibold" htmlFor="first-name">First name</label>
            <input 
              type="text" 
              id="first-name" 
              className="w-full p-3 mt-2 border rounded-md" 
              placeholder="First name" 
            />
          </div>
          <div className="flex-1">
            <label className="text-lg font-semibold" htmlFor="last-name">Last name</label>
            <input 
              type="text" 
              id="last-name" 
              className="w-full p-3 mt-2 border rounded-md" 
              placeholder="Last name" 
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold" htmlFor="address">Address</label>
          <input 
            type="text" 
            id="address" 
            className="w-full p-3 mt-2 border rounded-md" 
            placeholder="123 Some Street Somewhere" 
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold" htmlFor="country">Country</label>
          <select id="country" className="w-full p-3 mt-2 border rounded-md">
            <option value="">Please Select...</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold" htmlFor="state">State</label>
          <select id="state" className="w-full p-3 mt-2 border rounded-md">
            <option value="">Please Select...</option>
            <option value="California">California</option>
            <option value="New York">New York</option>
            <option value="Texas">Texas</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="text-lg font-semibold" htmlFor="zipcode">Zip/Post Code</label>
          <input 
            type="text" 
            id="zipcode" 
            className="w-full p-3 mt-2 border rounded-md" 
            placeholder="Zip/Post Code" 
          />
        </div>
        <div className="mt-4">
          <label className="text-sm">
            <input type="checkbox" /> Use for billing address
          </label>
        </div>
      </div>

     
    </div>
  );
}
