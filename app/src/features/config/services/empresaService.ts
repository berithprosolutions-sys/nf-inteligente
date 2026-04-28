import { axiosClient } from '@/shared/lib/axiosClient';

export interface EmpresaUpdateDTO {
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  cnae?: string;
  regimeTributario?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
}

export const empresaService = {
  async atualizar(id: string, data: EmpresaUpdateDTO): Promise<any> {
    const res = await axiosClient.put(`/auth/empresa/${id}`, data);
    return res.data.data;
  }
};
