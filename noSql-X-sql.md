# Modelagem NoSQL vs Modelagem Relacional

## 1. Introdução
Este documento apresenta uma modelagem NoSQL (MongoDB) para um sistema de amigo secreto com eventos, participantes, sorteios, mensagens e avaliações, e sua comparação com uma modelagem relacional (SQL).

---

## 2. Modelagem NoSQL (MongoDB)

### Collections principais:

### Events
- name
- year
- status
- sponsorPassword
- createdAt

### Participants
- name
- ramal
- codename
- eventId (ref)
- secretFriendId (ref opcional)

### DrawHistory
- eventId
- year
- pairs [giverId, receiverId]
- createdAt

### Messages
- eventId
- senderId
- recipientId
- content
- createdAt

### Evaluations
- participantId
- eventId
- rating
- comment
- createdAt

### GiftSuggestions
- participantId
- eventId
- suggestions[]

### Notices
- eventId
- content
- createdAt

---

## Características NoSQL
- Estrutura flexível
- Dados em documentos JSON
- Uso de arrays embutidos
- Referências manuais entre coleções

---

## Vantagens NoSQL
- Alta flexibilidade
- Escalabilidade horizontal
- Desenvolvimento rápido
- Ideal para dados dinâmicos

---

## Desvantagens NoSQL
- Sem integridade referencial nativa
- Possíveis inconsistências de dados
- Joins limitados (populate/aggregation manual)

---

## 3. Modelagem Relacional (SQL)

### Tabelas principais:

### events
- id (PK)
- name
- year
- status
- sponsor_password

### participants
- id (PK)
- event_id (FK)
- secret_friend_id (FK)

### draw_histories
- id (PK)
- event_id (FK)

### draw_pairs
- draw_history_id (FK)
- giver_id (FK)
- receiver_id (FK)

### messages
- event_id (FK)
- sender_id (FK)
- recipient_id (FK)
- content

### evaluations
- participant_id (FK)
- event_id (FK)
- rating

### gift_suggestions
- participant_id (FK)
- event_id (FK)

### notices
- event_id (FK)
- content

---

## Características SQL
- Schema rígido
- Uso de foreign keys
- Normalização de dados
- Estrutura bem definida

---

## Vantagens SQL
- Alta consistência (ACID)
- Integridade referencial
- Consultas complexas com JOIN
- Estrutura previsível

---

## Desvantagens SQL
- Menos flexível para mudanças
- Migrations constantes
- Escalabilidade horizontal mais difícil

---

## 4. Comparação Geral

| Aspecto | NoSQL | SQL |
|--------|------|-----|
| Schema | Flexível | Rígido |
| Relacionamentos | Manual | Foreign Keys |
| Escalabilidade | Horizontal | Vertical |
| Consistência | Eventual | Forte |
| Mudanças | Fácil | Complexa |

---

## 5. Conclusão

O MongoDB é mais adequado para sistemas dinâmicos e flexíveis como o exemplo apresentado. Já o modelo relacional é mais indicado para sistemas que exigem forte consistência e consultas estruturadas complexas.