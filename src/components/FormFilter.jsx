import { useContext, useState } from 'react';
import PlanetsContext from '../context/PlanetsContex';

function FormFilter() {
  const { planets, allPlanets, setPlanets } = useContext(PlanetsContext);

  const [filterOptions, setfilterOptions] = useState({
    type: 'population',
    range: 'maior que',
    number: 0,
  });

  const options = ['population', 'orbital_period',
    'diameter', 'rotation_period', 'surface_water'];

  const [typeOptions, setTypeOptions] = useState(options);
  const [filterByNumber, setfilterByNumber] = useState([]);

  const { type, range, number } = filterOptions;

  const filterNames = (planetName) => {
    const filterPlanets = allPlanets.filter(({ name }) => name.includes(planetName));
    setPlanets(filterPlanets);
  };

  const filterSelection = () => {
    console.log('cliquei');
    const filteredPlanets = planets.filter((planet) => {
      if (range === 'maior que') {
        return Number(planet[type]) > Number(number);
      } if (range === 'menor que') {
        return Number(planet[type]) < Number(number);
      }
      return Number(planet[type]) === Number(number);
    });
    setPlanets(filteredPlanets);
    setfilterByNumber([...filterByNumber, { type, range, number }]);
    const newOptions = typeOptions.filter((typeOption) => typeOption !== type);
    setTypeOptions(newOptions);
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
    </div>
  );
}

export default FormFilter;
