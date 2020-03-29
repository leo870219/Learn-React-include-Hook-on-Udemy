import React from "react";
import axios from "commons/axios";
import { toast } from "react-toastify";
import Panel from "components/Panel";
import { formatPrice } from "commons/helper";
import EditInventor from "components/EditInventor";
class Product extends React.Component {
  toEdit = () => {
    Panel.open({
      component: EditInventor,
      props: {
        product: this.props.products,
        deleteProduct: this.props.delete
      },
      callback: data => {
        if (data) {
          this.props.update(data);
        }
      }
    });
  };

  addCart = async () => {
    try {
      const { id, name, image, price } = this.props.products;

      const res = await axios.get(`/carts?productId=${id}`);

      const carts = res.data;
      if (carts && carts.length > 0) {
        const cart = carts[0];
        cart.mount += 1;
        await axios.put(`/carts/${cart.id}`, cart);
      } else {
        const cart = {
          productId: id,
          name,
          image,
          price,
          mount: 1
        };
        await axios.post("/carts", cart);
      }
      toast.success("Add Cart Success");
      this.props.updateCartNum();
    } catch (error) {
      toast.success("Add Cart Failed");
    }
  };
  render() {
    const _pClass = {
      available: "product",
      unavailable: "product out-stock"
    };
    const { name, image, tags, price, status } = this.props.products;
    return (
      <div className={_pClass[status]}>
        <div className="p-content">
          <div className="p-head has-text-right" onClick={this.toEdit}>
            <span className="icon edit-btn">
              <i className="fas fa-sliders-h"></i>
            </span>
          </div>
          <div className="img-wrapper">
            <div className="out-stock-text">OUT OF STOCK</div>
            <figure className="image is-4by3">
              <img src={image} alt={name} />
            </figure>
          </div>
          <p className="p-tags">{tags}</p>
          <p className="p-name">{name}</p>
        </div>
        <div className="p-footer">
          <p className="price">{formatPrice(price)}</p>
          <button
            className="add-cart"
            disabled={status === "unavailable"}
            onClick={this.addCart}
          >
            <i className="fas fa-shopping-cart"></i>
            <i className="fas fa-exclamation"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default Product;
