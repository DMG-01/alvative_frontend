import axios from "axios";

interface CheckoutProps {
  amount: number | null;
  email: string; // logged-in user email
  onCancel: () => void;
}

const baseUrl = "https://alvative-backend.onrender.com";

// Initialize a new transaction
const initializeTx = async (email: string, amount: number) => {
  try {
    const response: any = await axios.post(`${baseUrl}/initialize`, {
      email,
      amountToCharge: amount,
    });

    const authorizationUrl = response.data.data.data.authorization_url;
    console.log("Redirecting to Paystack:", authorizationUrl);

    // Redirect to Paystack payment page
    window.location.href = authorizationUrl;
  } catch (error: any) {
    console.error("Initialization error:", error.response?.data || error.message);
    alert("Failed to initialize transaction. Check console for details.");
  }
};

// Attempt to charge using saved authorization
const chargeAuth = async (email: string, amount: number) => {
  if (!amount || amount <= 0) {
    alert("Invalid amount");
    return;
  }

  try {
    const response = await axios.post(
      `${baseUrl}/chargeAuthorization?email=${email}`,
      { amount },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 200) {
      alert("Charge successful!");
      console.log("Charge response:", response.data);
    }
  } catch (error: any) {
    console.warn("Charge failed, initializing transaction instead...", error.response?.data || error.message);
    // If charging fails (no auth_code), initialize a new transaction
    await initializeTx(email, amount);
  }
};

function Checkout({ amount, email, onCancel }: CheckoutProps) {
  const handleCheckout = () => {
    if (!email) {
      alert("User not logged in");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please select a valid amount");
      return;
    }

    // Try charging first; if it fails, fallback to initializing a new transaction
    chargeAuth(email, amount);
  };

  return (
    <div className="checkout-container">
      <div className="checkoutHead">
        <h3>Checkout</h3>
      </div>

      <div className="paymentMethod">
        <div>
          <h2>Payment</h2>
        </div>

        <div className="paymentList">
          <div className="left">
            <p>Logo</p>
            <p>Paystack</p>
          </div>
          <div className="right">
            <input type="radio" value="paystack" defaultChecked />
          </div>
        </div>

        <div className="checkAmount">
          <p>Amount: #{amount ?? 0}</p>
        </div>

        <button className="checkout-button" onClick={handleCheckout}>
          Pay
        </button>

        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Checkout;
