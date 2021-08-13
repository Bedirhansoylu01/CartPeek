import Head from "next/head";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import ProductFeed from "../components/ProductFeed";

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
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json() 
    );

    return {
      props: {
        products
      }
    }

}