
function ProductList({
  products,
  source,
  onEdit,
  onDelete
}) {
  return (
    <div>
      <h3>Product List</h3>

      <p>
        Data Source: <strong>{source}</strong>
      </p>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>

                <td>{product.price}</td>

                <td>{product.description}</td>

                <td>{product.category}</td>

                <td>
                  <button
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
