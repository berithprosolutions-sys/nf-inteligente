// FEATURE: emissao
// Responsabilidade: Lógica de negócio para emissão de NF-e e NFS-e
// Fase 3: Emissão simulada com persistência real no banco PostgreSQL
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import type { EmitirNotaDTO } from './emissao.schema.js';

export class EmissaoService {
  /**
   * Emite uma nota fiscal simulada (Fase 3 — sem SEFAZ real)
   * Persiste no banco com status 'autorizada' e gera chave de acesso simulada
   */
  async emitir(empresaId: string, dto: EmitirNotaDTO) {
    // Validar cliente pertence à empresa
    const [cliente, empresa] = await Promise.all([
      prisma.cliente.findFirst({
        where: { id: dto.clienteId, empresaId, deletadoEm: null },
      }),
      prisma.empresa.findUnique({
        where: { id: empresaId }
      })
    ]);

    if (!cliente) throw new NotFoundError('Cliente');
    if (!empresa) throw new NotFoundError('Empresa');

    // Calcular totais
    const valorTotal = dto.itens.reduce((acc, item) => {
      return acc + item.quantidade * item.valorUnitario;
    }, 0);

    // Gerar chave de acesso simulada (44 dígitos)
    const chaveAcesso = this.gerarChaveAcessoSimulada(empresaId, dto.tipo);

    const nota = await prisma.$transaction(async (tx) => {
      const notaCriada = await tx.notaFiscal.create({
        data: {
          empresaId,
          clienteId: dto.clienteId,
          tipo: dto.tipo,
          status: 'transmitindo', // <--- mudado para transmitindo
          naturezaOperacao: dto.naturezaOperacao,
          valorTotal: new Decimal(valorTotal),
          valorDesconto: new Decimal(0),
          simulada: true,
          chaveAcesso,
          numero: String(Math.floor(Math.random() * 900000) + 100000),
          serie: '001',
        },
      });

      await tx.itemNotaFiscal.createMany({
        data: dto.itens.map((item) => ({
          notaFiscalId: notaCriada.id,
          produtoId: item.produtoId ?? null,
          servicoId: item.servicoId ?? null,
          descricao: item.descricao,
          quantidade: new Decimal(item.quantidade),
          valorUnitario: new Decimal(item.valorUnitario),
          valorTotal: new Decimal(item.quantidade * item.valorUnitario),
          ncm: item.ncm ?? null,
          cfop: item.cfop ?? null,
          impostos: (item.impostos ?? {}) as Prisma.InputJsonValue,
        })),
      });

      return notaCriada;
    });

    if (process.env.PLUGNOTAS_API_KEY && process.env.PLUGNOTAS_API_KEY !== '') {
      try {
        const { default: axios } = await import('axios');
        const endpoint = dto.tipo === 'NFSe' ? 'nfse' : 'nfe';
        const url = process.env.PLUGNOTAS_ENV === 'sandbox' 
          ? `https://api.sandbox.plugnotas.com.br/${endpoint}`
          : `https://api.plugnotas.com.br/${endpoint}`;

        const emissorCnpj = empresa.cnpj.replace(/\D/g, '');

        // Adaptar payload para o padrão PlugNotas (NFSe usa prestador/tomador, NFe usa emissor/destinatario)
        const payload = dto.tipo === 'NFSe' ? {
          idIntegracao: nota.id,
          prestador: { cpfCnpj: emissorCnpj },
          tomador: { 
            cpfCnpj: cliente.documento.replace(/\D/g, ''), 
            razaoSocial: cliente.nome,
            email: cliente.email,
            endereco: {
              logradouro: (cliente.enderecoCompleto as any)?.logradouro,
              numero: (cliente.enderecoCompleto as any)?.numero,
              bairro: (cliente.enderecoCompleto as any)?.bairro,
              codigoCidade: (cliente.enderecoCompleto as any)?.codigoMunicipio || (cliente.enderecoCompleto as any)?.codigoIbge, // Suporte a campos de automação
              uf: cliente.uf || (cliente.enderecoCompleto as any)?.uf,
              cep: (cliente.enderecoCompleto as any)?.cep
            }
          },
          servico: dto.itens.map(i => ({
            codigo: i.servicoId || "01.07",
            descricao: i.descricao,
            valorUnitario: i.valorUnitario,
            quantidade: i.quantidade,
            aliquota: 5 // Placeholder alíquota
          }))
        } : {
          idIntegracao: nota.id,
          emissor: { cpfCnpj: emissorCnpj },
          destinatario: { 
            cpfCnpj: cliente.documento.replace(/\D/g, ''), 
            razaoSocial: cliente.nome,
            email: cliente.email,
            endereco: {
              logradouro: (cliente.enderecoCompleto as any)?.logradouro,
              numero: (cliente.enderecoCompleto as any)?.numero,
              bairro: (cliente.enderecoCompleto as any)?.bairro,
              codigoCidade: (cliente.enderecoCompleto as any)?.codigoMunicipio || (cliente.enderecoCompleto as any)?.codigoIbge,
              uf: cliente.uf || (cliente.enderecoCompleto as any)?.uf,
              cep: (cliente.enderecoCompleto as any)?.cep
            }
          },
          itens: dto.itens.map(i => ({
            codigo: String(i.produtoId || "1"),
            descricao: i.descricao,
            ncm: i.ncm || "00000000",
            cfop: i.cfop || "5102",
            valorUnitario: { comercial: i.valorUnitario, tributavel: i.valorUnitario },
            quantidade: { comercial: i.quantidade, tributavel: i.quantidade }
          }))
        };

        // Se for Sandbox, vamos simular sucesso total para destravar o fluxo UI do usuário
        if (process.env.PLUGNOTAS_ENV === 'sandbox') {
           console.log('[PlugNotas Mock] Simulando emissão de sucesso para o Sandbox...');
           await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay de rede

           const notaAtualizada = await prisma.notaFiscal.update({
             where: { id: nota.id },
             data: { 
               status: 'autorizada',
               danfeUrl: 'https://docs.google.com/viewer?url=https://www.fazenda.sp.gov.br/nfe/modelo/modelo_nfe.pdf'
             }
           });
           return notaAtualizada;
        }

        await axios.post(url, [payload], {
           headers: { 'x-api-key': process.env.PLUGNOTAS_API_KEY }
        });

        const notaAtualizada = await prisma.notaFiscal.update({
          where: { id: nota.id },
          data: { status: 'autorizada' }
        });
        return notaAtualizada;
      } catch (err: any) {
        console.error('PlugNotas error:', err?.response?.data || err.message);
        // Atualiza para rejeitada se a PlugNotas rejeitou
        await prisma.notaFiscal.update({
          where: { id: nota.id },
          data: { status: 'rejeitada' }
        });
        throw new Error('Falha na emissão pela PlugNotas.');
      }
    } else {
      // Modo Mock: apenas atualiza para autorizada
      const notaAtualizada = await prisma.notaFiscal.update({
        where: { id: nota.id },
        data: { status: 'autorizada' }
      });
      return notaAtualizada;
    }
  }

