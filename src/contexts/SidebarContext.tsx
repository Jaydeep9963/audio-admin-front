import { FC, useState, createContext } from 'react';
import { ToastContainer } from 'react-toast';
type SidebarContext = {
  sidebarToggle: any;
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SidebarContext = createContext<SidebarContext>(
  {} as SidebarContext
);

export const SidebarProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children
}) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };
  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  return (
    <>
      <SidebarContext.Provider
        value={{ sidebarToggle, toggleSidebar, closeSidebar }}
      >
        {children}
      </SidebarContext.Provider>
    </>
  );
};
