import React, { useEffect, useState } from 'react';
import ItemService, { Item } from '../services/itemService';

const { getItems } = ItemService;

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (err) {
        setError('Failed to load items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {items.map(item => (
        <div key={item.id} className="border rounded-lg p-4 shadow-md">
          {item.imagemUrl && (
            <img 
              src={item.imagemUrl} 
              alt={item.nome}
              className="w-full h-48 object-cover mb-4 rounded"
            />
          )}
          <h3 className="text-xl font-semibold mb-2">{item.nome}</h3>
          <p className="text-gray-600 mb-4">{item.descricao}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">
              R$ {item.preco.toFixed(2)}
            </span>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {/* TODO: Add to cart */}}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
