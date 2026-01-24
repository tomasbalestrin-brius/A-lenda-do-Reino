import React, { useState } from 'react';
import { useGameStore } from '../../core/store';

export default function InventoryModal({ open, onClose }) {
  const inventory = useGameStore((s) => s.inventory);
  const useItem = useGameStore((s) => s.useItem);
  const sellItem = useGameStore((s) => s.sellItem);
  const [selectedItem, setSelectedItem] = useState(null);

  if (!open) return null;

  const items = inventory?.items || [];
  const gold = inventory?.gold || 0;
  const weight = inventory?.weight || 0;
  const capacity = inventory?.capacity || 50;
  const percentWeight = Math.min(100, (weight / capacity) * 100);

  // Agrupar itens por tipo
  const itemsByType = items.reduce((acc, item) => {
    const tipo = item.tipo || 'outros';
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(item);
    return acc;
  }, {});

  const getTipoNome = (tipo) => {
    const nomes = {
      consumivel: 'Consumíveis',
      arma: 'Armas',
      armadura: 'Armaduras',
      escudo: 'Escudos',
      acessorio: 'Acessórios',
      aventura: 'Aventura',
      pergaminho: 'Pergaminhos',
      outros: 'Outros'
    };
    return nomes[tipo] || tipo;
  };

  const handleUseItem = (itemId) => {
    useItem(itemId);
    setSelectedItem(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 10050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '900px',
        maxWidth: '100%',
        maxHeight: '90vh',
        background: 'linear-gradient(to bottom, #1a1f2e, #0f1419)',
        border: '2px solid #4a5568',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '2px solid #4a5568',
          background: 'rgba(0,0,0,0.3)'
        }}>
          <div>
            <h3 style={{
              margin: '0 0 4px 0',
              color: '#f7fafc',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              Inventário
            </h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#cbd5e0' }}>
              <span>💰 {gold} PO</span>
              <span>⚖️ {weight.toFixed(1)} / {capacity} kg ({percentWeight.toFixed(0)}%)</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#fff',
              background: '#dc2626',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#b91c1c'}
            onMouseOut={(e) => e.target.style.background = '#dc2626'}
          >
            Fechar (I)
          </button>
        </div>

        {/* Weight Bar */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #4a5568' }}>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#2d3748',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${percentWeight}%`,
              height: '100%',
              background: percentWeight > 90 ? '#dc2626' : (percentWeight > 75 ? '#f59e0b' : '#10b981'),
              transition: 'all 0.3s'
            }} />
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          {items.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9ca3af',
              fontSize: '16px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <div>Inventário vazio</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                Encontre itens explorando o mundo ou comprando em lojas
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.entries(itemsByType).map(([tipo, itemsDoTipo]) => (
                <section key={tipo}>
                  <h4 style={{
                    margin: '0 0 12px 0',
                    color: '#93c5fd',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderBottom: '1px solid #4a5568',
                    paddingBottom: '8px'
                  }}>
                    {getTipoNome(tipo)} ({itemsDoTipo.length})
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '12px'
                  }}>
                    {itemsDoTipo.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                        style={{
                          background: selectedItem?.id === item.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.3)',
                          border: selectedItem?.id === item.id ? '2px solid #3b82f6' : '1px solid #4a5568',
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                        onMouseOver={(e) => {
                          if (selectedItem?.id !== item.id) {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                            e.currentTarget.style.borderColor = '#cbd5e0';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (selectedItem?.id !== item.id) {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                            e.currentTarget.style.borderColor = '#4a5568';
                          }
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: '#4a5568',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: '#fff'
                        }}>
                          x{item.quantidade}
                        </div>
                        <div style={{
                          color: '#f7fafc',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          marginBottom: '4px',
                          paddingRight: '40px'
                        }}>
                          {item.nome}
                        </div>
                        <div style={{
                          color: '#9ca3af',
                          fontSize: '12px',
                          marginBottom: '8px'
                        }}>
                          {item.preco ? `${item.preco} PO` : ''}
                          {item.peso ? ` • ${item.peso} kg` : ''}
                        </div>
                        {item.atk && (
                          <div style={{ fontSize: '12px', color: '#f87171' }}>
                            ⚔️ ATK: {item.atk}
                          </div>
                        )}
                        {item.def && (
                          <div style={{ fontSize: '12px', color: '#60a5fa' }}>
                            🛡️ DEF: {item.def}
                          </div>
                        )}
                        {item.cura && (
                          <div style={{ fontSize: '12px', color: '#34d399' }}>
                            ❤️ Cura: {item.cura} HP
                          </div>
                        )}
                        {item.restauraMp && (
                          <div style={{ fontSize: '12px', color: '#818cf8' }}>
                            💙 Restaura: {item.restauraMp} MP
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Item Actions */}
        {selectedItem && (
          <div style={{
            padding: '16px 24px',
            borderTop: '2px solid #4a5568',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, color: '#cbd5e0' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {selectedItem.nome}
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                {selectedItem.descricao || 'Sem descrição'}
              </div>
            </div>
            {selectedItem.tipo === 'consumivel' && (
              <button
                onClick={() => handleUseItem(selectedItem.id)}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
                onMouseOver={(e) => e.target.style.background = '#059669'}
                onMouseOut={(e) => e.target.style.background = '#10b981'}
              >
                Usar
              </button>
            )}
            <button
              onClick={() => sellItem(selectedItem.id, 1)}
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => e.target.style.background = '#d97706'}
              onMouseOut={(e) => e.target.style.background = '#f59e0b'}
            >
              Vender ({Math.floor((selectedItem.preco || 0) * 0.5)} PO)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
