import { useState } from "react";
import Card from "../components/card";
import Checkout from "../components/checkout";
import LoginModal from "./loginModal";

function App() {
  const [amount, setAmount] = useState<number | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null); // store logged-in email

  // Set amount and open checkout; check login
  const handleSetAmount = (price: number) => {
    setAmount(price);

    if (!loggedInEmail) {
      // Open login modal first if user not logged in
      setIsLoginOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  // Called after login success
  const handleLoginSuccess = (email: string) => {
    setLoggedInEmail(email);
    setIsLoginOpen(false);
    setIsCheckoutOpen(true); // open checkout after login
  };

  return (
    <>
      {/* Main content wrapper */}
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

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && loggedInEmail && (
        <div className="modal-overlay">
          <Checkout
            amount={amount}
            email={loggedInEmail} // pass logged-in email here
            onCancel={handleCloseCheckout}
          />
        </div>
      )}
    </>
  );
}

export default App;
