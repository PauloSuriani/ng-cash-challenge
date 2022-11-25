# Ng-cash Challenge

Olá, bem vindo ao repositório. Segue um breve contexto sobre este projeto. 


### Contexto

"Estruturar uma aplicação web fullstack, dockerizada, cujo objetivo seja possibilitar que usuários da NG consigam realizar transferências internas entre si."


Aplicação ponta-a-ponta desenvolvida utilizando as seguintes tecnologias:

### Backend
- Um servidor em Node.js utilizando Typescript;
- ORM Sequelize;
- Um bancos de dados PostgreSQL.

### Frontend
- React utilizando Typescript;
- CSS3 puro;


<details>
  <summary>Veja imagens da página</summary>
  
### 

Desculpe, imagens estarão diponíveis em breve!

###  
</details>

# Rode local

### Opção 1: Aplicação dockerizada (necessário Docker e Docker Compose)

1. Clone o repositório
  * `git@github.com:PauloSuriani/ng-cash-challenge.git`
  
  * Entre na pasta do repositório que você acabou de clonar:
    * `cd ng-cash-challenge`
  
    
2. Rode o arquivo orquestrador de containers `docker-compose.yml` 
  * `sudo docker-compose up`
  

3. Acesse a aplicação em `http://localhost:3001/`


4. Encerre o projeto
  * `sudo docker-compose down`


### Opção 2: Subir cada serviço individualmente

Por ser uma aplicação monobloco (1 repositório contendo front e backend) é necessária instalação das dependências separadamente.

1. Clone o repositório
  * `git@github.com:PauloSuriani/ng-cash-challenge.git`
  * Entre na pasta do repositório que você acabou de clonar:
    * `cd ng-cash-challenge`
    
    
2. Instale as dependências e inicialize o projeto, para front e backend  
  * `cd front-end`
    * Instale as dependências:
      * `npm install`
      
    volte ao diretório raiz
    * `cd ..`
    * `cd backend`
      * Instale as dependências:
        * `npm install`


3. Inicialize o projeto
  * Inicialize o projeto:
    * `npm start` (uma nova página deve abrir no seu navegador com o projeto rodando)



> **Nota:** package.json é tecnologia **Node.js**, portanto é necessária instalação prévia do gerenciador de pacotes **npm**, acesse a [documentação oficial](https://www.npmjs.com/).

> **Nota2:** O sistema gerenciador de banco de dados **PostgreSQL** necessita de prévia instalação ou instância Dockerizada.

## Considerações

Obrigado por visitar este repositório, sinta-se livre para fazer o dowload, testar e fazer fork deste projeto.
