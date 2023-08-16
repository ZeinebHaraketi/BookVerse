import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid, faStar as faStarRegular } from '@fortawesome/free-solid-svg-icons';

// ...

const StarRating = ({ rating, maxRating }) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <FontAwesomeIcon
        key={i}
        icon={i <= rating ? faStarSolid : faStarRegular}
        className="star-icon"
      />
    );
  }
  return <div className="star-rating">{stars}</div>;
};

export default StarRating;