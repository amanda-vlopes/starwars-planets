import { useContext, useState } from 'react';
import PlanetsContext from '../context/PlanetsContex';

function FormFilter() {
  const { allPlanets, setPlanets,
    setfilterByNumber, filterByNumber } = useContext(PlanetsContext);

  const [filterOptions, setfilterOptions] = useState({
    type: 'population',
    range: 'maior que',
    number: 0,
  });

  const options = ['population', 'orbital_period',
    'diameter', 'rotation_period', 'surface_water'];

  const [typeOptions, setTypeOptions] = useState(options);

  const { type, range, number } = filterOptions;

  const filterNames = (planetName) => {
    const filterPlanets = allPlanets
      .filter(({ name }) => name.toLowerCase().includes(planetName.toLowerCase()));
    setPlanets(filterPlanets);
  };

  const filterSelection = () => {
    setfilterByNumber([...filterByNumber, filterOptions]);
    const newOptions = typeOptions.filter((typeOption) => typeOption !== type);
    setTypeOptions(newOptions);
    setfilterOptions({ ...filterOptions, type: newOptions[0] });
  };

  const removeFilter = (index) => {
    const newFilterList = filterByNumber.toSpliced(index, 1);
    setfilterByNumber(newFilterList);
  };

  const removeAllFilters = () => {
    setfilterByNumber([]);
    setTypeOptions(options);
  };

  return (
    <div>
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
              onClick={ () => removeFilter(index) }
            >
              delete
            </button>
          </div>
        ))}
      </div>

      <button
        data-testid="button-remove-filters"
        onClick={ removeAllFilters }
      >
        Remover Filtros
      </button>
    </div>
  );
}

export default FormFilter;
