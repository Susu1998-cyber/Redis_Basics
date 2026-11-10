
import { useEffect, useState } from "react";

function ProductForm({ onSubmit, editProduct, onCancel }) {

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: ""
  });

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        price: editProduct.price,
        description: editProduct.description || "",
        category: editProduct.category || ""
      });
    }
  }, [editProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      price: Number(form.price)
    });

    setForm({
      name: "",
      price: "",
      description: "",
      category: ""
    });
  };

  return (
    <div>
      <h3>
        {editProduct ? "Edit Product" : "Add Product"}
      </h3>

      <form onSubmit={handleSubmit}>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editProduct ? "Update Product" : "Add Product"}
        </button>

        {editProduct && (
          <button
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}

      </form>
    </div>
  );
}

export default ProductForm;
