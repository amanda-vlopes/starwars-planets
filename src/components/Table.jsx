import { useContext } from 'react';
import PlanetsContext from '../context/PlanetsContex';

function Table() {
  const { planets } = useContext(PlanetsContext);

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
          {planets.length > 0 && planets.map((planet, index) => (
            <tr key={ index }>
              <td>{ planet.name }</td>
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
