# OrderSharingSystem

This project online order management system created by Antonin, Kylian, Enzo, Nelson & Léo.  
In this repository, you can find the source code as well as instructions on how run the project locally. You can also test it using the provided Postman collection that contains all the queries.  

The architecture for this project is as followed:

![schema1](/assets/schema1.png)

As you can see the project is using newer technologies such as NestJS and Typescript thus it can be easily scaled depending on numerous parameters. If we deployed this project in production, we would have followed the DevOps course and used Docker with Kubernetes. It would have allowed us add a load balancer and/or replicas depending on the number of requests or the time of the day. This way, we ensure a consistent uptime with good latency for our customers.

## Run this project locally
Follow this instructions to test the project

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
