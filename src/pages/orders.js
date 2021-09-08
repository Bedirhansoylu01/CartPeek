import { getSession, useSession } from "next-auth/client";
import Navbar from "../components/Navbar";
import fdb from "../../firebase";
import Order from "../components/Order";
import moment from "moment"

function Orders({ orders }) {
  const [session] = useSession();

  return (
    <div>
      <Navbar />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          You orders
        </h1>
        {session ? (
          <h2>{orders.length} orders</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}
        <div className="mt-5 space-y-4"></div>
        {orders?.map(
          ({ id, amount, amountShipping, items, timestamp, images }) => (
            <Order
              key={id}
              id={amount}
              amountShipping={amountShipping}
              items={items}
              timestamp={timestamp}
              images={images}
            />
          )
        )}
      </main>
    </div>
  );
}

export default Orders;

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const session = await getSession(context); //must be await
 
  if (!session) {
    return {
      props: {session},
    };
  }
  //firestore data
  const stripeOrders = await fdb
    .collection("users")
    .doc(await session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  //Stripe data
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  );
  return {
    props: {
      orders,
    },
  };
}

