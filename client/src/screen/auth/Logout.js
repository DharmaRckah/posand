import { Button } from "react-native";
import { logout } from "../../redux/UserSlice";
import { useDispatch } from "react-redux";


export const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Button onClick={handleLogout}>Logout</Button>
  );
};
