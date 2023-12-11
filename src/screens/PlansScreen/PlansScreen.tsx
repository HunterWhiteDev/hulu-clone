import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../slices/userSlice";
import db from "../../firebase";
import "./PlansScreen.css";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import moment from "moment/moment";
function PlansScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [sub, setSub] = useState<any>(null);
  const [loadingStripe, setLoadingStripe] = useState<null | string>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [cancelingPlan, setCancelingPlan] = useState(false);
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(false);

  const user = useSelector(selectUser);

  useEffect(() => {
    const getPlans = async () => {
      setLoadingPlans(true);
      let plans = [];

      const plansRef = collection(db, `products`);
      const q = query(plansRef, where("active", "==", true));
      const results = await getDocs(q);

      for (const item of results.docs) {
        const priceRef = collection(item.ref, "prices");
        const priceSnap = await getDocs(priceRef);
        for (const price of priceSnap.docs) {
          plans.push({ ...item.data(), priceId: price.id });
        }
      }
      setProducts(plans);
      setLoadingPlans(false);
    };

    getPlans();
  }, []);

  const getSubscription = async () => {
    const subRef = collection(db, `customers/${user.uid}/subscriptions`);
    const subs = await getDocs(subRef);
    for (const item of subs.docs) {
      const subId = item.id;
      const priceId: string = item.data().items[0].price.id;
      setSub({ priceId, subId, ...item.data() });
    }
  };

  useEffect(() => {
    getSubscription();
  }, []);

  const loadCheckout = async (priceId: string) => {
    setLoadingStripe(priceId);

    const checkoutSessionsRef = collection(
      db,
      `customers/${user.uid}/checkout_sessions`
    );

    const sessionRecord = await addDoc(checkoutSessionsRef, {
      price: priceId,
      success_url: window.location.origin + "/profile?suc=true",
      cancel_url: window.location.origin + "/profile?fail=true",
    });

    const docRef = doc(
      db,
      `customers/${user.uid}/checkout_sessions/${sessionRecord.id}`
    );

    const unsubscribe = onSnapshot(docRef, async (doc) => {
      const { error, sessionId } = doc.data() as {
        error: any;
        sessionId: string;
      };

      if (error) {
        unsubscribe();
        alert(`An error has occured ${error.message}`);
      }

      if (sessionId) {
        unsubscribe();

        const stripe = await loadStripe(
          "pk_test_51IYcDDKF1qUCljWu7O3PftoCir5XPIzLHYnMZit3peWGBguURw2dnuv5m0CTgh9I6FX3Evlm7PYMj5O6bwOsa8t900gQtIDEtl"
        );
        stripe && stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  const generateUrl = async () => {
    setLoadingPaymentInfo(true);
    const headers = {
      Authorization: `Bearer ${user.userToken}`,
    };
    axios
      .post(
        `https://api-qs4yth6roa-uc.a.run.app/stripeLogin`,
        {
          origin: window.location.origin,
        },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          setLoadingPaymentInfo(false);
          window.location.href = response.data.sessionUrl;
        }
      })
      .catch((error) => {
        alert(JSON.stringify(error));
        console.error(error);
      });
  };

  const cancelSub = () => {
    setCancelingPlan(true);

    const docRef = doc(db, `customers/${user.uid}/subscriptions/${sub.subId}`);

    const unsubscribe = onSnapshot(docRef, async (doc: any) => {
      if (doc.data().cancel_at_period_end === true) {
        const subId = doc.id;
        const priceId = doc.data().items[0].price.id;
        setSub({ subId, priceId, ...doc.data() });
        unsubscribe();
      }
    });

    const headers = {
      Authorization: `Bearer ${user.userToken}`,
    };
    axios
      .post(
        `https://api-qs4yth6roa-uc.a.run.app/cancelSubscription/${sub.subId}`,
        { headers }
      )
      .then(() => setCancelingPlan(false))
      .catch((error) => {
        alert(JSON.stringify(error));
        console.error(error);
      });
  };

  return (
    <div
      className="plansScreen"
      style={
        loadingPlans
          ? { display: "flex", justifyContent: "center", alignItems: "center" }
          : {}
      }
    >
      {loadingPlans ? (
        <div style={{ fontSize: "36px", marginTop: "10px" }}>
          <FontAwesomeIcon
            className="plansScreen__loading"
            icon={faCircleNotch}
          />
        </div>
      ) : (
        products.map((product) => {
          return (
            <>
              <div key={product.id} className="plansScreen__plan">
                <div className="plansScreen__info">
                  <h5>{product.name}</h5>
                  <h6>{product.description}</h6>
                </div>

                {sub?.priceId === product?.priceId &&
                sub.cancel_at_period_end !== true ? (
                  <div>
                    <button
                      style={{ backgroundColor: "gray" }}
                      onClick={cancelSub}
                    >
                      {cancelingPlan && (
                        <FontAwesomeIcon
                          className="plansScreen__loading"
                          icon={faCircleNotch}
                        />
                      )}
                      Cancel Subscription
                    </button>
                  </div>
                ) : null}

                {!sub && (
                  <div>
                    <button onClick={() => loadCheckout(product?.priceId)}>
                      {loadingStripe === product?.priceId && (
                        <FontAwesomeIcon
                          className="plansScreen__loading"
                          icon={faCircleNotch}
                        />
                      )}
                      Subscribe
                    </button>
                  </div>
                )}
              </div>
              {sub?.priceId === product?.priceId && sub.cancel_at_period_end ? (
                <p className="plansScreen__subStatus">
                  Your subscription will expire on
                  {" " +
                    moment.unix(sub?.cancel_at.seconds).format("MMMM Do YYYY")}
                </p>
              ) : (
                <>
                  {sub?.priceId === product?.priceId && (
                    <p className="plansScreen__subStatus">
                      Your subscription will renew on
                      {" " +
                        moment
                          .unix(sub?.current_period_end.seconds)
                          .format("MMMM Do YYYY")}
                    </p>
                  )}
                </>
              )}
            </>
          );
        })
      )}

      {sub && !loadingPlans && (
        <div
          style={{ marginTop: "1rem" }}
          className="plansScreen__manageSubs"
          onClick={generateUrl}
        >
          Click here to manage payment information
          {loadingPaymentInfo && (
            <FontAwesomeIcon
              className="plansScreen__loading"
              icon={faCircleNotch}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PlansScreen;
