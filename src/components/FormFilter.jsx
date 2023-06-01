import { useContext, useState } from 'react';
import PlanetsContext from '../context/PlanetsContex';

function FormFilter() {
  const { planets, allPlanets, setPlanets } = useContext(PlanetsContext);

  const [filter, setFilter] = useState({
    type: 'population',
    range: 'maior que',
    number: 0,
  });

  const { type, range, number } = filter;

  const filterNames = (planetName) => {
    const filterPlanets = allPlanets.filter(({ name }) => name.includes(planetName));
    setPlanets(filterPlanets);
  };

  const filterSelection = () => {
    const filteredPlanets = planets.filter((planet) => {
      if (range === 'maior que') {
        return Number(planet[type]) > Number(number);
      } if (range === 'menor que') {
        return Number(planet[type]) < Number(number);
      }
      return Number(planet[type]) === Number(number);
    });
    setPlanets(filteredPlanets);
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
        onChange={ ({ target }) => setFilter({ ...filter, type: target.value }) }
      >
        <option value="population">population</option>
        <option value="orbital_period">orbital_period</option>
        <option value="diameter">diameter</option>
        <option value="rotation_period">rotation_period</option>
        <option value="surface_water">surface_water</option>
      </select>

      <select
        data-testid="comparison-filter"
        value={ range }
        onChange={ ({ target }) => setFilter({ ...filter, range: target.value }) }
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>

      <input
        type="number"
        data-testid="value-filter"
        value={ number }
        onChange={ ({ target }) => setFilter({ ...filter, number: target.value }) }
      />

      <button data-testid="button-filter" onClick={ filterSelection }>Filtrar</button>
    </div>
  );
}

export default FormFilter;
