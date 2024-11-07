class ProductService {
  static async getProduct(id) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  static async getRelatedProducts(categoryId, excludeId) {
    try {
      const response = await fetch(
        `/api/products/related?category=${categoryId}&exclude=${excludeId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to fetch related products: ${error.message}`);
    }
  }
}

export default ProductService;
