// App.tsx
import { useState } from "react";
import Card from "./components/card";
import Checkout from "./components/checkout";
import LoginModal from "./pages/loginModal";

function App() {
  const [amount, setAmount] = useState<number | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);

  // When user selects a plan
  const handleSetAmount = (price: number) => {
    setAmount(price);

    if (!loggedInEmail) {
      setIsLoginOpen(true); // Prompt login if not logged in
    } else {
      setIsCheckoutOpen(true); // Open checkout if logged in
    }
  };

  // Close checkout modal
  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  // Handle successful login
  const handleLoginSuccess = (email: string) => {
    setLoggedInEmail(email);
    setIsLoginOpen(false);

    // Automatically open checkout if amount is already selected
    if (amount) {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <>
      {/* Main content */}
      <div className={isCheckoutOpen || isLoginOpen ? "content-wrapper blurred" : "content-wrapper"}>
        <div className="heading">
          <h1>
            Simple & Transparent Pricing
            <br /> for all business sizes
          </h1>
        </div>

        <div className="billingNavigation">
          <div>
            <button>Monthly billing</button>
          </div>
          <div>
            <button>Annual Billing</button>
          </div>
        </div>

        <div className="allCards">
          <Card plan="Basic plan" planAmount={5000} onSelect={handleSetAmount} />
          <Card plan="Business plan" planAmount={15000} onSelect={handleSetAmount} />
          <Card plan="Enterprise plan" planAmount={25000} onSelect={handleSetAmount} />
        </div>
      </div>

      {/* Checkout modal */}
      {isCheckoutOpen && loggedInEmail && (
        <div className="modal-overlay">
          <Checkout
            amount={amount}
            email={loggedInEmail}
            onCancel={handleCloseCheckout}
          />
        </div>
      )}

      {/* Login modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default App;
