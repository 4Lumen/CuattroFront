import React, { useEffect, useState } from 'react';
import ItemService from '../services/itemService';
import { useAppContext } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import CarrinhoService from '../services/carrinhoService';
import ItemCarrinhoService from '../services/itemCarrinhoService';

const CustomerPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  interface CartItem {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagemUrl?: string;
  }

  const { state, dispatch } = useAppContext();
  const { state: cartState, dispatch: cartDispatch } = useCart();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await ItemService.getItems();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleAddToCart = async (item: any) => {
    try {
      // Check if user has an active cart
      let carrinho = state.cart;
      if (!carrinho && state.user?.id) {
        // Create new cart if none exists
        carrinho = await CarrinhoService.createCarrinho({
          usuarioId: state.user.id,
          dataCriacao: new Date().toISOString(),
          status: 0 // Active status
        });
        dispatch({ type: 'ADD_TO_CART', payload: carrinho });
      } else if (!state.user?.id) {
        console.error('User ID is required to create a cart');
        return;
      }

      if (!carrinho) {
        console.error('No cart available');
        return;
      }

      // Add item to cart
      await ItemCarrinhoService.addItemToCart({
        carrinhoId: carrinho.id,
        itemId: item.id,
        quantidade: 1
      });

      cartDispatch({ type: 'ADD_ITEM', payload: item });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="customer-page">
      <h2>Customer Ordering</h2>
      <div className="menu-container">
        {items.map(item => (
          <div key={item.id} className="menu-item">
            <img src={item.imagemUrl} alt={item.nome} className="item-image" />
            <div className="item-details">
              <h3>{item.nome}</h3>
              <p>{item.descricao}</p>
              <p className="price">R${item.preco.toFixed(2)}</p>
              <button 
                onClick={() => handleAddToCart(item)}
                className="add-to-cart"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-container">
        <h3>Your Cart</h3>
        {cartState.items.length > 0 ? (
          <>
            <ul>
              {cartState.items.map((cartItem) => (
                <li key={cartItem.item.id} className="cart-item">
                  <span>{cartItem.item.nome}</span>
                  <span>Qty: {cartItem.quantity}</span>
                  <span>R${(cartItem.item.preco * cartItem.quantity).toFixed(2)}</span>
                  <button 
                    onClick={() => cartDispatch({ type: 'REMOVE_ITEM', payload: cartItem.item.id })}
                    className="remove-item"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              Total: R${cartState.total.toFixed(2)}
            </div>
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
