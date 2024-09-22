'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from 'next/link'; 
import { useRouter } from 'next/navigation'; 

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter(); 

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // Log the form data before sending it
    console.log('Form Data:', formData);

    try {
      const url = `https://intern-assignment-backend.vercel.app/auth/signUp`; 
      
      // Log URL to ensure it's correct
      console.log('API URL:', url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
        mode: 'no-cors' // Ensure CORS is enabled, avoid 'no-cors' to allow proper responses
      });

      // Log the response status to ensure the request went through
      console.log('Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'An error occurred';
        
        // Log error response for debugging
        console.error('Error Response:', errorData);
        throw new Error(errorMessage);
      }

      // Log response before converting to JSON
      console.log('Raw Response:', response);

      const result = await response.json();

      // Log the parsed result for inspection
      console.log('Parsed Result:', result);

      const { success, message, error } = result;

      if (success) {
        alert(message);
        console.log('Success:', message);

        setTimeout(() => {
          router.push('/'); 
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message || 'An error occurred';
        
        // Log specific error details if present
        console.error('Error Details:', details);
        setErrorMessage(details);
      } else {
        setErrorMessage(message || 'An unexpected error occurred.');
        
        // Log generic error message
        console.error('Error Message:', message);
      }
    } catch (err) {
      // Log the caught error
      console.error('Caught Error:', err.message);
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      // Log the loading state change
      console.log('Setting loading to false');
      setLoading(false);
    }
};


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>} 
            <Button className="w-full mt-4" type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
