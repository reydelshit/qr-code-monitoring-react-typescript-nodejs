import Logo from '@/assets/logo.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
  });

  const [agreed, setAgreed] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  const [alerd, setAlert] = useState('');
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const u = `${import.meta.env.VITE_USERNAME}`;
    const p = `${import.meta.env.VITE_PASSWORD}`;

    if (!loginDetails.username || !loginDetails.password) {
      setAlert('Please fill in all fields');
      return;
    }

    if (loginDetails.username === u && loginDetails.password === p) {
      toast({
        title: 'Login successful',
        description: 'You have been logged in successfully',
      });

      localStorage.setItem('isLoggedIn_QR', 'true');
      localStorage.setItem('role', 'admin');

      window.location.href = '/';

      return;
    } else if (loginDetails.username !== u || loginDetails.password !== p) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_LINK}/login`,
          {
            username: loginDetails.username,
            password: loginDetails.password,
          },
        );

        if (res.data.status === 'success') {
          console.log(res.data);

          localStorage.setItem('isLoggedIn_QR', 'true');
          localStorage.setItem('role', 'user');

          localStorage.setItem('user', JSON.stringify(res.data[0]));
          localStorage.setItem(
            'permissions',
            JSON.stringify(res.data[0].permissions),
          );

          window.location.href = '/';
        }
      } catch (err) {
        console.log(err);
        setAlert('Invalid credentials');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);

    setLoginDetails((values) => ({ ...values, [name]: value }));
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center">
      <div className="flex h-fit w-[30rem] flex-col items-center rounded-xl border-[1px] p-4 shadow-md">
        <img src={Logo} alt="logo" className="my-4 h-[12rem] w-[12rem]" />
        {/* <h1 className="my-2 font-semibold">ADMIN</h1> */}

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
          {alerd.length > 0 && <p className="my-4 text-red-500">{alerd}</p>}
          <div className="text-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="policy-agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <Label
                htmlFor="policy-agree"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                By logging in, you agree to the{' '}
                <span
                  onClick={() => setOpen(true)}
                  className="cursor-pointer text-primary underline"
                >
                  User Policy
                </span>
              </Label>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl font-bold">
                    User Policy
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Cloud-Based QR Code Monitoring System for School Attendance
                  </DialogDescription>
                </DialogHeader>
                <div className="my-4 rounded-lg border border-primary/20 bg-primary/10 p-6">
                  <ScrollArea className="h-[300px] w-full pr-4">
                    <div className="space-y-4">
                      <section>
                        <h3 className="font-semibold">
                          1. General Usage Policies
                        </h3>
                        <p>
                          1.1. Authorized Access Only: Access is strictly
                          limited to authorized users.
                        </p>
                        <p>
                          1.2. Personal Responsibility: Users are responsible
                          for all activities under their accounts.
                        </p>
                        <p>
                          1.3. System Purpose: The system must only be used for
                          school attendance tracking.
                        </p>
                      </section>
                      <section>
                        <h3 className="font-semibold">
                          2. Security and Data Protection Policies
                        </h3>
                        <p>
                          2.1. Confidentiality of Information: Attendance data
                          and system information are confidential.
                        </p>
                        <p>
                          2.2. Compliance with Security Features: Users must
                          adhere to JIT Access, RBAC, and QR Code Protection.
                        </p>
                        <p>
                          2.3. Password Protection: Passwords must be strong,
                          confidential, and regularly updated.
                        </p>
                      </section>
                      <section>
                        <h3 className="font-semibold">
                          3. System Integrity and Monitoring
                        </h3>
                        <p>
                          3.1. Compliance with Monitoring: All system activities
                          are monitored.
                        </p>
                        <p>
                          3.2. Updates and Maintenance: Users must cooperate
                          with system updates and maintenance.
                        </p>
                      </section>
                      <section>
                        <h3 className="font-semibold">
                          4. Violations and Penalties
                        </h3>
                        <p>
                          4.1. Policy Violations: Violations may result in
                          disciplinary actions.
                        </p>
                        <p>
                          4.2. Reporting Violations: Users must report any
                          violations immediately.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </div>
                <DialogFooter className="flex flex-col items-center">
                  <Button onClick={() => setOpen(false)} className="w-full">
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Button
            disabled={!agreed}
            className="mt-[2rem] w-[70%]"
            type="submit"
          >
            Login
          </Button>
          {/* <span className="my-4 block">OR</span>
          <Button>
            <Link to={'/scan'}>Go to Scan Station</Link>
          </Button>{' '} */}
        </form>
      </div>
    </div>
  );
}
