import { useContext, useState } from 'react';
import PlanetsContext from '../context/PlanetsContex';

function FormFilter() {
  const { allPlanets, setPlanets, setfilterByNumber, filterByNumber,
    setOrder } = useContext(PlanetsContext);

  const [filterOptions, setfilterOptions] = useState({
    type: 'population',
    range: 'maior que',
    number: 0,
  });
  const { type, range, number } = filterOptions;

  const options = ['population', 'orbital_period',
    'diameter', 'rotation_period', 'surface_water'];
  const [typeOptions, setTypeOptions] = useState(options);

  const [sortOption, setSortOption] = useState('ASC');
  const [columnOption, setColumnOption] = useState('population');

  const filterNames = (planetName) => {
    const filterPlanets = allPlanets
      .filter(({ name }) => name.toLowerCase().includes(planetName.toLowerCase()));
    setPlanets(filterPlanets);
  };

  const filterSelection = () => {
    setfilterByNumber([...filterByNumber, filterOptions]);
    const newOptions = typeOptions.filter((typeOption) => typeOption !== type);
    setTypeOptions(newOptions);
    setfilterOptions({ ...filterOptions, type: newOptions[0], number: 0 });
  };

  const removeFilter = (typeOpt) => {
    const newFilterList = filterByNumber.filter((opt) => opt.type !== typeOpt);
    setfilterByNumber(newFilterList);
    setTypeOptions(options);
    setfilterOptions({ type: 'population', range: 'maior que', number: 0 });
  };

  const removeAllFilters = () => {
    setfilterByNumber([]);
    setTypeOptions(options);
    setfilterOptions({ type: 'population', range: 'maior que', number: 0 });
  };

  const sortFilters = () => {
    setOrder({ column: columnOption, sort: sortOption });
  };

  return (
    <section>
      <input
        type="text"
        onChange={ ({ target }) => filterNames(target.value) }
        data-testid="name-filter"
      />

      <select
        data-testid="column-filter"
        value={ type }
        onChange={ ({ target }) => setfilterOptions(
          { ...filterOptions, type: target.value },
        ) }
      >
        {typeOptions.map((typeOption, index) => (
          <option value={ typeOption } key={ index }>{ typeOption }</option>
        ))}
      </select>

      <select
        data-testid="comparison-filter"
        value={ range }
        onChange={ ({ target }) => setfilterOptions(
          { ...filterOptions, range: target.value },
        ) }
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>

      <input
        type="number"
        data-testid="value-filter"
        value={ number }
        onChange={ ({ target }) => setfilterOptions(
          { ...filterOptions, number: target.value },
        ) }
      />

      <button data-testid="button-filter" onClick={ filterSelection }>Filtrar</button>

      <div>
        {filterByNumber.map((op, index) => (
          <div key={ index } data-testid="filter">
            <p>{ `${op.type} ${op.range} ${op.number}` }</p>
            <button
              onClick={ () => removeFilter(op.type) }
            >
              delete
            </button>
          </div>
        ))}
      </div>

      <select
        data-testid="column-sort"
        onChange={ ({ target }) => setColumnOption(target.value) }
      >
        {options.map((opt, index) => (
          <option key={ index } value={ opt }>{opt}</option>
        ))}
      </select>

      <label htmlFor="asc">
        <input
          id="asc"
          type="radio"
          name="sort"
          value="ASC"
          data-testid="column-sort-input-asc"
          onChange={ ({ target }) => setSortOption(target.value) }
        />
        Ascendente
      </label>

      <label htmlFor="desc">
        <input
          id="desc"
          type="radio"
          name="sort"
          value="DESC"
          data-testid="column-sort-input-desc"
          onChange={ ({ target }) => setSortOption(target.value) }
        />
        Descendente
      </label>

      <button data-testid="column-sort-button" onClick={ sortFilters }>Ordernar</button>

      <button
        data-testid="button-remove-filters"
        onClick={ removeAllFilters }
      >
        Remover Filtros
      </button>
    </section>
  );
}

export default FormFilter;
