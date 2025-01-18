'use client';
import React, { ReactNode } from 'react';
import 'styles/App.css';
import 'styles/Contact.css';
// import '@asseinfo/react-kanban/dist/styles.css';
// import 'styles/Plugins.css';
import 'styles/MiniCalendar.css';
import 'styles/index.css';
import { redirect, usePathname } from 'next/navigation';
import { useState } from 'react';
import routes from 'routes';
import {
  getActiveNavbar,
  getActiveRoute,
  isWindowAvailable,
} from 'utils/navigation';
import Navbar from 'components/navbar';
import Sidebar from 'components/sidebar';
import Footer from 'components/footer/Footer';
import Providers from './providers';

import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';

const _NoSSR = ({ children }) => <React.Fragment>{children}</React.Fragment>;

const NoSSR = dynamic(() => Promise.resolve(_NoSSR), {
  ssr: false,
});

export default function AppWrappers({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (isWindowAvailable()) document.documentElement.dir = 'ltr';

  return (
    <NoSSR>
      <Providers>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme='colored'
        />
        {pathname.includes('auth') ? children :
          <div className="flex h-full w-full bg-background-100 dark:bg-background-900">
            <Sidebar routes={routes} open={open} setOpen={setOpen} variant="admin" />
            {/* Navbar & Main Content */}
            <div className="h-full w-full font-dm dark:bg-navy-900">
              {/* Main Content */}
              <main
                className={`mx-2.5  flex-none transition-all dark:bg-navy-900 
              md:pr-2 xl:ml-[393px]`}
              >
                {/* Routes */}
                <div>
                  <Navbar
                    onOpenSidenav={() => setOpen(!open)}
                    brandText={getActiveRoute(routes, pathname)}
                    secondary={getActiveNavbar(routes, pathname)}
                  />
                  <div className="mx-auto min-h-screen p-2 !pt-[10px] md:p-2">
                    {children}
                  </div>
                  <div className="p-3">
                    <Footer />
                  </div>
                </div>
              </main>
            </div>
          </div>
        }
      </Providers>
    </NoSSR>
  )
}
