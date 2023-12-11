import { onRequest } from "firebase-functions/v2/https";
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import Stripe from "stripe";
import admin from "firebase-admin";
import firebaseConfig from "./firebase";

admin.initializeApp(firebaseConfig);
const db = admin.firestore();

const stripe = new Stripe(process.env.STRIPE_SECRET?.toString() || "", {
  apiVersion: "2023-08-16",
});

const app = express();
app.use(cors({ origin: "*" }));

app.post("/stripeLogin", async (req: Request, res: Response) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).send("Unauthorized");
    }

    const idToken = header.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const stripeRef = await db.collection("customers").doc(uid).get();
    const stripeRecord = stripeRef.data();

    if (stripeRecord && stripeRecord.stripeId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeRecord.stripeId,
        return_url: `${req.body.origin}/profile`,
      });

      return res.send({ success: true, sessionUrl: session.url });
    } else {
      return res.send({ success: false });
    }
  } catch (error) {
    console.log({ error });
    return res.send({ success: false });
  }
});

app.post(`/cancelSubscription/:subId`, async (req: Request, res: Response) => {
  try {
    const subscription = await stripe.subscriptions.update(req.params.subId, {
      cancel_at_period_end: true,
    });
    console.log({ subscription });
    return res.send({ success: true });
  } catch (error) {
    console.log({ error });
    return res.send({ success: false });
  }
});

export const api = onRequest(app);
