'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useUser } from '@/context/UserContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const { updateUser } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
  
    try {
      const response = await fetch('https://intern-assignment-backend.vercel.app/auth/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred');
      }
      
      if (result && typeof result === 'object') {
        const { success, message, jwtToken, name, email: userEmail, userId, error } = result;

        if (success) {
          const userInfo = {
            id: userId, 
            name, 
            email: userEmail, 
            token: jwtToken,
          };

          // Store userInfo in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
          }

          updateUser(userInfo);

          toast.success("Login successful!");
          setTimeout(() => router.push('/home'), 1000);
        } else if (error) {
          const details = error?.details && Array.isArray(error.details) ? error.details[0]?.message : error.message;
          toast.error(details || message);
          setErrorMessage(details || message);
        } else {
          toast.error(message);
          setErrorMessage(message);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error during sign-in:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600 text-center">{errorMessage}</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <Link href="/signup" passHref>
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
