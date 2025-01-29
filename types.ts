import { OptionalId } from "mongodb";

//como se vera contacto
export type Contact = OptionalId<{
    name: string;
    phone: string;
    country: string;
    timezone: string;
}>;

//link de la api: https://api-ninjas.com/api/validatephone
export type API_Phone = {
    is_valid: boolean;   // Si el teléfono es válido
    country: string;     // País asociado al teléfono
    timezones: string[]; // Zonas horarias disponibles
};

//link de la api: https://api-ninjas.com/api/worldtime
export type zona_horaria = {
    timezone:string[];
}