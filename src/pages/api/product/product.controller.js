import productService from "../../services/product.service.js";

class productController {
  async productByID(id) {
    const produto = await productService.getProductsById(id);
    return produto;
  }
  async getAllProducts(req, res) {
    const product = await productService.getAllProducts(req, res);
    res.json(product);
  }
  async getComments(id) {
    const comment = await productService.getComments(id);
    return comment;
  }
}

export default new productController();
