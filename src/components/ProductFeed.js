function ProductFeed({ products }) {
  return (
    <div>
      {products.map((products) => (
        <p>{products.title}</p>
      ))}
    </div>
  );
}

export default ProductFeed;
