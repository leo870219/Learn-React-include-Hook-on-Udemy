import React, { useState, useEffect, useMemo } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import axios from "commons/axios";
import Layout from "Layout";
import CartItem from "components/CartItem";
import { formatPrice } from "commons/helper";

const Cart = () => {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const user = global.auth.getUser() || {};
    axios.get(`/carts?userOd=${user.email}`).then((res) => setCarts(res.data));
    axios.get("/carts").then((res) => setCarts(res.data));
  }, []); //useEffect有兩個參數值，如有設定第二個參數值[],就會根據[]中條件符合才執行，如果為空會在網頁加載成功時刷新

  const totalPrice = useMemo(() => {
    const totalPrice = carts
      .map((cart) => cart.mount * parseInt(cart.price))
      .reduce((a, value) => a + value, 0);
    return formatPrice(totalPrice);
  }, [carts]);

  const updateCart = (cart) => {
    const newCarts = [...carts];
    const _index = newCarts.findIndex((c) => c.id === cart.id);
    newCarts.splice(_index, 1, cart);
    setCarts(newCarts);
  };

  const deleteCart = (cart) => {
    const _carts = carts.filter((c) => c.id !== cart.id);
    setCarts(_carts);
  };

  return (
    <Layout>
      <div className="cart-page">
        <span className="cart-title">Shooping Cart</span>
        <div className="cart-list">
          <TransitionGroup component={null}>
            {carts.map((cart) => (
              <CSSTransition classNames="cart-item" timeout={300} key={cart.id}>
                <CartItem
                  key={cart.id}
                  cart={cart}
                  updateCart={updateCart}
                  deleteCart={deleteCart}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
        {carts.length === 0 ? <p className="no-cart">NO GOODS</p> : ""}

        <div className="cart-total">
          Total:
          <span className="total-price">{totalPrice}</span>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
