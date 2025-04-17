import { useState } from 'react';
   import axios from 'axios';

   export default function Login() {
     const [resetEmail, setResetEmail] = useState('');
     const [resetStatus, setResetStatus] = useState('');

     const handleLogin = () => {
       window.location.href = 'http://localhost:5000/auth/google';
     };

     const handleReset = async (e) => {
       e.preventDefault();
       try {
         await axios.post('http://localhost:5000/auth/reset', { email: resetEmail });
         setResetStatus('Reset email sent! Check your inbox.');
         setResetEmail('');
       } catch (error) {
         console.error('Reset error:', error);
         setResetStatus('Failed to send reset email.');
       }
     };

     return (
       <div className='min-h-screen flex items-center justify-center bg-gray-100'>
         <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
           <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>
           <button
             onClick={handleLogin}
             className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4'
           >
             Login with Google
           </button>
           <form onSubmit={handleReset} className='space-y-4'>
             <div>
               <label className='block text-sm font-medium'>Reset Password</label>
               <input
                 type='email'
                 value={resetEmail}
                 onChange={(e) => setResetEmail(e.target.value)}
                 className='w-full p-2 border rounded'
                 placeholder='Enter your email'
                 required
               />
             </div>
             <button
               type='submit'
               className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
             >
               Send Reset Email
             </button>
             {resetStatus && (
               <p className={resetStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'}>
                 {resetStatus}
               </p>
             )}
           </form>
         </div>
       </div>
     );
   }