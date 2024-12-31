export default function PaymentInformation() {
    return (
        <>
            {/* Payment Information Section */}
            <h2 className="text-3xl font-bold mb-6">Payment Information</h2>
            <div className="payment-info mb-8">
                <div className="flex gap-4 mb-4">
                    <div className="flex items-center">
                        <input type="radio" id="credit-card" name="payment-method" className="mr-2" />
                        <label htmlFor="credit-card" className="text-lg">Credit Card (Stripe)</label>
                    </div>
                    <div className="flex items-center">
                        <input type="radio" id="paypal" name="payment-method" className="mr-2" />
                        <label htmlFor="paypal" className="text-lg">PayPal</label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-lg font-semibold" htmlFor="name-on-card">Name on card</label>
                    <input
                        type="text"
                        id="name-on-card"
                        className="w-full p-3 mt-2 border rounded-md"
                        placeholder="Full name as displayed on card"
                    />
                </div>
                <div className="mb-4">
                    <label className="text-lg font-semibold" htmlFor="card-number">Credit card number</label>
                    <input
                        type="text"
                        id="card-number"
                        className="w-full p-3 mt-2 border rounded-md"
                        placeholder="Enter credit card number"
                    />
                </div>
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label className="text-lg font-semibold" htmlFor="expiration">Expiration</label>
                        <input
                            type="text"
                            id="expiration"
                            className="w-full p-3 mt-2 border rounded-md"
                            placeholder="MM/YY"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-lg font-semibold" htmlFor="security-code">Security Code</label>
                        <input
                            type="text"
                            id="security-code"
                            className="w-full p-3 mt-2 border rounded-md"
                            placeholder="CVV"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}