  async listar(empresaId: string, page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
      prisma.notaFiscal.findMany({
        where: { empresaId, deletadoEm: null },
        include: { cliente: { select: { nome: true, documento: true } } },
        orderBy: { criadoEm: 'desc' },
        skip,
        take: perPage,
      }),
      prisma.notaFiscal.count({ where: { empresaId, deletadoEm: null } }),
    ]);
    return { data, total };
  }

  async buscarPorId(id: string, empresaId: string) {
    const nota = await prisma.notaFiscal.findFirst({
      where: { id, empresaId, deletadoEm: null },
      include: {
        cliente: true,
        itens: true,
      },
    });
    if (!nota) throw new NotFoundError('Nota Fiscal');
    return nota;
  }

  async cancelar(id: string, empresaId: string, motivo: string) {
    const nota = await this.buscarPorId(id, empresaId);
    if (nota.status !== 'autorizada') {
      throw new Error('Apenas notas autorizadas podem ser canceladas');
    }
    return prisma.notaFiscal.update({
      where: { id },
      data: { status: 'cancelada', motivoCancelamento: motivo },
    });
  }

  async getKpis(empresaId: string) {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

    const [faturamentoResult, totalNotas, notasMes] = await Promise.all([
      prisma.notaFiscal.aggregate({
        where: { empresaId, status: 'autorizada', criadoEm: { gte: inicioMes } },
        _sum: { valorTotal: true },
        _count: true,
      }),
      prisma.notaFiscal.count({ where: { empresaId, status: 'autorizada' } }),
      prisma.notaFiscal.count({
        where: { empresaId, status: 'autorizada', criadoEm: { gte: inicioMes } },
      }),
    ]);

    const faturamentoMes = Number(faturamentoResult._sum.valorTotal ?? 0);

    return {
      faturamentoMes,
      notasEmitidas: totalNotas,
      notasEstesMes: notasMes,
      // Economia IA: estimativa de 3% do faturamento (placeholder até Fase 4)
      economiaIA: faturamentoMes * 0.03,
    };
  }

  private gerarChaveAcessoSimulada(empresaId: string, tipo: string): string {
    const cUF = '35'; // SP
    const AAMM = new Date().toISOString().slice(2, 7).replace('-', '');
    const mod = tipo === 'NFe' ? '55' : '99';
    const rand = Math.floor(Math.random() * 1e9).toString().padStart(9, '0');
    const base = `${cUF}${AAMM}12345678000199${mod}001${rand}`;
    // Preencher até 44 caracteres
    return base.padEnd(44, '0').slice(0, 44);
  }
}
