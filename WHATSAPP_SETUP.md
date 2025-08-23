# Configuração do WhatsApp para Notificações de Pedidos

Este guia explica como configurar as notificações via WhatsApp quando um pedido é finalizado no e-commerce.

## 📋 Pré-requisitos

- Conta no Twilio (gratuita para testes)
- Número de telefone verificado no Twilio
- WhatsApp Business API configurado no Twilio

## 🚀 Configuração do Twilio

### 1. Criar conta no Twilio

1. Acesse [https://www.twilio.com/](https://www.twilio.com/)
2. Crie uma conta gratuita
3. Verifique seu número de telefone

### 2. Configurar WhatsApp Sandbox

1. No painel do Twilio, vá para **Messaging** > **Try it out** > **Send a WhatsApp message**
2. Siga as instruções para configurar o WhatsApp Sandbox
3. Envie a mensagem de ativação para o número sandbox do Twilio

### 3. Obter credenciais

1. No painel do Twilio, vá para **Account** > **API keys & tokens**
2. Copie o **Account SID** e **Auth Token**

## ⚙️ Configuração da API

### 1. Atualizar arquivo .env

Edite o arquivo `api/.env` e substitua os valores placeholder:

```env
# Configurações do Twilio para WhatsApp
TWILIO_ACCOUNT_SID=seu_account_sid_aqui
TWILIO_AUTH_TOKEN=seu_auth_token_aqui
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+5511999999999
```

**Onde:**
- `TWILIO_ACCOUNT_SID`: Seu Account SID do Twilio
- `TWILIO_AUTH_TOKEN`: Seu Auth Token do Twilio
- `TWILIO_WHATSAPP_FROM`: Número do WhatsApp Sandbox do Twilio (geralmente +14155238886)
- `TWILIO_WHATSAPP_TO`: Seu número de WhatsApp (com código do país, ex: +5511999999999)

### 2. Reiniciar o servidor

Após configurar as variáveis de ambiente, reinicie o servidor da API:

```bash
cd api
npm start
```

## 🧪 Testando a Funcionalidade

### 1. Modo de Desenvolvimento

Se as credenciais não estiverem configuradas, o sistema funcionará em modo de simulação:
- Os pedidos serão salvos normalmente no banco de dados
- As mensagens de WhatsApp serão apenas logadas no console
- Você verá a mensagem: "⚠️ Credenciais do Twilio não configuradas. Simulando envio..."

### 2. Modo de Produção

Com as credenciais configuradas corretamente:
- Os pedidos serão salvos no banco de dados
- Uma notificação real será enviada via WhatsApp
- Você verá a mensagem: "✅ Notificação WhatsApp enviada via Twilio!"

### 3. Teste Completo

1. Acesse o frontend em [http://localhost:5174](http://localhost:5174)
2. Adicione produtos ao carrinho
3. Vá para o checkout
4. Preencha todos os dados obrigatórios
5. Finalize o pedido
6. Verifique se recebeu a notificação no WhatsApp

## 📱 Formato da Mensagem

A mensagem enviada via WhatsApp terá o seguinte formato:

```
🛒 *Novo Pedido Recebido!*

📋 *Pedido:* PED123456789
👤 *Cliente:* João Silva
📱 *Telefone:* (11) 99999-9999
📧 *Email:* joao@email.com
💰 *Total:* R$ 299,90
🏠 *Endereço:* Rua das Flores, 123 - Centro, São Paulo/SP
💳 *Pagamento:* credito

📦 *Itens do Pedido:*
• Produto A - Qtd: 2 - R$ 199,90
• Produto B - Qtd: 1 - R$ 100,00
```

## 🔧 Solução de Problemas

### Erro: "Credenciais inválidas"
- Verifique se o Account SID e Auth Token estão corretos
- Certifique-se de que não há espaços extras nas variáveis de ambiente

### Erro: "Número não autorizado"
- Verifique se seu número está verificado no Twilio
- Para o sandbox, certifique-se de ter enviado a mensagem de ativação

### Mensagem não chega
- Verifique se o número de destino está no formato correto (+5511999999999)
- Confirme se o WhatsApp Sandbox está ativo
- Verifique os logs do servidor para mais detalhes

## 💡 Próximos Passos

Para uso em produção, considere:

1. **WhatsApp Business API**: Migrar do sandbox para a API oficial
2. **Múltiplos destinatários**: Configurar lista de administradores
3. **Templates**: Usar templates aprovados pelo WhatsApp
4. **Logs**: Implementar sistema de logs mais robusto
5. **Retry**: Adicionar tentativas automáticas em caso de falha

## 📞 Suporte

Para mais informações sobre a API do Twilio:
- [Documentação oficial](https://www.twilio.com/docs/whatsapp)
- [WhatsApp Sandbox](https://www.twilio.com/docs/whatsapp/sandbox)