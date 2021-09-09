import { buffer } from "micro";
import * as admin from "firebase-admin";


const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert({
        type:process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id:process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,        
        client_email:process.env.FIREBASE_CLIENT_EMAIL,
        client_id:process.env.FIREBASE_CLIENT_ID,
        auth_uri:process.env.FIREBASE_AUTH_URI,
        token_uri:process.env.FIREBASE_TOKEN_URI, 
        auth_provider_x509_cert_url:process.env.FIREBASE_AUTH_PROVIDER, 
        client_x509_cert_url: process.env.FIREBASE_CLIENT
      }),
    })
  : admin.app();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfilOrder = async (session) => {
  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders").doc(session.id).set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCCESS: Order ${session.id} had been added to the DB`);
    });
};


export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];
    
    let event;

    // Verify that The Event posted came from STRIPE
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log("ERROR", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      return fulfilOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true, //for STRIPE
  },
};
