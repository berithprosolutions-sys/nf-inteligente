// FEATURE: certificado
// Responsabilidade: Rotas HTTP para upload de PFX (protegidas por JWT)
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/multipart';
import { CertificadoService } from './certificado.service.js';
import { ok } from '../../lib/response.js';

export const certificadoRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new CertificadoService();

  fastify.addHook('onRequest', fastify.authenticate);

  // POST /certificado/upload
  fastify.post('/certificado/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    const { empresaId } = request.user as { empresaId: string };
    
    // Ler multipart/form-data
    const data = await request.file();
    if (!data) return reply.code(400).send({ success: false, error: 'Arquivo não enviado' });

    // Precisamos da string 'senha'. Em multipart, fields ficam em data.fields
    // No fastify-multipart, fields vêm como objetos complexos
    const senhaPart = data.fields.senha;
    let senha = '';
    
    if (senhaPart && 'value' in senhaPart) {
      senha = String(senhaPart.value);
    } else {
      return reply.code(400).send({ success: false, error: 'Senha é obrigatória' });
    }

    const pfxBuffer = await data.toBuffer();
    
    await service.uploadCertificado(empresaId, pfxBuffer, senha);
    return reply.code(201).send(ok({ mensagem: 'Certificado instalado com sucesso' }));
  });

  fastify.get('/certificado/status', async (request: FastifyRequest, reply: FastifyReply) => {
    const { empresaId } = request.user as { empresaId: string };
    const status = await service.hasCertificado(empresaId);
    return reply.send(ok(status));
  });

  fastify.delete('/certificado', async (request: FastifyRequest, reply: FastifyReply) => {
    const { empresaId } = request.user as { empresaId: string };
    await service.removerCertificado(empresaId);
    return reply.send(ok({ mensagem: 'Certificado removido' }));
  });
};
