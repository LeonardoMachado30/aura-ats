// pages/vaga/[uuid].tsx
import api from '@/axios'; // Certifique-se que o caminho está correto
import { PrimaryButton } from '@/components/button/PrimaryButton';
import Card from '@/components/Card'; // Certifique-se que o caminho está correto
import CandidatoForm from '@/components/form/CandidatoForm';
import VagaForm from '@/components/form/VagaForm';
import { EditPenIcon, TrashIcon } from '@/components/icons'; // Certifique-se que o caminho está correto
import Modal from '@/components/modal/Modal'; // Certifique-se que o caminho está correto
import CandidatoSearch from '@/components/search/CandidatoSearch';
import Tabs from '@/components/utils/Tabs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const VagaPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // 'uuid' será o ID da vaga

  const [vaga, setVaga] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalCandidato, setShowModalCandidato] = useState(false);
  const [currentTab, setCurrentTab] = useState('');

  const fetchVaga = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/external/vaga/${id}`);
      setVaga(res.data);
    } catch (_) {
      setError('Vaga não encontrada ou erro ao buscar dados.');
      setVaga(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchVaga();
  }, [id]);

  const handleDelete = async () => {
    if (!vaga) return;
    if (confirm('Tem certeza que deseja excluir esta vaga?')) {
      try {
        await api.delete(`/api/vaga/${vaga.id}`);
        router.push('/vagas');
      } catch {
        alert('Erro ao excluir vaga.');
      }
    }
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary text-lg">Carregando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-red-600 text-xl font-semibold mb-4">{error}</span>
      </div>
    );
  }

  if (!vaga) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-primary flex-grow">
        VAGA
      </h1>

      <div className="flex justify-between items-center mb-8">
        <button
          className="px-4 py-2 bg-primary text-white rounded shadow-md hover:scale-105 transition-transform"
          onClick={() => router.back()}
        >
          Voltar
        </button>

        <div className="flex gap-2">
          <button
            className="px-3 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110 transition-transform"
            onClick={() => setShowModalEdit(true)}
          >
            <EditPenIcon />
          </button>
          <button
            className="px-3 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110 transition-transform"
            onClick={handleDelete}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Informações Principais da Vaga */}
        <Card
          classNameContainer="col-span-full"
          classNameContent="gap-2 flex flex-col"
        >
          <h1 className="font-black text-xl">{vaga.titulo}</h1>
          <div className="flex items-center">
            <span className="font-medium">Descrição:</span>
            <p className="ml-2 text-secondary inline-block">{vaga.descricao}</p>
          </div>
          {vaga.requisitos && (
            <div className="flex items-center">
              <span className="font-medium">Requisitos:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.requisitos}
              </p>
            </div>
          )}
          {vaga.responsabilidades && (
            <div className="flex items-center">
              <span className="font-medium">Responsabilidades:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.responsabilidades}
              </p>
            </div>
          )}
          <div className="flex items-center">
            <span className="font-medium">Salário:</span>
            <p className="ml-2 text-secondary inline-block">
              {formatCurrency(vaga.salario)}
              {vaga.tipoSalario && `(${vaga.tipoSalario})`}
            </p>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Data Publicação:</span>
            <p className="ml-2 text-secondary inline-block">
              {vaga.dataPublicacao}
            </p>
          </div>
          {vaga.dataFechamento && (
            <div className="flex items-center">
              <span className="font-medium">Data Fechamento:</span>
              <p className="ml-2 text-secondary inline-block">
                {formatDate(vaga.dataFechamento)}
              </p>
            </div>
          )}
          <section className="flex gap-6 mt-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">Categoria:</span>
              <p className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary text-secondary inline-block m-0">
                {vaga.categoria}
              </p>
            </div>

            <div className="flex items-center">
              <span className="font-medium mr-2">Status:</span>
              <p className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary text-secondary inline-block m-0">
                {vaga.status}
              </p>
            </div>

            {vaga.tipoContrato && (
              <div className="flex items-center">
                <span className="font-medium mr-2">Tipo Contrato:</span>
                <p className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary text-secondary inline-block m-0">
                  {vaga.tipoContrato}
                </p>
              </div>
            )}

            {vaga.nivelExperiencia && (
              <div className="flex items-center">
                <span className="font-medium mr-2">Nível Experiência:</span>
                <p className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary text-secondary inline-block m-0">
                  {vaga.nivelExperiencia}
                </p>
              </div>
            )}

            {vaga.areaCandidato && (
              <div className="flex items-center">
                <span className="font-medium mr-2">Área Candidato:</span>
                <p className="bg-[#ede9fe] text-primary text-xs font-semibold px-3 py-1 rounded-full border border-secondary text-secondary inline-block m-0">
                  {vaga.areaCandidato}
                </p>
              </div>
            )}
          </section>
        </Card>

        {vaga?.cliente?.empresa && (
          <Card title="Dados do Cliente">
            <div className="flex items-center">
              <span className="font-medium">CNPJ:</span>

              <p className="ml-2 text-secondary inline-block">
                {vaga.cliente.empresa.cnpj}
              </p>

              <Link
                href={`/cliente/${vaga.cliente.id}`}
                className="bg-primary hover:scale-110 rounded flex ml-2"
              >
                <span className="material-icons-outlined text-white">
                  search
                </span>
              </Link>
            </div>

            <div className="flex items-center">
              <span className="font-medium">Razão Social:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.cliente.empresa.razaoSocial}
              </p>
            </div>

            <div className="flex items-center">
              <span className="font-medium">Nome Fantasia:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.cliente.empresa.nomeFantasia}
              </p>
            </div>
          </Card>
        )}

        {vaga.localizacao && (
          <Card title="Localização da Vaga">
            <div className="flex items-center">
              <span className="font-medium">Endereço:</span>
              <p className="ml-2 text-secondary inline-block">
                {vaga.localizacao.logradouro
                  ? `${vaga.localizacao.logradouro}, `
                  : ''}
                {vaga.localizacao.bairro ? `${vaga.localizacao.bairro}, ` : ''}
                {vaga.localizacao.cidade} - {vaga.localizacao.uf}
              </p>
            </div>

            {vaga.localizacao.cep && (
              <div className="flex items-center">
                <span className="font-medium">CEP:</span>
                <p className="ml-2 text-secondary inline-block">
                  {vaga.localizacao.cep}
                </p>
              </div>
            )}

            {vaga.localizacao.complemento && (
              <div className="flex items-center">
                <span className="font-medium">Complemento:</span>
                <p className="ml-2 text-secondary inline-block">
                  {vaga.localizacao.complemento}
                </p>
              </div>
            )}

            {vaga.localizacao.regiao && (
              <div className="flex items-center">
                <span className="font-medium">Região:</span>
                <p className="ml-2 text-secondary inline-block">
                  {vaga.localizacao.regiao}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Benefícios */}
        {vaga.beneficios && vaga.beneficios.length > 0 && (
          <Card title="Benefícios Oferecidos">
            {vaga.beneficios.map((beneficio: any) => (
              <div key={beneficio.id} className="mb-2 flex items-center">
                <span className="font-medium">{beneficio.nome || 'N/A'}:</span>
                <p className="ml-2 text-secondary inline-block">
                  {beneficio.descricao || 'N/A'}
                </p>
              </div>
            ))}
          </Card>
        )}

        {/* Habilidades */}
        {vaga.habilidades && vaga.habilidades.length > 0 && (
          <Card title="Habilidades Exigidas">
            {vaga.habilidades.map((vh: any) => (
              <div key={vh.habilidadeId} className="mb-2 flex items-center">
                <p className="text-secondary inline-block">
                  {vh.nivelExigido || 'Não especificado'}
                </p>
                <span className="mx-1">-</span>
                <p className="text-secondary inline-block">
                  {vh.habilidade.nome || 'Não especificado'}
                </p>
                <span className="mx-1">-</span>
                <p className="text-secondary inline-block">
                  {vh.habilidade.tipoHabilidade || 'Não especificado'}
                </p>
              </div>
            ))}
          </Card>
        )}

        {/* Anexos */}
        {vaga.anexos && vaga.anexos.length > 0 && (
          <Card title="Anexos da Vaga">
            {vaga.anexos.map((va: any) => (
              <div key={va.anexoId} className="mb-2 flex items-center">
                <a
                  href={va.anexo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <p className="text-secondary inline-block m-0">
                    {va.anexo.nomeArquivo}
                  </p>
                </a>
                {va.anexo.tipo && (
                  <span className="text-sm text-gray-500">
                    ({va.anexo.tipo})
                  </span>
                )}
              </div>
            ))}
          </Card>
        )}
      </div>

      <div className="flex mt-10"></div>

      {/* Acesso às Triagens da Vaga */}
      <div className="flex justify-center mt-6 mb-6">
        <Link
          href={`/vaga/${vaga.id}/triagens`}
          className="px-4 py-2 bg-primary text-white rounded shadow-md hover:scale-105 transition-transform"
        >
          Ver Triagens da Vaga
        </Link>
      </div>

      <div className="flex justify-center mt-10 mb-4 relative">
        <h3 className="text-2xl font-bold text-center text-primary w-full ">
          PROFISSIONAIS CADASTRADOS
        </h3>

        <PrimaryButton
          className="float-right flex text-nowrap absolute right-0"
          onClick={() => setShowModalCandidato(true)}
        >
          + Adicionar Candidato
        </PrimaryButton>

        <Modal
          title={`${currentTab} Profissional`}
          isOpen={showModalCandidato}
          onClose={() => setShowModalCandidato(false)}
        >
          <Tabs
            tabs={['Consultar', 'Cadastrar']}
            currentTab={currentTab}
            classNameContainer="mt-4"
            classNameTabs="mb-2"
            classNameContent="pt-2"
            onTabChange={tab => setCurrentTab(tab as typeof currentTab)}
          >
            <CandidatoSearch
              idVaga={vaga.id}
              onSuccess={async () => {
                setShowModalCandidato(false);
                await fetchVaga();
              }}
              onDelete={() => console.log('Removido')}
            />

            <CandidatoForm></CandidatoForm>
          </Tabs>
        </Modal>
      </div>

      <section className="flex gap-2 w-full flex-wrap items-center justify-center lg:justify-start">
        {vaga.candidatos &&
          vaga.candidatos.map((candidato: any, idx: number) => {
            // Exclui o campo 'id' da listagem
            const { id, ...dadosCandidato } = candidato;
            return (
              <Link
                href={`/candidato/${candidato.id}`}
                className="w-full lg:max-w-[320px]"
                key={candidato.id}
              >
                <Card key={idx}>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      {/* <span className="font-semibold">Nome:</span> */}
                      <span className="font-bold uppercase">
                        {candidato.pessoa.nome ?? '-'}
                      </span>
                    </div>

                    <div className="flex gap-2 text-sm">
                      <span className="font-semibold">Área:</span>
                      <span>{candidato.areaCandidato ?? '-'}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="font-semibold">CRM:</span>
                      <span>{candidato.crm ?? '-'}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="font-semibold">RQE:</span>
                      <span>{candidato.rqe ?? '-'}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="font-semibold">Especialidade:</span>
                      <span>{candidato?.especialidade?.nome ?? '-'}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
      </section>

      {/* Modal de Edição (Placeholder) */}
      <Modal
        isOpen={showModalEdit}
        onClose={() => setShowModalEdit(false)}
        title="Editar Vaga"
      >
        <VagaForm
          onSuccess={vaga => {
            setShowModalEdit(false);
            setVaga(vaga);
          }}
          initialValues={vaga}
        />
      </Modal>
    </div>
  );
};

export default VagaPage;
