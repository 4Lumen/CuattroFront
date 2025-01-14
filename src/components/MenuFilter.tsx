import React from 'react';
import { List, ListItem, ListItemText, Divider, Paper } from '@mui/material';

interface MenuFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  'Todos',
  'Entradas',
  'Pratos Principais',
  'Sobremesas',
  'Bebidas',
  'Vegetariano',
  'Vegano'
];

const MenuFilter: React.FC<MenuFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <Paper elevation={2} className="sticky top-20">
      <List component="nav" aria-label="menu categories">
        {categories.map((category, index) => (
          <React.Fragment key={category}>
            <ListItem
              className={`cursor-pointer hover:bg-gray-100 ${
                selectedCategory === category ? 'bg-primary-50 text-primary-600' : ''
              }`}
              onClick={() => onSelectCategory(category)}
            >
              <ListItemText primary={category} />
            </ListItem>
            {index < categories.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default MenuFilter; 