// SCRIPT: seed
// Responsabilidade: Popular o banco com dados de desenvolvimento realistas
// Executar: pnpm db:seed
import 'dotenv/config';
import { PrismaClient, OrigemMercadoria } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // 1. Empresa de teste
  const empresa = await prisma.empresa.upsert({
    where: { cnpj: '11.222.333/0001-81' },
    update: {},
    create: {
      razaoSocial: 'Berith Tecnologia LTDA',
      nomeFantasia: 'Berith Tech',
      cnpj: '11.222.333/0001-81',
      regimeTributario: 'SimplesNacional',
      uf: 'SP',
      municipio: 'São Paulo',
      codigoMunicipio: '3550308',
      inscricaoEstadual: '111.222.333.444',
      inscricaoMunicipal: '1.234.567-8',
      plano: 'pro',
      enderecoCompleto: {
        logradouro: 'Av. Paulista',
        numero: '1000',
        bairro: 'Bela Vista',
        cep: '01310-100',
        municipio: 'São Paulo',
        uf: 'SP',
      },
    },
  });
  console.log(`✅ Empresa criada: ${empresa.razaoSocial}`);

  // 2. Usuário owner
  const passwordHash = await bcrypt.hash('senha123', 12);
  const usuario = await prisma.usuario.upsert({
    where: { email: 'dev@berith.com.br' },
    update: {},
    create: {
      nome: 'Marco Antônio',
      email: 'dev@berith.com.br',
      passwordHash,
      role: 'OWNER',
      empresaId: empresa.id,
    },
  });
  console.log(`✅ Usuário criado: ${usuario.email}`);

  // 3. Clientes
  const clientes = [
    {
      tipo: 'PJ' as const,
      documento: '22.333.444/0001-72',
      nome: 'Indústria Metalúrgica Paulista LTDA',
      email: 'vendas@metalpaulista.com.br',
      uf: 'SP',
      enderecoCompleto: { logradouro: 'Rua Industrial', numero: '500', bairro: 'Cidade Industrial', cep: '06000-000', municipio: 'Osasco', uf: 'SP' },
    },
    {
      tipo: 'PJ' as const,
      documento: '33.444.555/0001-63',
      nome: 'Distribuidora Minas Online EIRELI',
      email: 'compras@distminas.com.br',
      uf: 'MG',
      enderecoCompleto: { logradouro: 'Av. do Contorno', numero: '2000', bairro: 'Centro', cep: '30110-927', municipio: 'Belo Horizonte', uf: 'MG' },
    },
    {
      tipo: 'PF' as const,
      documento: '529.982.247-25',
      nome: 'Carlos Eduardo Silva',
      email: 'carlos.silva@mail.com',
      uf: 'SP',
      enderecoCompleto: { logradouro: 'Rua das Flores', numero: '45', bairro: 'Jardim Primavera', cep: '08000-000', municipio: 'São Paulo', uf: 'SP' },
    },
  ];

  for (const c of clientes) {
    await prisma.cliente.upsert({
      where: { id: `seed-${c.documento.replace(/\D/g, '')}` },
      update: {},
      create: {
        id: `seed-${c.documento.replace(/\D/g, '')}`,
        ...c,
        empresaId: empresa.id,
      },
    });
  }
  console.log(`✅ ${clientes.length} clientes criados`);

  // 4. Produtos
  const produtos = [
    {
      id: 'seed-prod-001',
      nome: 'Notebook Dell Latitude 5540',
      ncm: '84713019',
      ncmConfirmado: true,
      aliquotaIpi: 0,
      fonteLegal: 'TIPI 2024 - DECRETO nº 11.158/2022',
      unidade: 'UN',
      valorUnitario: 4800,
      origemMercadoria: OrigemMercadoria.CODIGO_0,
    },
    {
      id: 'seed-prod-002',
      nome: 'Monitor LG 27" UHD',
      ncm: '85285220',
      ncmConfirmado: true,
      aliquotaIpi: 15,
      fonteLegal: 'TIPI 2024 - EXC 01 - DECRETO nº 11.158/2022',
      unidade: 'UN',
      valorUnitario: 1200,
      origemMercadoria: OrigemMercadoria.CODIGO_0,
    },
    {
      id: 'seed-prod-003',
      nome: 'Teclado Mecânico Keychron K2',
      ncm: '84716052',
      ncmConfirmado: true,
      aliquotaIpi: 10,
      fonteLegal: 'TIPI 2024',
      unidade: 'UN',
      valorUnitario: 350,
      origemMercadoria: OrigemMercadoria.CODIGO_1,
    },
    {
      id: 'seed-prod-004',
      nome: 'Computador Desktop Dell OptiPlex',
      ncm: '84713000',
      ncmConfirmado: true,
      aliquotaIpi: 15,
      fonteLegal: 'TIPI 2024 - DECRETO nº 11.158/2022',
      unidade: 'UN',
      valorUnitario: 3200,
      origemMercadoria: OrigemMercadoria.CODIGO_0,
    },
    {
      id: 'seed-prod-005',
      nome: 'Smartphone Samsung Galaxy A55',
      ncm: '85176292',
      ncmConfirmado: true,
      aliquotaIpi: 16,
      fonteLegal: 'TIPI 2024 - DECRETO nº 11.158/2022',
      unidade: 'UN',
      valorUnitario: 1800,
      origemMercadoria: OrigemMercadoria.CODIGO_0,
    },
  ];

  for (const p of produtos) {
    await prisma.produto.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, empresaId: empresa.id },
    });
  }
  console.log(`✅ ${produtos.length} produtos criados`);

  // 5. Serviços
  const servicos = [
    {
      id: 'seed-serv-001',
      nome: 'Desenvolvimento e Licenciamento de Software',
      codigoLC116: '1.01',
      lc116Confirmado: true,
      aliquotaISSQN: 2.0,
    },
    {
      id: 'seed-serv-002',
      nome: 'Consultoria em Tecnologia da Informação',
      codigoLC116: '17.01',
      lc116Confirmado: true,
      aliquotaISSQN: 5.0,
    },
  ];

  for (const s of servicos) {
    await prisma.servico.upsert({
      where: { id: s.id },
      update: {},
      create: { ...s, empresaId: empresa.id },
    });
  }
  console.log(`✅ ${servicos.length} serviços criados`);

  // ─────────────────────────────────────────────────────────────────
  // 6. NCMs REAIS (TIPI 2024) — tabela que estava vazia!
  // ─────────────────────────────────────────────────────────────────
  const ncmsData = [
    {
      codigo: '84713019',
      descricao: 'Máquinas automáticas para processamento de dados, portáteis, de peso não superior a 10 kg (notebooks/laptops)',
      aliquotaIpi: 0,
      unidadeTributavel: 'UN',
      fonteLegal: 'TIPI 2024 - DECRETO nº 11.158/2022',
    },
    {
      codigo: '85285220',
      descricao: 'Monitores do tipo utilizado em máquinas automáticas para processamento de dados — com tela de cristal líquido (LCD)',
      aliquotaIpi: 15,
      unidadeTributavel: 'UN',
      fonteLegal: 'TIPI 2024 EXC 01 - DECRETO nº 11.158/2022',
    },
    {
      codigo: '84716052',
      descricao: 'Teclados para máquinas automáticas para processamento de dados',
      aliquotaIpi: 10,
      unidadeTributavel: 'UN',
      fonteLegal: 'TIPI 2024 - DECRETO nº 11.158/2022',
    },
    {
      codigo: '84713000',
      descricao: 'Máquinas automáticas para processamento de dados, digitais, não portáteis (computadores desktop)',
      aliquotaIpi: 15,
      unidadeTributavel: 'UN',
      fonteLegal: 'TIPI 2024 - DECRETO nº 11.158/2022',
    },
    {
      codigo: '85176292',
      descricao: 'Telefones para redes celulares (smartphones) — outros',
      aliquotaIpi: 16,
      unidadeTributavel: 'UN',
      fonteLegal: 'TIPI 2024 - DECRETO nº 11.158/2022',
    },
  ];

  const ncmRecords: Record<string, { id: string }> = {};

  for (const ncm of ncmsData) {
    const record = await prisma.ncm.upsert({
      where: { codigo: ncm.codigo },
      update: {},
      create: {
        ...ncm,
        validoDesde: new Date('2024-01-01'),
      },
    });
    ncmRecords[ncm.codigo] = { id: record.id };
  }
  console.log(`✅ ${ncmsData.length} NCMs reais criados`);

  // ─────────────────────────────────────────────────────────────────
  // 7. Regras ICMS por rota (RICMS-SP/2000 + CONFAZ)
  // ─────────────────────────────────────────────────────────────────
  type IcmsRegra = {
    ncmCodigo: string;
    ufOrigem: string;
    ufDestino: string;
    aliquota: number;
    temBeneficio: boolean;
    tipoOperacao: string;
    fonteLegal: string;
  };

  const rotas: IcmsRegra[] = [];

  // Alíquotas internas e interestaduais padrão — por NCM
  const regrasPorNcm: Array<{ codigo: string; rotasExtra?: Partial<IcmsRegra>[] }> = [
    { codigo: '84713019' },
    { codigo: '85285220' },
    { codigo: '84716052' },
    { codigo: '84713000' },
    { codigo: '85176292' },
  ];

  const rotasPadrao: Array<Omit<IcmsRegra, 'ncmCodigo'>> = [
    { ufOrigem: 'SP', ufDestino: 'SP', aliquota: 18, temBeneficio: false, tipoOperacao: 'SAIDA', fonteLegal: 'RICMS-SP/2000 — Decreto 45.490, art. 52' },
    { ufOrigem: 'SP', ufDestino: 'MG', aliquota: 12, temBeneficio: false, tipoOperacao: 'SAIDA', fonteLegal: 'CONFAZ — Resolução SF 13/2012, art. 1º' },
    { ufOrigem: 'SP', ufDestino: 'RJ', aliquota: 12, temBeneficio: false, tipoOperacao: 'SAIDA', fonteLegal: 'CONFAZ — Resolução SF 13/2012, art. 1º' },
    { ufOrigem: 'SP', ufDestino: 'PR', aliquota: 12, temBeneficio: false, tipoOperacao: 'SAIDA', fonteLegal: 'CONFAZ — Resolução SF 13/2012, art. 1º' },
    { ufOrigem: 'SP', ufDestino: 'AM', aliquota: 0,  temBeneficio: true,  tipoOperacao: 'SAIDA', fonteLegal: 'CONFAZ Convênio 52/2022 — Zona Franca de Manaus' },
    { ufOrigem: 'SP', ufDestino: 'SC', aliquota: 12, temBeneficio: false, tipoOperacao: 'SAIDA', fonteLegal: 'CONFAZ — Resolução SF 13/2012, art. 1º' },
    { ufOrigem: 'SP', ufDestino: 'RS', aliquota: 12, temBeneficio: false, tipoOperacao: 'SAIDA', fonteLegal: 'CONFAZ — Resolução SF 13/2012, art. 1º' },
    { ufOrigem: 'MG', ufDestino: 'SP', aliquota: 12, temBeneficio: false, tipoOperacao: 'SAIDA', fonteLegal: 'CONFAZ — Resolução SF 13/2012, art. 1º' },
    { ufOrigem: 'RJ', ufDestino: 'SP', aliquota: 12, temBeneficio: false, tipoOperacao: 'SAIDA', fonteLegal: 'CONFAZ — Resolução SF 13/2012, art. 1º' },
  ];

  for (const item of regrasPorNcm) {
    for (const rota of rotasPadrao) {
      rotas.push({ ncmCodigo: item.codigo, ...rota });
    }
  }

  let icmsCount = 0;
  for (const regra of rotas) {
    const ncm = ncmRecords[regra.ncmCodigo];
    if (!ncm) continue;

    // Verifica se já existe para evitar duplicate
    const exists = await prisma.icmsRegra.findFirst({
      where: { ncmId: ncm.id, ufOrigem: regra.ufOrigem, ufDestino: regra.ufDestino, tipoOperacao: regra.tipoOperacao },
    });

    if (!exists) {
      await prisma.icmsRegra.create({
        data: {
          ncmId: ncm.id,
          ufOrigem: regra.ufOrigem,
          ufDestino: regra.ufDestino,
          aliquota: regra.aliquota,
          temBeneficio: regra.temBeneficio,
          tipoOperacao: regra.tipoOperacao,
          fonteLegal: regra.fonteLegal,
          validoDesde: new Date('2024-01-01'),
        },
      });
      icmsCount++;
    }
  }
  console.log(`✅ ${icmsCount} regras ICMS criadas`);

  // ─────────────────────────────────────────────────────────────────
  // 8. Municípios Fiscais com alíquotas ISS
  // ─────────────────────────────────────────────────────────────────
  const municipios = [
    { codigoIbge: '3550308', nome: 'São Paulo',       uf: 'SP', aliquotaIss: 2.0, temRetencaoIss: true  },
    { codigoIbge: '3106200', nome: 'Belo Horizonte',  uf: 'MG', aliquotaIss: 5.0, temRetencaoIss: true  },
    { codigoIbge: '3304557', nome: 'Rio de Janeiro',  uf: 'RJ', aliquotaIss: 5.0, temRetencaoIss: true  },
    { codigoIbge: '4106902', nome: 'Curitiba',        uf: 'PR', aliquotaIss: 2.5, temRetencaoIss: true  },
    { codigoIbge: '4115200', nome: 'Maringá',         uf: 'PR', aliquotaIss: 2.0, temRetencaoIss: false },
    { codigoIbge: '4314902', nome: 'Porto Alegre',    uf: 'RS', aliquotaIss: 5.0, temRetencaoIss: true  },
    { codigoIbge: '4205407', nome: 'Florianópolis',   uf: 'SC', aliquotaIss: 2.0, temRetencaoIss: false },
    { codigoIbge: '1302603', nome: 'Manaus',          uf: 'AM', aliquotaIss: 2.0, temRetencaoIss: false },
  ];

  for (const m of municipios) {
    await prisma.municipioFiscal.upsert({
      where: { codigoIbge: m.codigoIbge },
      update: {},
      create: m,
    });
  }
  console.log(`✅ ${municipios.length} municípios fiscais criados (incl. Maringá/PR)`);

  console.log('\n🎉 Seed concluído! Dados para login:');
  console.log('   Email: dev@berith.com.br');
  console.log('   Senha: senha123');
}

main()
  .catch((e) => { console.error('❌ Erro no seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
