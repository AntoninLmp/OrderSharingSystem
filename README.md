# OrderSharingSystem

## Run this project locally
### Install the dependencies
You need the following
- [NodeJS](https://nodejs.org/en/download) version >18
- [pnpm](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/engine/install/)

### Start the project
This project needs a local database, you can run it using docker

```sh
docker run --name OrderSharingSystemDb -p 5432:5432 -e POSTGRES_PASSWORD=root -e POSTGRES_USER=root -e POSTGRES_DB=OrderSharingSystemDb -d postgres
```

Next you need to add .env file in the root of the project.
See the wiki [here](https://github.com/AntoninLmp/OrderSharingSystem/wiki/Environment-variables) for more informations.


Install the project dependencies
```sh
pnpm i
```

Then build the project
```sh
pnpm build
```

And run it!
```sh
pnpm start
```


You can now test the api on http://localhost:3000 using the postman collection 🚀

