import { MongoClient } from 'mongodb';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from "./typeDefs.ts";
import { resolvers } from "./resolvers.ts";
import { GraphQLError } from "graphql";

//Conectarse a la base de datos
console.log("Variables de entorno disponibles:", Deno.env.toObject());
const MONGO_URL = Deno.env.get("MONGO_URL")
console.log("Valor de MONGO_URL:", MONGO_URL);
if(!MONGO_URL) throw new GraphQLError("MONGO URL NOT EXISTS")
//enlace cogido
const client = new MongoClient(MONGO_URL)
await client.connect()
console.log("Conectado a la base de datos")

//colecciones en base de datos
const db = client.db("agenda")
const EjercicioOrdinario2324 = db.collection("contact")

//para la creacion de server apollo
const server = new ApolloServer({typeDefs, resolvers})
const { url } = await startStandaloneServer(server,{
  context: () => ({ EjercicioOrdinario2324 })             //aqui creamos apollo con esta coleccion
})

console.log(`🚀  Server ready at: ${url}`);
