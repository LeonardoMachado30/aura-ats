import { z } from 'zod';
import { pessoaSchema } from './pessoa.schema';

export const empresaSchema = z.object({
  id: z.uuid().optional(),
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  nomeFantasia: z.string().min(1, 'Nome Fantasia é obrigatória'),
  cnpj: z
    .string()
    .min(14, 'CNPJ inválido')
    .regex(
      /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/,
      'Formato de CNPJ inválido'
    ),
  dataAbertura: z
    .string()
    .refine(
      val =>
        /^\d{2}\/\d{2}\/\d{4}$/.test(val) ||
        /^\d{4}-\d{2}-\d{2}(T.*Z)?$/.test(val),
      {
        message:
          'Data deve estar no formato DD/MM/AAAA ou ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)',
      }
    ),
  representantes: z.array(pessoaSchema).optional(),
  createdAt: z
    .string()
    .refine(
      val =>
        /^\d{2}\/\d{2}\/\d{4}$/.test(val) ||
        /^\d{4}-\d{2}-\d{2}(T.*Z)?$/.test(val),
      {
        message:
          'Data deve estar no formato DD/MM/AAAA ou ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)',
      }
    )
    .optional(),
  updatedAt: z
    .string()
    .refine(
      val =>
        /^\d{2}\/\d{2}\/\d{4}$/.test(val) ||
        /^\d{4}-\d{2}-\d{2}(T.*Z)?$/.test(val),
      {
        message:
          'Data deve estar no formato DD/MM/AAAA ou ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)',
      }
    )
    .optional(),
});

export type EmpresaInput = z.infer<typeof empresaSchema>;
