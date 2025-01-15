# Guia de Integração MinIO - Frontend

## Visão Geral
O backend utiliza MinIO para armazenamento de imagens, fornecendo endpoints seguros para upload e gerenciamento de arquivos. Todas as operações requerem autenticação via Auth0 e permissões adequadas.

## Endpoints Disponíveis

### Upload de Imagem
```http
POST /api/Item/{id}/imagem
Content-Type: multipart/form-data
Authorization: Bearer {token}
X-Auth0-Role: 2
```

#### Parâmetros
- `id`: ID do item para associar a imagem
- `imagem`: Arquivo de imagem (multipart/form-data)

#### Restrições e Validações
- **Tipos permitidos**: JPG, PNG, GIF
- **Tamanho máximo**: 5MB
- **Autenticação**: Token JWT válido
- **Autorização**: Role Admin (2)

#### Exemplo de Uso (React/TypeScript)
```typescript
interface UploadResponse {
  imagemUrl: string;
}

const uploadImage = async (itemId: number, file: File): Promise<string> => {
  // Validação no frontend
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    throw new Error('Tipo de arquivo não permitido. Use apenas JPG, PNG ou GIF.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Arquivo muito grande. O tamanho máximo permitido é 5MB.');
  }

  const formData = new FormData();
  formData.append('imagem', file);

  try {
    const response = await api.post<UploadResponse>(
      `/api/Item/${itemId}/imagem`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.imagemUrl;
  } catch (error) {
    console.error('Erro no upload:', error);
    if (error.response?.status === 404) {
      throw new Error('Endpoint de upload não encontrado. Verifique a URL correta.');
    }
    throw new Error('Erro ao fazer upload da imagem. Por favor, tente novamente.');
  }
};
```

### Resposta de Sucesso
```json
{
  "imagemUrl": "https://minio.4lumen.com/items/123/imagem.jpg"
}
```

### Erros Comuns
```json
// 400 Bad Request - Tipo de arquivo inválido
{
  "error": "Tipo de arquivo não permitido. Use apenas JPG, PNG ou GIF."
}

// 400 Bad Request - Arquivo muito grande
{
  "error": "Arquivo muito grande. O tamanho máximo permitido é 5MB."
}

// 401 Unauthorized - Token inválido
{
  "error": "Token de autenticação inválido ou expirado."
}

// 403 Forbidden - Sem permissão
{
  "error": "Usuário não tem permissão para realizar esta operação."
}

// 404 Not Found - Item não encontrado
{
  "error": "Item não encontrado"
}
```

## Componente de Upload
```tsx
import React, { useState } from 'react';
import { uploadImage } from '../services/itemService';

interface ImageUploadProps {
  itemId: number;
  onSuccess: (imageUrl: string) => void;
  onError: (error: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  itemId,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await uploadImage(itemId, file);
      onSuccess(imageUrl);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileChange}
        disabled={loading}
      />
      {loading && <span>Enviando...</span>}
    </div>
  );
};
```

## Considerações de Segurança
1. **HTTPS**: Todas as requisições devem ser feitas via HTTPS
2. **JWT**: Token deve ser válido e não expirado
3. **Roles**: Usuário deve ter role Admin (2)
4. **Validação**: Implementar validações tanto no frontend quanto no backend
5. **Sanitização**: Sempre sanitizar nomes de arquivos
6. **Rate Limiting**: Implementar limitação de uploads por usuário/tempo 