import { FC, useContext, useEffect, useState } from "react";
import { Context } from "./index";
import LoginForm from "./components/LoginForm";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, [store]);

  const getUsers = async () => {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
        <button onClick={getUsers}>Get users</button>
      </>
    );
  }

  return (
    <>
      <h2>
        {store.isAuth ? `User is authorized ${store.user.email}` : "Authorize"}
      </h2>
      <h2>
        {store.user.isActivated
          ? "Account activated"
          : "Account not activated. Activate your account please."}
      </h2>
      <button onClick={() => store.logout()}>Logout</button>

      <button onClick={getUsers}>Get users</button>

      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </>
  );
};

export default observer(App);
