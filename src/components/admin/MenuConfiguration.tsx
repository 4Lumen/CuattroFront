import React from 'react';
import { Grid } from '@mui/material';
import ItemList from './menu/ItemList';
import { Categoria } from '../../services/categoriaService';

export interface CreateMenuItem {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string | Categoria;
  imagemUrl?: string;
  categoriaId?: number;
}

export interface MenuItem extends CreateMenuItem {
  id: number;
  categoriaId: number;
}

const MenuConfiguration: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ItemList />
      </Grid>
    </Grid>
  );
};

export default MenuConfiguration;
