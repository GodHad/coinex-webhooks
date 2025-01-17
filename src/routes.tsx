import React from 'react';

// Admin Imports

// Icon Imports
import {
  MdKey,
  MdLock,
  MdPerson,
} from 'react-icons/md';

const routes = [
  {
    name: 'My Webhooks',
    layout: '/dashboard',
    path: '/',
    icon: <MdKey className="h-6 w-6" />,
  },
  {
    name: 'Profile',
    layout: '/profile',
    path: '/',
    icon: <MdPerson className='h-6 w-6' />
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: 'sign-in',
    icon: <MdLock className="h-6 w-6" />,
  },
];
export default routes;
