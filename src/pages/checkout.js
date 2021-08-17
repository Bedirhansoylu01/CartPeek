import Image from "next/image";
import Navbar from "../components/Navbar";

function Checkout() {
  return (
    <div className="bg-gray-100">
      <Navbar />
      <main className="lg:flex max-w-2xl mx-auto">
        {/*Left*/}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">Following Products</h1>

          </div>
        </div>

        {/*Right*/}
        <div></div>
      </main>
    </div>
  );
}

export default Checkout;
