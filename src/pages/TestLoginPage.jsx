import { useState } from 'react';
import axios from 'axios';

const TestLoginPage = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setResult('Sending request...');
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      setResult(`Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error.message} - ${JSON.stringify(error.response?.data, null, 2)}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Login Test</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TestLoginPage;