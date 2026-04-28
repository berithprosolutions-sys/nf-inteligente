// FEATURE: clientes
// Responsabilidade: CRUD de clientes via Prisma
// NÃO faz: Validação HTTP (ver clientes.schema.ts)
import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import type { CriarClienteDTO, AtualizarClienteDTO } from './clientes.schema.js';

export class ClientesService {
  async listar(empresaId: string, page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      prisma.cliente.findMany({
        where: { empresaId, deletadoEm: null },
        orderBy: { nome: 'asc' },
        skip,
        take: perPage,
      }),
      prisma.cliente.count({ where: { empresaId, deletadoEm: null } }),
    ]);
    return { data, total };
  }

  async buscarPorId(id: string, empresaId: string) {
    const cliente = await prisma.cliente.findFirst({
      where: { id, empresaId, deletadoEm: null },
    });
    if (!cliente) throw new NotFoundError('Cliente');
    return cliente;
  }

  async criar(empresaId: string, dto: CriarClienteDTO) {
    const { contribuinteICMS, inscricaoEstadual, nomeFantasia, ...prismaData } = dto as any;
    return prisma.cliente.create({
      data: {
        ...prismaData,
        empresaId,
        enderecoCompleto: dto.enderecoCompleto ?? {},
      },
    });
  }

  async atualizar(id: string, empresaId: string, dto: AtualizarClienteDTO) {
    await this.buscarPorId(id, empresaId);
    const { contribuinteICMS, inscricaoEstadual, nomeFantasia, ...prismaData } = dto as any;
    return prisma.cliente.update({
      where: { id },
      data: { ...prismaData, atualizadoEm: new Date() },
    });
  }

  async deletar(id: string, empresaId: string) {
    await this.buscarPorId(id, empresaId);
    // Soft delete
    return prisma.cliente.update({
      where: { id },
      data: { deletadoEm: new Date(), ativo: false },
    });
  }
}
