import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Indicators } from './Indicators';

describe('Indicators', () => {
  it('renderiza todos os indicadores corretamente', () => {
    render(<Indicators totalFaturado={5000} ticketMedio={250} abertas={3} fechadas={7} />);
    
    expect(screen.getByText(/Total Faturado/i)).toBeInTheDocument();
    expect(screen.getByText(/Ticket Médio/i)).toBeInTheDocument();
    expect(screen.getByText(/Ordens Abertas/i)).toBeInTheDocument();
    expect(screen.getByText(/Ordens Fechadas/i)).toBeInTheDocument();
  });

  it('formata valores monetários corretamente', () => {
    const { container } = render(<Indicators totalFaturado={12345.67} ticketMedio={432.10} abertas={5} fechadas={10} />);
    
    expect(container.innerHTML).toMatch(/12\.345,67/);
    expect(container.innerHTML).toMatch(/432,10/);
  });

  it('renderiza trend positivo', () => {
    const { container } = render(<Indicators totalFaturado={1000} ticketMedio={200} abertas={2} fechadas={5} />);
    
    expect(container.querySelector('.trend-positive')).toBeInTheDocument();
  });

  it('renderiza subtítulos quando presentes', () => {
    render(<Indicators totalFaturado={1000} ticketMedio={200} abertas={2} fechadas={5} />);
    
    expect(screen.getByText(/Em andamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Concluídas/i)).toBeInTheDocument();
  });

  it('renderiza emojis corretamente', () => {
    const { container } = render(<Indicators totalFaturado={1000} ticketMedio={200} abertas={2} fechadas={5} />);
    
    expect(container.innerHTML).toMatch(/💰/);
    expect(container.innerHTML).toMatch(/📊/);
    expect(container.innerHTML).toMatch(/🔧/);
    expect(container.innerHTML).toMatch(/✅/);
  });

  it('renderiza valores numéricos das ordens', () => {
    render(<Indicators totalFaturado={1000} ticketMedio={200} abertas={8} fechadas={15} />);
    
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });
});