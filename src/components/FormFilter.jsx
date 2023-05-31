import { useContext, useEffect, useState } from 'react';
import PlanetsContext from '../context/PlanetsContex';

function FormFilter() {
  const { planets, setPlanets } = useContext(PlanetsContext);

  const [allPlanets, setAllPlanets] = useState([]);
  const [planetName, setplanetName] = useState('');

  useEffect(() => {
    if (allPlanets.length === 0) {
      setAllPlanets(planets);
    }
  }, [planets]);

  useEffect(() => {
    const filterNames = allPlanets.filter(({ name }) => name.includes(planetName));
    console.log(planets, allPlanets);
    setPlanets(filterNames);
  }, [planetName]);

  return (
    <div>
      <input
        type="text"
        value={ planetName }
        onChange={ ({ target }) => setplanetName(target.value) }
        data-testid="name-filter"
      />
    </div>
  );
}

export default FormFilter;
