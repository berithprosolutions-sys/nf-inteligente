const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

const p12Path = path.join(__dirname, 'certificado_a1_ficticio.p12');
const password = 'senha123';

try {
    const p12Der = fs.readFileSync(p12Path, 'binary');
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

    // Buscar as chaves e certificados
    const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const certBag = bags[forge.pki.oids.certBag][0];
    const cert = certBag.cert;

    console.log('--- CERTIFICADO VALIDADO ---');
    console.log('Sujeito (Subject):', cert.subject.getField('CN').value);
    console.log('Vencimento (NotAfter):', cert.validity.notAfter);
    console.log('Emissor (Issuer):', cert.issuer.getField('CN').value);
    console.log('---------------------------');
    console.log('STATUS: Certificado lido com sucesso usando a senha fornecida.');
    
} catch (err) {
    console.error('ERRO AO LER CERTIFICADO:', err.message);
}
