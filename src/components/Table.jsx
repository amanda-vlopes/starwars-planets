import { useContext } from 'react';
import PlanetsContext from '../context/PlanetsContex';

function Table() {
  const { planets, filterByNumber, order } = useContext(PlanetsContext);

  const filteredPlanets = (planet) => filterByNumber.every((opt) => {
    if (opt.range === 'maior que') return Number(planet[opt.type]) > Number(opt.number);
    if (opt.range === 'menor que') return Number(planet[opt.type]) < Number(opt.number);
    return Number(planet[opt.type]) === Number(opt.number);
  });

  const sortPlanets = (planet1, planet2) => {
    const menosUm = -1;
    if (planet1[order.column] === 'unknown') return 1;
    if (planet2[order.column] === 'unknown') return menosUm;
    if (order.sort === 'ASC') return planet1[order.column] - planet2[order.column];
    if (order.sort === 'DESC') return planet2[order.column] - planet1[order.column];
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {planets.length > 0 && Object.keys(planets[0]).map((header, index) => (
              <th
                key={ index }
                style={ { textTransform: 'capitalize' } }
              >
                {header.split('_').join(' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planets.length > 0 && planets
            .filter(filteredPlanets)
            .sort(sortPlanets)
            .map((planet, index) => (
              <tr key={ index }>
                <td data-testid="planet-name">{ planet.name }</td>
                <td>{ planet.rotation_period }</td>
                <td>{ planet.orbital_period }</td>
                <td>{ planet.diameter }</td>
                <td>{ planet.climate }</td>
                <td>{ planet.gravity }</td>
                <td>{ planet.terrain }</td>
                <td>{ planet.surface_water }</td>
                <td>{ planet.population }</td>
                <td>{ planet.films }</td>
                <td>{ planet.created }</td>
                <td>{ planet.edited }</td>
                <td>{ planet.url }</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
