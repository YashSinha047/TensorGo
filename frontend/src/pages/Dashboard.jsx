import { useEffect, useState } from 'react';
   import axios from 'axios';
   import { useNavigate } from 'react-router-dom';

   export default function Dashboard() {
     const [user, setUser] = useState(null);
     const [emailStatus, setEmailStatus] = useState('');
     const [analytics, setAnalytics] = useState([]);
     const [history, setHistory] = useState([]);
     const [newsletter, setNewsletter] = useState({ subject: '', html: '', text: '' });
     const [newsletterStatus, setNewsletterStatus] = useState('');
     const [compose, setCompose] = useState({ to: '', subject: '', html: '', text: '' });
     const [composeStatus, setComposeStatus] = useState('');
     const navigate = useNavigate();

     useEffect(() => {
       axios.get('http://localhost:5000/auth/user', { withCredentials: true })
         .then(response => {
           setUser(response.data);
           setEmailStatus('Welcome email sent to your inbox!');
           console.log('Fetching analytics for:', response.data.email);
           axios.get('http://localhost:5000/api/analytics', { withCredentials: true })
             .then(res => {
               console.log('Analytics response:', res.data);
               setAnalytics(res.data);
             })
             .catch(err => console.error('Analytics fetch error:', err.message));
           axios.get('http://localhost:5000/emails/history', { withCredentials: true })
             .then(res => {
               console.log('History response:', res.data);
               setHistory(res.data);
             })
             .catch(err => console.error('History fetch error:', err.message));
         })
         .catch(err => {
           console.error('User fetch error:', err.message);
           navigate('/');
         });
     }, [navigate]);

     const handleLogout = () => {
       axios.get('http://localhost:5000/auth/logout', { withCredentials: true })
         .then(() => navigate('/'))
         .catch(err => console.error('Logout failed:', err));
     };

     const handleNewsletterSubmit = async (e) => {
       e.preventDefault();
       try {
         await axios.post('http://localhost:5000/emails/newsletter', newsletter, { withCredentials: true });
         setNewsletterStatus('Newsletter sent successfully!');
         setNewsletter({ subject: '', html: '', text: '' });
       } catch (error) {
         console.error('Newsletter error:', error);
         setNewsletterStatus('Failed to send newsletter.');
       }
     };

     const handleComposeSubmit = async (e) => {
       e.preventDefault();
       try {
         await axios.post('http://localhost:5000/emails/send', compose, { withCredentials: true });
         setComposeStatus('Email sent successfully!');
         setCompose({ to: '', subject: '', html: '', text: '' });
         const res = await axios.get('http://localhost:5000/emails/history', { withCredentials: true });
         setHistory(res.data);
       } catch (error) {
         console.error('Compose error:', error);
         setComposeStatus('Failed to send email.');
       }
     };

     return (
       <div className='min-h-screen p-4 bg-gray-100'>
         {user ? (
           <div className='max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg'>
             <h1 className='text-3xl font-bold mb-4'>Welcome, {user.name}!</h1>
             <p className='text-lg mb-2'>Email: {user.email}</p>
             {emailStatus && user.welcomeEmailSent && <p className='text-green-600 mb-4'>Welcome email was sent to your inbox!</p>}
             <div className='mb-4'>
               <h2 className='text-xl font-semibold mb-2'>Communication History</h2>
               {history.length > 0 ? (
                 <ul className='list-disc pl-5'>
                   {history.map((email, index) => (
                     <li key={index}>
                       {email.type} email to {email.to} - "{email.subject}" sent at {new Date(email.sentAt).toLocaleString()}
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p>No emails sent or received yet.</p>
               )}
             </div>
             <div className='mb-4'>
               <h2 className='text-xl font-semibold mb-2'>Email Analytics</h2>
               {analytics.length > 0 ? (
                 <ul className='list-disc pl-5'>
                   {analytics.map((event, index) => (
                     <li key={index}>
                       Email {event.type} at {new Date(event.timestamp).toLocaleString()}
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p>No analytics data yet.</p>
               )}
             </div>
             <div className='mb-4'>
               <h2 className='text-xl font-semibold mb-2'>Compose Email</h2>
               <form onSubmit={handleComposeSubmit} className='space-y-4'>
                 <div>
                   <label className='block text-sm font-medium'>To</label>
                   <input
                     type='email'
                     value={compose.to}
                     onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                     className='w-full p-2 border rounded'
                     required
                   />
                 </div>
                 <div>
                   <label className='block text-sm font-medium'>Subject</label>
                   <input
                     type='text'
                     value={compose.subject}
                     onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                     className='w-full p-2 border rounded'
                     required
                   />
                 </div>
                 <div>
                   <label className='block text-sm font-medium'>HTML Content</label>
                   <textarea
                     value={compose.html}
                     onChange={(e) => setCompose({ ...compose, html: e.target.value })}
                     className='w-full p-2 border rounded'
                     rows='4'
                     required
                   />
                 </div>
                 <div>
                   <label className='block text-sm font-medium'>Text Content</label>
                   <textarea
                     value={compose.text}
                     onChange={(e) => setCompose({ ...compose, text: e.target.value })}
                     className='w-full p-2 border rounded'
                     rows='4'
                     required
                   />
                 </div>
                 <button
                   type='submit'
                   className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                 >
                   Send Email
                 </button>
                 {composeStatus && (
                   <p className={composeStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'}>
                     {composeStatus}
                   </p>
                 )}
               </form>
             </div>
             {user.role === 'admin' && (
               <div className='mb-4'>
                 <h2 className='text-xl font-semibold mb-2'>Send Newsletter</h2>
                 <form onSubmit={handleNewsletterSubmit} className='space-y-4'>
                   <div>
                     <label className='block text-sm font-medium'>Subject</label>
                     <input
                       type='text'
                       value={newsletter.subject}
                       onChange={(e) => setNewsletter({ ...newsletter, subject: e.target.value })}
                       className='w-full p-2 border rounded'
                       required
                     />
                   </div>
                   <div>
                     <label className='block text-sm font-medium'>HTML Content</label>
                     <textarea
                       value={newsletter.html}
                       onChange={(e) => setNewsletter({ ...newsletter, html: e.target.value })}
                       className='w-full p-2 border rounded'
                       rows='4'
                       required
                     />
                   </div>
                   <div>
                     <label className='block text-sm font-medium'>Text Content</label>
                     <textarea
                       value={newsletter.text}
                       onChange={(e) => setNewsletter({ ...newsletter, text: e.target.value })}
                       className='w-full p-2 border rounded'
                       rows='4'
                       required
                     />
                   </div>
                   <button
                     type='submit'
                     className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                   >
                     Send Newsletter
                   </button>
                   {newsletterStatus && (
                     <p className={newsletterStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'}>
                       {newsletterStatus}
                     </p>
                   )}
                 </form>
               </div>
             )}
             <button
               onClick={handleLogout}
               className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
             >
               Logout
             </button>
           </div>
         ) : (
           <p className='text-center text-lg'>Loading...</p>
         )}
       </div>
     );
   }