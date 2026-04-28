// FEATURE: certificado
// Responsabilidade: Gerir o upload e armazenamento criptografado de certificados digitais A1
import { prisma } from '../../lib/prisma.js';
import { AppError, NotFoundError } from '../../lib/errors.js';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// A chave deve ter exatos 32 bytes
const AES_KEY = Buffer.from(process.env.CERT_ENCRYPTION_KEY || '0000000000000000000000000000000000000000000000000000000000000000', 'hex');

export class CertificadoService {
  
  // Criptografa a senha do certificado para não ficar em texto plano
  private encryptPassword(text: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, AES_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    // Salva iv + authTag + cypher
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  // Descriptografa a senha quando for usar o certificado (na SEFAZ)
  private decryptPassword(hash: string): string {
    const [ivHex, authTagHex, encrypted] = hash.split(':');
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      AES_KEY,
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async uploadCertificado(empresaId: string, pfxBuffer: Buffer, senhaOriginal: string) {
    // Validar a validade do certificado extraindo dele?
    // Para fins do mock inicial/Fase 3 deixaremos hardcoded a validade ou tentamos parsear (pkcs12)
    // Para simplificar, assumimos que vale por 1 ano.
    const validade = new Date();
    validade.setFullYear(validade.getFullYear() + 1);

    const senhaCriptografada = this.encryptPassword(senhaOriginal);

    return prisma.certificadoDigital.upsert({
      where: { empresaId },
      update: {
        pfxDados: pfxBuffer,
        senhaCriptografada,
        validade,
      },
      create: {
        empresaId,
        pfxDados: pfxBuffer,
        senhaCriptografada,
        validade,
      }
    });
  }

  async hasCertificado(empresaId: string): Promise<{
    temCertificado: boolean;
    vencimento?: string;
    subject?: string;
    serial?: string;
  }> {
    const cert = await prisma.certificadoDigital.findUnique({
      where: { empresaId },
      select: { validade: true, id: true }
    });
    if (!cert) return { temCertificado: false };
    return {
      temCertificado: true,
      vencimento: cert.validade.toISOString(),
      serial: cert.id.substring(0, 16).toUpperCase(),
    };
  }

  async removerCertificado(empresaId: string): Promise<void> {
    await prisma.certificadoDigital.deleteMany({
      where: { empresaId }
    });
  }
}
