import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function UserCard({ id, name, email, role, currency, actions }) {
  return (
    <Link
      to={`/users/${id}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl flex flex-col relative"
    >
      <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <div className="text-4xl text-blue-600 font-bold uppercase">
          {name?.charAt(0)}
        </div>
      </div>

      <div className="p-6 flex flex-col space-y-2">
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-gray-500">{email}</p>
        <p className="text-sm font-medium text-gray-700">Role: {role}</p>
        {currency && (
          <p className="text-sm text-gray-600">Currency: {currency}</p>
        )}
        <div className="flex gap-2 mt-4">{actions}</div>
      </div>
    </Link>
  );
}

UserCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  currency: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.node),
};
