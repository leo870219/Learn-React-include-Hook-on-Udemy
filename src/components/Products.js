import React from "react";
import axios from "commons/axios";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ToolBox from "components/ToolBox";
import Product from "components/Product";
import Panel from "components/Panel";
import AddInventory from "components/AddInventor";

class Products extends React.Component {
  state = {
    //prodcuts經過篩選會更動，必須另外設sourcePooducts來提供完整資料對照更動後的資料
    products: [],
    sourcePooducts: [],
    cartNum: 0
  };

  toadd = () => {
    Panel.open({
      component: AddInventory,
      callback: data => {
        if (data) {
          this.add(data);
        }
        console.log(data);
      }
    });
  };

  add = product => {
    const _products = [...this.state.products];
    _products.push(product);
    const _sourcePooducts = [...this.state.sourcePooducts];
    _sourcePooducts.push(product);

    this.setState({
      products: _products,
      sourcePooducts: _sourcePooducts
    });
  };

  update = product => {
    const _products = [...this.state.products];
    const _index = _products.findIndex(p => p.id === product.id);
    _products.splice(_index, 1, product);
    const _sourcePooducts = [...this.state.sourcePooducts];
    const _sindex = _products.findIndex(p => p.id === product.id);
    _sourcePooducts.splice(_sindex, 1, product);

    this.setState({
      products: _products,
      sourcePooducts: _sourcePooducts
    });
  };

  delete = id => {
    const _products = this.state.products.filter(p => p.id !== id);
    const _sourcePooducts = this.state.sourcePooducts.filter(p => p.id !== id);
    this.setState({
      products: _products,
      sourcePooducts: _sourcePooducts
    });
  };

  componentDidMount() {
    axios.get("/products").then(response => {
      this.setState({
        products: response.data,
        sourcePooducts: response.data
      });
    });
    this.updateCartNum();
  }

  search = text => {
    //1.拿一個新的陣列，var、let宣告可改變，const不可變
    let _products = [...this.state.sourcePooducts];

    //2.篩選條件丟出篩選過後的資料
    _products = _products.filter(p => {
      //name : Abcd text : ab 結果回傳 ['Ab']
      //text :'' 回傳 ["","","","",""]
      const matchArray = p.name.match(new RegExp(text, "gi"));
      return !!matchArray;
    });
    //3.根據骰選回傳值設定新的state
    this.setState({
      products: _products
    });
  };

  updateCartNum = async () => {
    const cartNum = await this.initCartNum();
    this.setState({
      cartNum: cartNum
    });
  };

  initCartNum = async () => {
    const res = await axios.get("/carts");
    const carts = res.data || [];
    const cartNum = carts
      .map(cart => cart.mount)
      .reduce((a, value) => a + value, 0);
    return cartNum;
  };

  render() {
    return (
      <div>
        <ToolBox search={this.search} cartNum={this.state.cartNum} />
        <div className="products">
          <div className="columns is-multiline is-desktop">
            <TransitionGroup component={null}>
              {this.state.products.map(p => {
                return (
                  <CSSTransition
                    classNames="product-fade"
                    timeout={300}
                    key={p.id}
                  >
                    <div className="column is-3" key={p.id}>
                      <Product
                        products={p}
                        update={this.update}
                        delete={this.delete}
                        updateCartNum={this.updateCartNum}
                      />
                    </div>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </div>
          <button className="button is-primary add-btn" onClick={this.toadd}>
            add
          </button>
        </div>
      </div>
    );
  }
}

export default Products;
