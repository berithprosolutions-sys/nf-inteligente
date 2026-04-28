// FEATURE: auth
// Responsabilidade: Lógica de negócio de autenticação (hash, JWT, refresh)
// NÃO faz: Rotas HTTP (ver auth.routes.ts)
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { AppError, ConflictError, UnauthorizedError } from '../../lib/errors.js';
import type { RegisterDTO, LoginDTO } from './auth.schema.js';
import type { FastifyInstance } from 'fastify';

export class AuthService {
  constructor(private readonly fastify: FastifyInstance) {}

  async register(dto: RegisterDTO) {
    // Verificar duplicidade de e-mail
    const existe = await prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (existe) throw new ConflictError('E-mail já cadastrado');

    // Verificar CNPJ
    const empresaExiste = await prisma.empresa.findUnique({
      where: { cnpj: dto.empresa.cnpj },
    });
    if (empresaExiste) throw new ConflictError('CNPJ já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Criar empresa + usuário em transação atômica
    const resultado = await prisma.$transaction(async (tx) => {
      const empresa = await tx.empresa.create({
        data: {
          razaoSocial: dto.empresa.razaoSocial,
          cnpj: dto.empresa.cnpj,
          regimeTributario: dto.empresa.regimeTributario,
          uf: dto.empresa.uf,
          municipio: dto.empresa.municipio,
          codigoMunicipio: dto.empresa.codigoMunicipio,
          inscricaoEstadual: dto.empresa.inscricaoEstadual,
          inscricaoMunicipal: dto.empresa.inscricaoMunicipal,
          cnae: dto.empresa.cnae,
        },
      });

      const usuario = await tx.usuario.create({
        data: {
          nome: dto.nome,
          email: dto.email,
          passwordHash,
          empresaId: empresa.id,
          role: 'OWNER',
        },
      });

      // Criar a Licença Trial de 7 dias
      await tx.licenca.create({
        data: {
          empresaId: empresa.id,
          status: 'TRIAL',
          trialExpiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 dias
        },
      });

      return { empresa, usuario };
    });

    return this.gerarTokens(resultado.usuario.id, resultado.usuario.empresaId);
  }

  async login(dto: LoginDTO) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: dto.email },
      include: { empresa: true },
    });

    if (!usuario) throw new UnauthorizedError('Usuário não cadastrado ou e-mail inexistente.');
    if (!usuario.ativo) throw new UnauthorizedError('Conta desativada. Acione o suporte.');

    const senhaCorreta = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!senhaCorreta) throw new UnauthorizedError('Senha incorreta. Verifique e tente novamente.');

    // Atualizar último acesso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcesso: new Date() },
    });

    const tokens = await this.gerarTokens(usuario.id, usuario.empresaId);

    return {
      tokens,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        empresa: {
          id: usuario.empresa.id,
          razaoSocial: usuario.empresa.razaoSocial,
          cnpj: usuario.empresa.cnpj,
          regimeTributario: usuario.empresa.regimeTributario,
          uf: usuario.empresa.uf,
          municipio: usuario.empresa.municipio,
          plano: usuario.empresa.plano,
        },
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.fastify.jwt.verify<{ sub: string; empresaId: string; type: string }>(refreshToken);
      if (payload.type !== 'refresh') throw new Error();

      const usuario = await prisma.usuario.findUnique({
        where: { id: payload.sub },
      });
      if (!usuario || !usuario.ativo) throw new UnauthorizedError('Token inválido');

      return this.gerarTokens(usuario.id, usuario.empresaId);
    } catch {
      throw new UnauthorizedError('Refresh token inválido ou expirado');
    }
  }

  private async gerarTokens(usuarioId: string, empresaId: string) {
    const accessToken = this.fastify.jwt.sign(
      { sub: usuarioId, empresaId, type: 'access' },
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
    );

    const refreshToken = this.fastify.jwt.sign(
      { sub: usuarioId, empresaId, type: 'refresh' },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d' }
    );

    return { accessToken, refreshToken };
  }

  async atualizarEmpresa(id: string, dto: any) {
    return prisma.empresa.update({
      where: { id },
      data: dto
    });
  }
}
