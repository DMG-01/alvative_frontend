import axios from "axios";
import { useState } from "react";

interface CheckoutProps {
  amount: number | null;
  email: string; // logged-in user email
  onCancel: () => void;
}

const baseUrl = "https://alvative-backend.onrender.com";

function Checkout({ amount, email, onCancel }: CheckoutProps) {
  const [buttonMessage, setButtonMessage] = useState("Pay");

  // Initialize a new transaction
  const initializeTx = async (email: string, amount: number) => {
    try {
      setButtonMessage("Redirecting...");
      const response: any = await axios.post(`${baseUrl}/initialize`, {
        email,
        amountToCharge: amount,
      });

      const authorizationUrl = response.data.data?.data?.authorization_url;

      if (!authorizationUrl) {
        console.error("Authorization URL missing:", response.data);
        alert("Payment initialization failed. Check console for details.");
        return;
      }

      console.log("Redirecting to Paystack:", authorizationUrl);
      window.location.href = authorizationUrl;
    } catch (error: any) {
      console.error("Initialization error:", error.response?.data || error.message);
      alert("Failed to initialize transaction. Check console for details.");
    } finally {
      setButtonMessage("Pay");
    }
  };

  // Attempt to charge using saved authorization
  const chargeAuth = async (email: string, amount: number) => {
    if (!amount || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      setButtonMessage("Charging...")
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
      console.warn(
        "Charge failed, initializing transaction instead...",
        error.response?.data || error.message
      );
      // If charging fails (no auth_code), initialize a new transaction
      await initializeTx(email, amount);
    }finally{
      setButtonMessage("Pay")
    }
  };

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
          {buttonMessage}
        </button>

        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Checkout;
