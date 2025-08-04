# O que é esse projeto?

Juntamente com [Macle Admin](https://github.com/Quindinzao/rn-macle-admin) e [Macle Vendas](https://github.com/Quindinzao/rn-macle-vendas), esse projeto é um MVP de uma API de um e-commerce, onde é possível adicionar usuários, realizar pedidos, adicionar produtos, deletar produtos, etc.

# Como rodar?

Para rodar esse projeto, é necessário ter um servidor MySQL funcionando na sua máquina, você pode sabar mais aqui [MySQL - Instalação](https://dev.mysql.com/downloads/installer/). Você também deve criar um .env em sua máquina com as informações do seu banco de dados, por exemplo:

```sh
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=ecommercemacle
PORT=3000

JWT_SECRET=myjwtsecretkey
```

Por fim, rode os comando abaixo e você terá a API funcionando localmente:

```sh
# Instalar pacotes:
npm install

# Rodar:
npm run dev

```

# Dúvidas? 🤓☝️

Não hesite em enviar uma mensagem para o endereço eletrônico [Gmail - João Victor Fernandes](mailto:j.v.fernandes.contact@gmail.com).
