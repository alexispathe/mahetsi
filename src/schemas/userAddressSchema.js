//src/schemas/userAddressSchema.js
import { z } from 'zod';

export const userAddressSchema = z.object({
    email: z.string().email({ message: 'Correo inválido' }),
    phone: z.string()
      .min(10, { message: 'El número de teléfono debe tener al menos 10 dígitos' })
      .max(10, { message: 'El número de teléfono no puede tener más de 10 dígitos' })
      .regex(/^\d+$/, { message: 'El número de teléfono solo debe contener números' }),
    firstName: z.string().min(1, { message: 'Nombre es requerido' }),
    lastName: z.string().min(1, { message: 'Apellido es requerido' }),
    address: z.string().min(1, { message: 'Dirección es requerida' }),
    interiorNumber: z.string().optional(),
    colonia: z.string().min(1, { message: 'Colonia es requerida' }),
    city: z.string().min(1, { message: 'Ciudad/Municipio es requerido' }),
    state: z.string().min(1, { message: 'Estado es requerido' }),
    zipcode: z.string()
      .regex(/^\d{5}$/, { message: 'Código Postal inválido' }),
    reference: z.string().min(1, { message: 'La referencia es requerida' }),
    country: z.string().default('México'),
    useBilling: z.boolean().optional(),
    betweenStreets: z.string().optional(),
  });
  