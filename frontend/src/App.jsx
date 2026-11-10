
import { useEffect, useState } from "react";

import ProductForm from "./Components/productForm";
import ProductList from "./Components/productList";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from "./services/productService";

function App() {

  const [products, setProducts] = useState([]);

  const [editProduct, setEditProduct] = useState(null);

  const [source, setSource] = useState("");

  // GET ALL PRODUCTS
  const loadProducts = async () => {
    try {
      const response = await getProducts();

      setProducts(response.data.data);
      setSource(response.data.source);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ADD / UPDATE PRODUCT
  const handleSubmit = async (formData) => {
    try {
      if (editProduct) {
        await updateProduct(editProduct._id, formData);
      } else {
        await addProduct(formData);
      }

      setEditProduct(null);

      await loadProducts();

    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // EDIT PRODUCT
  const handleEdit = (product) => {
    setEditProduct(product);
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setEditProduct(null);
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);

      if (editProduct?._id === id) {
        setEditProduct(null);
      }

      await loadProducts();

    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>Product Management - MERN + Redis</h1>

      <ProductForm
        onSubmit={handleSubmit}
        editProduct={editProduct}
        onCancel={handleCancel}
      />

      <hr />

      <ProductList
        products={products}
        source={source}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

    </div>
  );
}

export default App;
