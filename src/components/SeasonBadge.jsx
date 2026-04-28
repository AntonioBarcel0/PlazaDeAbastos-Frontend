import { getSeasonTag } from '../utils/seasonality';
import './SeasonBadge.css';

function SeasonBadge({ nombre, categoria, variant = 'card' }) {
  const tag = getSeasonTag(nombre, categoria);
  if (!tag.isSeasonal) return null;

  if (tag.inSeason) {
    return (
      <span className={`season-badge season-badge--in season-badge--${variant}`}>
        De temporada
      </span>
    );
  }

  return (
    <span className={`season-badge season-badge--out season-badge--${variant}`}>
      Fuera de temporada
    </span>
  );
}

export default SeasonBadge;
