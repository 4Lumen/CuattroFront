import { useAppContext } from '../context/AppContext';
import { Item } from '../types';
import carrinhoService from '../services/carrinhoService';
import itemCarrinhoService from '../services/itemCarrinhoService';

export const useCart = () => {
  const { state, dispatch } = useAppContext();
  const { user, cart } = state;

  const addToCart = async (item: Item, quantity: number = 1) => {
    if (!user) {
      throw new Error('Você precisa estar logado para adicionar itens ao carrinho');
    }

    try {
      let currentCart = cart;

      if (!currentCart) {
        currentCart = await carrinhoService.createCarrinho({ 
          usuarioId: user.id,
          dataCriacao: new Date().toISOString(),
          status: 0,
          itensCarrinho: []
        });
        dispatch({ type: 'SET_CART', payload: currentCart });
      }

      if (!currentCart) {
        throw new Error('Erro ao criar carrinho');
      }

      const itemCarrinho = await itemCarrinhoService.addItemToCart({
        carrinhoId: currentCart.id,
        itemId: item.id,
        quantidade: quantity
      });

      dispatch({
        type: 'ADD_TO_CART',
        payload: { item, quantity }
      });

      return itemCarrinho;
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!cart) {
      throw new Error('Carrinho não encontrado');
    }

    try {
      const itemCarrinho = cart.itensCarrinho?.find(item => item.itemId === itemId);
      
      if (itemCarrinho) {
        await itemCarrinhoService.removeItemFromCart(cart.id, itemId);
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
      }
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      throw error;
    }
  };

  const getItemQuantity = (itemId: number): number => {
    if (!cart || !cart.itensCarrinho) return 0;
    const item = cart.itensCarrinho.find(item => item.itemId === itemId);
    return item ? item.quantidade : 0;
  };

  const getCartTotal = (): number => {
    if (!cart || !cart.itensCarrinho) return 0;
    return cart.itensCarrinho.reduce((total, item) => {
      const itemPrice = state.items.find(i => i.id === item.itemId)?.preco || 0;
      return total + (itemPrice * item.quantidade);
    }, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    getItemQuantity,
    getCartTotal
  };
};

export default useCart; 