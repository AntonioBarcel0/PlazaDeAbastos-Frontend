import { MapPin } from 'lucide-react';
import { getOriginTag } from '../utils/traceability';
import './OriginBadge.css';

function OriginBadge({ nombre, descripcion, variant = 'card' }) {
  const tag = getOriginTag(nombre, descripcion);
  if (!tag) return null;

  return (
    <span className={`origin-badge origin-badge--${tag.type} origin-badge--${variant}`}>
      <MapPin size={9} strokeWidth={2.5} />
      {tag.label}
    </span>
  );
}

export default OriginBadge;
