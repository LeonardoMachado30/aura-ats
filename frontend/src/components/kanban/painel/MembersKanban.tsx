import { buscarUsuariosSistema } from '@/axios/kanban.axios';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { CardKanban, UsuarioSistema } from '@/schemas/kanban.schema';
import { getUsuarioNome } from '@/utils/kanban';
import { useCallback, useEffect, useState } from 'react';
import { FiLoader, FiUsers, FiX } from 'react-icons/fi';
import { Painel, type popupPositionType } from './Painel';

interface MembersKanbanProps {
  popupPosition: popupPositionType;
  activePanel: string | null;
  setActivePanel: (activePanel: 'labels' | 'dates' | 'checklist' | 'members' | null) => void;
  card: CardKanban;
  onAdicionarMembro: (cardId: string, usuarioSistemaId: string) => Promise<void>;
  onRemoverMembro: (cardId: string, usuarioSistemaId: string) => Promise<void>;
  onUpdate?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null> | null;
}

export const MembersKanban = ({
  popupPosition,
  activePanel,
  setActivePanel,
  card,
  onAdicionarMembro,
  onRemoverMembro,
  onUpdate,
  buttonRef
}: MembersKanbanProps) => {
  const [searchUsuario, setSearchUsuario] = useState('');
  const [usuariosSugeridos, setUsuariosSugeridos] = useState<UsuarioSistema[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  const buscarUsuariosCallback = useCallback(
    async (search: string) => {
      const termo = search.trim();

      if (!termo || termo.length < 2) {
        setUsuariosSugeridos([]);
        setShowAutocomplete(false);
        return;
      }

      setLoadingUsuarios(true);
      try {
        const usuarios = await buscarUsuariosSistema(termo, 10);
        // Filtrar usuários que já são membros do card
        const membrosIds = new Set(
          (card.membros || []).map(m => m.usuarioSistemaId)
        );
        const usuariosDisponiveis = usuarios.filter(
          u => u && !membrosIds.has(u.id)
        );
        setUsuariosSugeridos(usuariosDisponiveis);
        setShowAutocomplete(usuariosDisponiveis.length > 0);
      } catch (error) {
        console.log('Erro ao buscar usuários:', error);
        setUsuariosSugeridos([]);
        setShowAutocomplete(false);
      } finally {
        setLoadingUsuarios(false);
      }
    },
    [card.membros]
  );

  const buscarUsuariosDebounced = useDebouncedCallback(
    buscarUsuariosCallback,
    1000
  );

  useEffect(() => {
    const termo = searchUsuario.trim();
    if (!termo) {
      setUsuariosSugeridos([]);
      setShowAutocomplete(false);
      return;
    }
    buscarUsuariosDebounced(termo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchUsuario]);

  const handleAdicionarMembro = async (usuarioSistemaId: string) => {
    setAddingMember(true);
    try {
      await onAdicionarMembro(card.id, usuarioSistemaId);
      setSearchUsuario('');
      setUsuariosSugeridos([]);
      setShowAutocomplete(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao adicionar membro:', error);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoverMembro = async (usuarioSistemaId: string) => {
    try {
      await onRemoverMembro(card.id, usuarioSistemaId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao remover membro:', error);
    }
  };

  // Fechar autocomplete ao clicar fora
  useEffect(() => {
    if (!showAutocomplete) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.autocomplete-container')) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAutocomplete]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setActivePanel(activePanel === 'members' ? null : 'members')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activePanel === 'members'
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        <FiUsers className="w-4 h-4" />
        Membros
      </button>

      {activePanel === 'members' && popupPosition && (
        <Painel popupPosition={popupPosition} title="Membros" panelType="members">
          <>
            <div className="mb-3 autocomplete-container relative">
              <input
                type="text"
                value={searchUsuario}
                onChange={e => setSearchUsuario(e.target.value)}
                placeholder="Buscar usuário..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showAutocomplete && usuariosSugeridos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {usuariosSugeridos
                    .filter((u): u is UsuarioSistema => Boolean(u))
                    .map((usuario: UsuarioSistema) => (
                      <button
                        key={usuario!.id}
                        type="button"
                        onClick={() => handleAdicionarMembro(usuario!.id)}
                        disabled={addingMember}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {getUsuarioNome(usuario)}
                      </button>
                    ))}
                </div>
              )}
              {loadingUsuarios && (
                <div className="absolute right-3 top-2.5">
                  <FiLoader className="animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              {(card.membros || []).map(membro => (
                <div
                  key={membro.usuarioSistemaId}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm text-gray-700">
                    {getUsuarioNome(membro.usuarioSistema)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoverMembro(membro.usuarioSistemaId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!card.membros || card.membros.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum membro adicionado
                </p>
              )}
            </div>
          </>
        </Painel>
      )}
    </>
  );
};
