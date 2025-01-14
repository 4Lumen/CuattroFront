# Guia de Desenvolvimento Cline - Versão 4.0

## Índice
1. [Princípios Fundamentais](#princípios-fundamentais)
2. [Objetivos de Desenvolvimento](#objetivos-de-desenvolvimento)
3. [Ciclo de Vida do Projeto](#ciclo-de-vida-do-projeto)
4. [Sistema de Memória](#sistema-de-memória)
5. [Restrições Operacionais](#restrições-operacionais)
6. [Sistema de Documentação](#sistema-de-documentação)
7. [Ferramentas e Capacidades](#ferramentas-e-capacidades)
8. [Resolução de Problemas](#resolução-de-problemas)
9. [Histórico de Versões](#histórico-de-versões)

## Princípios Fundamentais
- **Documentação como Fonte Única**: Toda informação deve estar documentada
- **Desenvolvimento Orientado a Contexto**: Entender antes de implementar
- **Rastreabilidade**: Todas as mudanças devem ser documentadas
- **Verificação Contínua**: Validar contexto antes de prosseguir
- **Comunicação Clara**: Mensagens objetivas e em português

## Objetivos de Desenvolvimento
1. Criar sistemas sustentáveis e escaláveis
2. Seguir padrões documentados
3. Manter contexto completo do projeto
4. Garantir processos reproduzíveis
5. Priorizar experiência do usuário

## Ciclo de Vida do Projeto

### 1. Levantamento de Requisitos
- Identificar objetivos e casos de uso
- Definir critérios de sucesso
- Documentar requisitos funcionais/não-funcionais
- Estabelecer restrições técnicas e de negócio

### 2. Modelagem
- Identificar entidades e relacionamentos
- Criar estruturas de dados apropriadas
- Desenvolver diagramas de classe/banco
- Definir contratos de API

### 3. Fluxo de Desenvolvimento

#### Inicialização
1. Verificar arquivos de documentação
2. Criar documentação faltante
3. Ler e validar contexto completo
4. Confirmar entendimento do problema

#### Execução
1. Analisar requisitos da tarefa
2. Dividir em objetivos alcançáveis
3. Usar ferramentas sequencialmente
4. Documentar alterações e progresso
5. Validar resultados

#### Tratamento de Erros
1. Detectar e documentar ambiguidades
2. Solicitar esclarecimentos quando necessário
3. Atualizar documentação com informações
4. Implementar correções
5. Validar solução

## Sistema de Memória

### Memória de Curto Prazo
- Rastrear contexto atual
- Manter ações recentes
- Documentar próximos passos
- Registrar dúvidas temporárias

### Padrões de Documentação
- Manter versionamento
- Usar formatação consistente
- Incluir exemplos práticos
- Documentar decisões técnicas

## Restrições Operacionais
1. Reset de memória requer documentação completa
2. Ferramentas devem ser usadas sequencialmente
3. Cada uso de ferramenta requer confirmação
4. Desenvolvimento deve seguir padrões
5. Executar comandos diretamente (sem perguntar)
6. Usar ';' em vez de '&&' no terminal
7. Manter contexto durante execução de comandos
8. Continuar trabalho durante execução de comandos

## Sistema de Documentação

### Arquivos Obrigatórios
| Arquivo | Propósito |
|---------|-----------|
| productContext.md | Contexto e escopo do produto |
| activeContext.md | Trabalho atual e próximos passos |
| systemPatterns.md | Arquitetura e decisões técnicas |
| progress.md | Status e trabalho restante |

### Estrutura dos Arquivos

#### productContext.md
```markdown
# Nome do Produto
## Visão Geral
## Objetivos
## Casos de Uso
## Critérios de Sucesso
## Restrições
```

#### activeContext.md
```markdown
# Contexto Ativo
## Status Atual
## Trabalho em Andamento
## Próximos Passos
## Problemas Conhecidos
## Decisões Pendentes
```

#### systemPatterns.md
```markdown
# Padrões do Sistema
## Arquitetura
## Padrões de Código
## Padrões de API
## Padrões de Teste
## Padrões de Deploy
```

#### progress.md
```markdown
# Progresso do Projeto
## Concluído
## Em Andamento
## Próximos Passos
## Métricas
## Impedimentos
## Riscos
```

### Fluxos Principais

#### Iniciando Tarefas
1. Verificar arquivos de documentação
2. Se QUALQUER arquivo faltar, criar
3. Ler TODOS os arquivos
4. Verificar contexto completo
5. Iniciar desenvolvimento

#### Durante Desenvolvimento
1. Seguir padrões documentados
2. Atualizar docs após mudanças
3. Para troubleshooting:
   - Realizar verificações (0-10)
   - Se confiança < 9, documentar:
     * O que é conhecido
     * O que é incerto
     * O que precisa investigação
   - Só prosseguir com confiança ≥ 9
   - Documentar descobertas

## Ferramentas e Capacidades

### Operações de Arquivo
- **write_to_file**: Criar/sobrescrever arquivos
- **read_file**: Ler conteúdo de arquivos
- **replace_in_file**: Edições específicas
- **search_files**: Busca com regex
- **list_files**: Listar diretório

### Operações de Terminal
- **execute_command**: Executar comandos
  - Usar ';' para encadear comandos
  - Manter comandos simples
  - Evitar comandos interativos

### Ferramentas de Interação
- **ask_followup_question**: Pedir esclarecimentos
- **attempt_completion**: Apresentar resultados

### Diretrizes de Uso
1. Uma ferramenta por vez
2. Aguardar confirmação
3. Documentar uso
4. Tratar erros
5. Usar ferramenta mais simples
6. Preferir edições específicas

## Resolução de Problemas

### Problemas Comuns
1. Contexto incompleto
2. Falha em ferramentas
3. Inconsistência na documentação
4. Erros de execução

### Processo de Resolução
1. Identificar problema
2. Verificar documentação
3. Validar estado
4. Documentar achados
5. Implementar solução
6. Atualizar documentação

## Histórico de Versões
| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | 2023-10-01 | Versão inicial |
| 2.0 | 2023-10-15 | Reestruturação e TOC |
| 3.0 | 2023-11-01 | Regras de terminal |
| 4.0 | 2024-01-15 | Melhorias ferramentas |
| 4.1 | 2024-03-20 | Estrutura de documentação |
