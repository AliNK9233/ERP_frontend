import { useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex items-center justify-between p-4 border-b shadow-md">
      <div className="flex items-center gap-3">
      <div className="bg-red-500 w-20 h-4">TEST</div>
        {user?.business_logo && (
          <img
          src={user.business_logo.startsWith('http') ? user.business_logo : `http://localhost:8000${user.business_logo}`}
          alt="Logo"
          className="rounded-full object-cover"
          style={{ width: "40px", height: "40px" }}
        />
        
        )}
        <h2 className="font-semibold text-lg">{user?.business_name}</h2>
      </div>
      <div>
        <span className="text-sm text-gray-500">{user?.role}</span>
      </div>
    </div>
  );
};

export default Header;
