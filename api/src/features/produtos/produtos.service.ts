// FEATURE: produtos
// Responsabilidade: CRUD de produtos via Prisma
import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import type { CriarProdutoDTO, AtualizarNcmDTO } from './produtos.schema.js';

export class ProdutosService {
  async listar(empresaId: string, page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      prisma.produto.findMany({
        where: { empresaId, deletadoEm: null },
        orderBy: { nome: 'asc' },
        skip,
        take: perPage,
      }),
      prisma.produto.count({ where: { empresaId, deletadoEm: null } }),
    ]);
    return { data, total };
  }

  async buscarPorId(id: string, empresaId: string) {
    const produto = await prisma.produto.findFirst({
      where: { id, empresaId, deletadoEm: null },
    });
    if (!produto) throw new NotFoundError('Produto');
    return produto;
  }

  async criar(empresaId: string, dto: CriarProdutoDTO) {
    return prisma.produto.create({ data: { ...dto, empresaId } });
  }

  async atualizar(id: string, empresaId: string, dto: Partial<CriarProdutoDTO>) {
    await this.buscarPorId(id, empresaId);
    return prisma.produto.update({
      where: { id },
      data: { ...dto, atualizadoEm: new Date() },
    });
  }

  async atualizarNcm(id: string, empresaId: string, dto: AtualizarNcmDTO) {
    await this.buscarPorId(id, empresaId);
    return prisma.produto.update({
      where: { id },
      data: { ...dto, atualizadoEm: new Date() },
    });
  }

  async deletar(id: string, empresaId: string) {
    await this.buscarPorId(id, empresaId);
    return prisma.produto.update({
      where: { id },
      data: { deletadoEm: new Date(), ativo: false },
    });
  }
}
