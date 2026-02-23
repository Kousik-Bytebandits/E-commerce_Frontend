const ProductCard = ({ product }) => {
  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      <h4>{product.name}</h4>
      <p>₹{product.price}</p>
      <button>Add to cart</button>
    </div>
  );
};

export default ProductCard;
