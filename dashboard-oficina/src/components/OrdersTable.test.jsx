import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OrdersTable from './OrdersTable';

describe('OrdersTable', () => {
  it('renderiza título e contador de ordens', () => {
    const orders = [
      { id: 1, status: 'aberta', valor: 150.00, dataAbertura: '2024-01-10', dataFechamento: null }
    ];
    
    render(<OrdersTable orders={orders} />);
    
    expect(screen.getByText(/Ordens de Serviço/i)).toBeInTheDocument();
    expect(screen.getByText(/1 ordem/i)).toBeInTheDocument();
  });

  it('renderiza múltiplas ordens', () => {
    const orders = [
      { id: 1, status: 'aberta', valor: 150.00, dataAbertura: '2024-01-10', dataFechamento: null },
      { id: 2, status: 'fechada', valor: 300.00, dataAbertura: '2024-01-08', dataFechamento: '2024-01-09' }
    ];
    
    render(<OrdersTable orders={orders} />);
    
    expect(screen.getByText(/2 ordens/i)).toBeInTheDocument();
    expect(screen.getByText(/#1/)).toBeInTheDocument();
    expect(screen.getByText(/#2/)).toBeInTheDocument();
  });

  it('aplica classe warning para status aberta', () => {
    const orders = [
      { id: 1, status: 'aberta', valor: 150.00, dataAbertura: '2024-01-10', dataFechamento: null }
    ];
    
    const { container } = render(<OrdersTable orders={orders} />);
    
    expect(container.querySelector('.status-warning')).toBeInTheDocument();
  });

  it('aplica classe success para status fechada', () => {
    const orders = [
      { id: 2, status: 'fechada', valor: 300.00, dataAbertura: '2024-01-08', dataFechamento: '2024-01-09' }
    ];
    
    const { container } = render(<OrdersTable orders={orders} />);
    
    expect(container.querySelector('.status-success')).toBeInTheDocument();
  });

  it('formata valores monetários corretamente', () => {
    const orders = [
      { id: 1, status: 'aberta', valor: 1234.56, dataAbertura: '2024-01-10', dataFechamento: null }
    ];
    
    render(<OrdersTable orders={orders} />);
    
    expect(screen.getByText(/R\$ 1234\.56/)).toBeInTheDocument();
  });

  it('renderiza travessão quando não há data de fechamento', () => {
    const orders = [
      { id: 1, status: 'aberta', valor: 150.00, dataAbertura: '2024-01-10', dataFechamento: null }
    ];
    
    const { container } = render(<OrdersTable orders={orders} />);
    
    expect(container.querySelector('.empty-value')).toBeInTheDocument();
  });

  it('renderiza data de fechamento quando presente', () => {
    const orders = [
      { id: 2, status: 'fechada', valor: 300.00, dataAbertura: '2024-01-08', dataFechamento: '2024-01-09' }
    ];
    
    render(<OrdersTable orders={orders} />);
    
    expect(screen.getByText('2024-01-09')).toBeInTheDocument();
  });

  it('renderiza tabela vazia quando não há ordens', () => {
    render(<OrdersTable orders={[]} />);
    
    expect(screen.getByText(/0 ordens/i)).toBeInTheDocument();
  });
});