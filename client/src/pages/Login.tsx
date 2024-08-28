import Logo from '@/assets/logo.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
  });
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const u = `${import.meta.env.VITE_USERNAME}`;
    const p = `${import.meta.env.VITE_PASSWORD}`;

    if (!loginDetails.username || !loginDetails.password) {
      alert('Please enter username and password');
      return;
    }

    if (loginDetails.username === u && loginDetails.password === p) {
      alert('Login successful');

      localStorage.setItem('isLoggedIn_QR', 'true');
      localStorage.setItem('role', 'admin');

      window.location.href = '/';

      return;
    } else {
      alert('Invalid username or password');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);

    setLoginDetails((values) => ({ ...values, [name]: value }));
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center">
      <div className="flex h-[33rem] w-[30rem] flex-col items-center rounded-xl border-[1px] p-4 shadow-md">
        <img src={Logo} alt="logo" className="my-4 h-[15rem] w-[15rem]" />
        <h1 className="my-2 font-semibold">ADMIN</h1>

        <h1 className="my-2 font-semibold">ENTER CREDENTIALS TO LOGIN</h1>
        <form
          onSubmit={handleLogin}
          className="flex w-full flex-col items-center justify-center"
        >
          <Input
            placeholder="Username"
            className="w- mb-2"
            name="username"
            onChange={handleChange}
          />
          <Input
            type="password"
            placeholder="Password"
            className="w- mb-2"
            name="password"
            onChange={handleChange}
          />
          <Button className="w-[80%]" type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
