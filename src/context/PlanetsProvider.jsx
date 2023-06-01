import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PlanetsContext from './PlanetsContex';

function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [allPlanets, setAllPlanets] = useState([]);
  const [filterByNumber, setfilterByNumber] = useState([]);

  const fetchPlanets = async () => {
    const response = await fetch('https://swapi.dev/api/planets');
    const data = await response.json();
    const listPlanets = data.results.map((planet) => {
      delete planet.residents;
      return planet;
    });
    setPlanets(listPlanets);
    setAllPlanets(listPlanets);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const value = {
    planets,
    setPlanets,
    allPlanets,
    setAllPlanets,
    filterByNumber,
    setfilterByNumber,
  };

  return (
    <PlanetsContext.Provider value={ value }>
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PlanetsProvider;
