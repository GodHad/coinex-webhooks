import React from 'react';

// Admin Imports

// Icon Imports
import {
  MdHistory,
  MdKey,
  MdLock,
  MdPeople,
  MdPerson,
} from 'react-icons/md';

const routes = [
  {
    name: 'My Webhooks',
    layout: '/dashboard',
    path: '',
    icon: <MdKey className="h-6 w-6" />,
  },
  {
    name: 'Profile',
    layout: '/profile',
    path: '',
    icon: <MdPerson className='h-6 w-6' />
  },
  {
    name: 'History',
    layout: '/history',
    path: '',
    icon: <MdHistory className='h-6 w-6' />
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/users',
    icon: <MdPeople className='h-6 w-6' />,
    isAdmin: true
  },
  {
    name: 'Admin-Hooks',
    layout: '/admin',
    path: '/hooks',
    icon: <MdKey className='h-6 w-6' />,
    isAdmin: true,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <MdLock className="h-6 w-6" />,
  },
];
export default routes;
