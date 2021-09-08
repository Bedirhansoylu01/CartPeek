import Head from "next/head";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import ProductFeed from "../components/ProductFeed";
import { getSession } from "next-auth/client";
export default function Home({products}) {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>CartPeek</title>
      </Head>
    <Navbar/>
    <main className="max-w-screen-2xl mx-auto">
    
    <Banner/>

    <ProductFeed products={products}/>

    </main>
    </div>
  );
}

export async function getServerSideProps(context){
  const session = await getSession(context)
  const response = await fetch("https://fakestoreapi.com/products")
  const products = await response.json();

    return {
      props: {
        products,
        session
      }
    }

}