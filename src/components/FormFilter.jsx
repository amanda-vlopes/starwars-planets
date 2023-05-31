import { useContext } from 'react';
import PlanetsContext from '../context/PlanetsContex';

function FormFilter() {
  const { allPlanets, setPlanets } = useContext(PlanetsContext);

  const filterNames = (planetName) => {
    const filterPlanets = allPlanets.filter(({ name }) => name.includes(planetName));
    setPlanets(filterPlanets);
  };

  return (
    <div>
      <input
        type="text"
        onChange={ ({ target }) => filterNames(target.value) }
        data-testid="name-filter"
      />
    </div>
  );
}

export default FormFilter;
