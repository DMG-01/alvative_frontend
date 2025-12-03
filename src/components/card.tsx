interface CardProps {
  plan: string;
  planAmount: number;
  onSelect: (price: number) => void; // callback from parent
}

function Card({ plan, planAmount, onSelect }: CardProps) {
  return (
    <div className="eachCard">
      <div className="planName">
        <h3>{plan}</h3>
      </div>

      <div className="pricePlan">
        <h2>{`#${planAmount}`}</h2>
        <p>per month</p>
      </div>

      <div className="getStartedButton">
        <button onClick={() => onSelect(planAmount)}>Get Started</button>
      </div>

      <hr />

      <div className="features">
        <h3>FEATURES</h3>
        <div className="featureHeading">
          <p>{`Everything in our ${plan} plus`}</p>
        </div>
        <div className="featureList">
          <div>
            <p>
              <i className="bi bi-check-circle-fill"></i>
            </p>
            <p>200+ integration</p>
          </div>

          <div>
            <p>
              <i className="bi bi-check-circle-fill"></i>
            </p>
            <p>Advanced reporting analysis</p>
          </div>

          <div>
            <p>
              <i className="bi bi-check-circle-fill"></i>
            </p>
            <p>Up to 10 individual users</p>
          </div>

          <div>
            <p>
              <i className="bi bi-check-circle-fill"></i>
            </p>
            <p>20GB individual data each user</p>
          </div>

          <div>
            <p>
              <i className="bi bi-check-circle-fill"></i>
            </p>
            <p>Basic chat and email support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
