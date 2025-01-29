//funciones graphql
import { Collection, ObjectId } from "mongodb";
import { Contact } from "./types.ts";
import { validar, coger_hora } from "./utils.ts";
import { GraphQLError } from "graphql";

//siempre hay que ponerlo, proporciona acceso
type Context = {
    EjercicioOrdinario2324: Collection<Contact>
}

//valores porgrama que se pasa a las mutaciones
type MutationArgs = {
    id: string, 
    name: string, 
    phone: string
    country: string,
    timezone: string
}

//resolvers se divide por asi decirlo en 3. lo que lleva los valores, query y mutation
export const resolvers = {

    Contact: {
        
    },

    //los gets
    Query: {
        getContact: async(
            _:unknown,       //esto se pone
            args: MutationArgs,     //que valores se usan
            context: Context         //en que contexto
        ):Promise<Contact> => {      //aqui decimos que va a ocurrir
            const result = await context.EjercicioOrdinario2324.findOne({_id: new ObjectId(args.id)}) 
            if(!result) throw new GraphQLError("Contact not found")
            return result
        },

        getContacts: async(
            _:unknown,
            __:unknown,
            context: Context     
        ):Promise<Contact[]> => await context.EjercicioOrdinario2324.find().toArray()
       
    },
    Mutation: {
        addContact: async(
            _:unknown,
            args: MutationArgs,
            context: Context
        ):Promise<Contact> => {

            //ejecutar add

            const { name, phone } = args//tipo

            const {country, timezone} = await validar(phone)

            const existe = await context.EjercicioOrdinario2324.findOne({phone})
            if(existe) throw new GraphQLError("ya existe")

            //lo que insertamos
            const { insertedId } = await context.EjercicioOrdinario2324.insertOne({
                name,
                phone,
                country,
                timezone,
            })
            //lo que devuleve en pantalla
            return {
                _id: insertedId,
                name,
                phone,
                country,
                timezone,
            }
        },

        deleteContact: async(
            _:unknown,
            args:MutationArgs,
            context: Context
        ):Promise<boolean> =>{
            const { deletedCount } = await context.EjercicioOrdinario2324.deleteOne({_id: new ObjectId(args.id)})
            if(deletedCount === 0) return false
            return true
        },

        updateContact: async(
            _:unknown,
            args: MutationArgs,
            context: Context
        ):Promise<Contact> => {

            const { id, phone } = args
            //primero ver si existe, es valido
            if(phone) {
                const { country, timezone } = await validar(phone)
                args = {...args, country, timezone}
            }
            const phone_exist = await context.EjercicioOrdinario2324.findOne({phone})
            if(phone_exist) throw new GraphQLError("Contact already exist")
            const result = await context.EjercicioOrdinario2324.findOneAndUpdate(
                {_id: new ObjectId(id)},
                {$set: {...args}},
                {returnDocument: "after"}
            )
            if(!result) throw new GraphQLError("Contact not found")
            return result
        }






    }
}