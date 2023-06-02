import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import App from '../App';
import planetsData from './helpers/mockData';

const planets = planetsData.results.map((planet) => {
  delete planet.residents;
  return planet;
});

const planetsName = planets.map(({name}) => name);
const columnsHeader = Object.keys(planets[0]).map((title) => title.split('_').join(' '));
const typeOptions = ['population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water'];
const comparisonOptions = [ 'maior que', 'menor que', 'igual a' ];

describe('A aplicação renderiza uma tabela com informações de planetas e possibilita que o usuário filtre o resultado', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(planetsData),
    });
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('É feita uma requisição para a API', async () => {
    await act(() => render(<App />));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/planets');
  });

  it('Verifica se a tabela renderizada possui 13 colunas', async () => {
    await act(() => render(<App />));
    const headers = screen.getAllByRole('columnheader').map((title) => title.textContent);
    expect(headers).toEqual(columnsHeader);
  });

  it('Verifica se a tabela tem uma linha para cada planeta', async () => {
    await act(() => render(<App />));
    const rows = screen.getAllByRole('cell').map((item) => item.textContent);
    expect(rows).toEqual(expect.arrayContaining(planetsName));
  });

  it('Renderiza o campo de texto para o filtro de nomes', async () => {
    await act(() => render(<App />));

    expect(screen.getByTestId('name-filter')).toBeInTheDocument();
  });

  it('Testa se filtra os planetas que possuem a letra o no nome', async () => {
    await act(() => render(<App />));

    const names = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    expect(names).toEqual(planetsName);

    act(() => userEvent.type(screen.getByTestId('name-filter'), 'o'));
  
    const names2 = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const namesFiltered = planetsName.filter((planet) => planet.includes('o'));

    expect(names2).toEqual(namesFiltered);
  });

  it('Testa se filtra os planetas que possuem a letra oo no nome e em sequencia testa a remoção do filtro por texto', async () => {
    await act(() => render(<App />));

    act(() => userEvent.type(screen.getByTestId('name-filter'), 'oo'));
  
    const names = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const namesFiltered = planetsName.filter((planet) => planet.includes('oo'));

    expect(names).toEqual(namesFiltered);

    userEvent.clear(screen.getByTestId('name-filter'));
    const allNames = screen.getAllByTestId('planet-name').map((item) => item.textContent);

    expect(allNames).toEqual(planetsName);
  });

  it('Renderiza o select de coluna e suas opções', async () => {
    await act(() => render(<App />));
  
    expect(screen.getByTestId('column-filter')).toBeInTheDocument();

    const columnSelect = Object.values(screen.getByTestId('column-filter')).map((item) => item.textContent).filter((option) => option !== undefined);

    expect(columnSelect).toEqual(typeOptions);
  });

  it('Renderiza o select de comparação e suas opções', async () => {
    await act(() => render(<App />));

    expect(screen.getByTestId('comparison-filter')).toBeInTheDocument();

    const comparisonSelect = Object.values(screen.getByTestId('comparison-filter')).map((item) => item.textContent).filter((option) => option !== undefined);

    expect(comparisonSelect).toEqual(comparisonOptions);

  });

  it('Verifica se o input para o valor do filtro é renderizado', async () => {
    await act(() => render(<App />));
    expect(screen.getByTestId('value-filter')).toBeInTheDocument();
  });

  it('Renderiza o botão para executar a filtragem e verifica se os valores iniciais de cada campo são (population | maior que | 0)', async () => {
    await act(() => render(<App />));

    expect(screen.getByTestId('button-filter')).toBeInTheDocument();

    const columnInitialValue = Object.values(screen.getByTestId('column-filter')).find((item) => item.type === 'select').pendingProps.value;

    const comparisonInitialValue = Object.values(screen.getByTestId('comparison-filter')).find((item) => item.type === 'select').pendingProps.value;

    expect(columnInitialValue).toBe('population');
    expect(comparisonInitialValue).toBe('maior que');
    expect(screen.getByTestId('value-filter').value).toBe('0');
  });

  it('Utiliza o botão de filtrar sem alterar os valores iniciais dos inputs de filtro e verifica o resultado', async () => {
    await act(() => render(<App />));

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    const namesFiltered = screen.getAllByTestId('planet-name').map((item) => item.textContent);

    const namesFilteredExpected = planets.filter((planet) => planet.population > 0).map((planet) => planet.name);

    expect(namesFiltered).toEqual(namesFilteredExpected);
  });

  it('Utiliza a comparação menor que e verifica se as informações do planeta são atualizadas corretamente', async () => {
    await act(() => render(<App />));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'diameter');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'menor que');
    userEvent.type(screen.getByTestId('value-filter'), '15000');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    const namesFiltered = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const namesFilteredExpected = planets.filter((planet) => planet.diameter < 15000).map((planet) => planet.name);

    const columnOptions = Array.from(screen.getByTestId('column-filter')).map((item) => item.textContent);
    const columnOptionsExpecet = typeOptions.filter((opt) => opt !== 'diameter');

    expect(namesFiltered).toEqual(namesFilteredExpected);
    expect(columnOptions).toEqual(columnOptionsExpecet);
  });

  it('Utiliza a comparação maior que e verifica se as informações do planeta são atualizadas corretamente', async () => {
    await act(() => render(<App />));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'orbital_period');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'maior que');
    userEvent.type(screen.getByTestId('value-filter'), '400');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    const namesFiltered = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const namesFilteredExpected = planets.filter((planet) => planet.orbital_period > 400).map((planet) => planet.name);

    const columnOptions = Array.from(screen.getByTestId('column-filter')).map((item) => item.textContent);
    const columnOptionsExpecet = typeOptions.filter((opt) => opt !== 'orbital_period');

    expect(namesFiltered).toEqual(namesFilteredExpected);
    expect(columnOptions).toEqual(columnOptionsExpecet);
  });

  it('Utiliza a comparação igual a e verifica se as informações do planeta são atualizadas corretamente', async () => {
    await act(() => render(<App />));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'surface_water');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'igual a');
    userEvent.type(screen.getByTestId('value-filter'), '100');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    const namesFiltered = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const namesFilteredExpected = planets.filter((planet) => planet.surface_water === '100').map((planet) => planet.name);

    const columnOptions = Array.from(screen.getByTestId('column-filter')).map((item) => item.textContent);
    const columnOptionsExpecet = typeOptions.filter((opt) => opt !== 'surface_water');

    expect(namesFiltered).toEqual(namesFilteredExpected);
    expect(columnOptions).toEqual(columnOptionsExpecet);
  });

  it('Adiciona dois filtros e verifica se a tabela foi atualizada com as informações filtradas', async () => {
    await act(() => render(<App />));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'orbital_period');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'maior que');
    userEvent.type(screen.getByTestId('value-filter'), '400');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'surface_water');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'igual a');
    userEvent.type(screen.getByTestId('value-filter'), '100');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    const namesFiltered = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const namesFilteredExpected = planets.filter((planet) => planet.orbital_period > 400).filter((planet) => planet.surface_water === '100').map((planet) => planet.name);

    const columnOptions = Array.from(screen.getByTestId('column-filter')).map((item) => item.textContent);
    const columnOptionsExpecet = typeOptions.filter((opt) => opt !== 'orbital_period' && opt !== 'surface_water');

    expect(namesFiltered).toEqual(namesFilteredExpected);
    expect(columnOptions).toEqual(columnOptionsExpecet);
  });

  it('Adiciona um filtro e verifica se a tabela foi atualizada com as informações filtradas, depois remove o filtro e verifica se os valores da tabela voltaram ao original', async () => {
    await act(() => render(<App />));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'orbital_period');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'maior que');
    userEvent.type(screen.getByTestId('value-filter'), '400');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    const namesFiltered = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const namesFilteredExpected = planets.filter((planet) => planet.orbital_period > 400).map((planet) => planet.name);

    const columnOptions = Array.from(screen.getByTestId('column-filter')).map((item) => item.textContent);
    const columnOptionsExpecet = typeOptions.filter((opt) => opt !== 'orbital_period');

    expect(namesFiltered).toEqual(namesFilteredExpected);
    expect(columnOptions).toEqual(columnOptionsExpecet);

    act(() => userEvent.click(screen.getByText(/delete/i)));

    const allPlanetsNames = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const columnAllOptions = Array.from(screen.getByTestId('column-filter')).map((item) => item.textContent);

    expect(allPlanetsNames).toEqual(planetsName);
    expect(columnAllOptions).toEqual(['population','diameter','rotation_period', 'surface_water', 'orbital_period']);
  });

  it('Adiciona dois filtros e verifica se a tabela foi atualizada com as informações filtradas, depois remove um filtro apenas e verifica se os valores da tabela são atualizados corretamente', async () => {
    await act(() => render(<App />));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'orbital_period');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'maior que');
    userEvent.type(screen.getByTestId('value-filter'), '400');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'surface_water');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'igual a');
    userEvent.type(screen.getByTestId('value-filter'), '100');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    const namesFiltered = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const namesFilteredExpected = planets.filter((planet) => planet.orbital_period > 400).filter((planet) => planet.surface_water === '100').map((planet) => planet.name);

    const columnOptions = Array.from(screen.getByTestId('column-filter')).map((item) => item.textContent);
    const columnOptionsExpecet = typeOptions.filter((opt) => opt !== 'orbital_period' && opt !== 'surface_water');

    expect(namesFiltered).toEqual(namesFilteredExpected);
    expect(columnOptions).toEqual(columnOptionsExpecet);

    act(() => userEvent.click(screen.getAllByText(/delete/i)[1]));

    const namesFiltered2 = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const namesFilteredExpected2 = planets.filter((planet) => planet.orbital_period > 400).map((planet) => planet.name);

    const columnOptions2 = Array.from(screen.getByTestId('column-filter')).map((item) => item.textContent);
    const columnOptionsExpected2 = typeOptions.filter((opt) => opt !== 'orbital_period');

    expect(namesFiltered2).toEqual(namesFilteredExpected2);
    expect(columnOptions2).toEqual(columnOptionsExpected2);
  });

  it('Verifica se ao clicar no botão para remover filtros todos os filtros são removidos', async () => {
    await act(() => render(<App />));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'orbital_period');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'maior que');
    userEvent.type(screen.getByTestId('value-filter'), '400');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    userEvent.selectOptions(screen.getByTestId('column-filter'), 'surface_water');
    userEvent.selectOptions(screen.getByTestId('comparison-filter'), 'igual a');
    userEvent.type(screen.getByTestId('value-filter'), '100');

    act(() => userEvent.click(screen.getByTestId('button-filter')));

    act(() => userEvent.click(screen.getByTestId('button-remove-filters')));

    const allPlanetsNames = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    const columnAllOptions = Array.from(screen.getByTestId('column-filter')).map((item) => item.textContent);

    expect(allPlanetsNames).toEqual(planetsName);
    expect(columnAllOptions).toEqual(typeOptions);
  });

  it('Ordena os planetas do menos populoso para o mais populoso e verifica se os planetas estão ordenados corretamente', async () => {
    await act(() => render(<App />));

    userEvent.selectOptions(screen.getByTestId('column-sort'), 'population');
    userEvent.click(screen.getByTestId('column-sort-input-asc'));

    act(() => userEvent.click(screen.getByTestId('column-sort-button')));

    const namesSort = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    
    const namesSortExpected = ['Yavin IV', 'Tatooine', 'Bespin', 'Endor', 'Kamino', 'Alderaan', 'Naboo', 'Coruscant', 'Hoth', 'Dagobah'];

    expect(namesSort).toEqual(namesSortExpected);
  });

  it('Ordena os planetas do menor diâmetro para o maior diâmetro e verifica se os planetas estão ordenados corretamente', async () => {
    await act(() => render(<App />));
    userEvent.selectOptions(screen.getByTestId('column-sort'), 'diameter');
    userEvent.click(screen.getByTestId('column-sort-input-desc'));

    act(() => userEvent.click(screen.getByTestId('column-sort-button')));

    const namesSort = screen.getAllByTestId('planet-name').map((item) => item.textContent);
    
    const namesSortExpected = ['Bespin', 'Kamino', 'Alderaan', 'Coruscant', 'Naboo','Tatooine', 'Yavin IV', 'Dagobah',  'Hoth', 'Endor'];

    expect(namesSort).toEqual(namesSortExpected);
  });
});
