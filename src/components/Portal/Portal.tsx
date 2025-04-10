import * as React from 'react';
import { clsx } from 'clsx';
import ReactDOM from 'react-dom';

interface PortalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  container?: HTMLElement | null;
}

const Portal = React.forwardRef<HTMLDivElement, PortalProps>(
  ({ children, container, className, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false);
    const [portalRoot, setPortalRoot] = React.useState<HTMLDivElement | null>(
      null,
    );
    const containerRef = React.useRef<HTMLElement | null>(null);

    // Handle SSR and container changes
    React.useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    // Create portal root element
    React.useEffect(() => {
      if (!mounted) return;

      const root = document.createElement('div');
      setPortalRoot(root);
      return () => {
        root.remove();
        setPortalRoot(null);
      };
    }, [mounted]);

    // Handle container changes
    React.useEffect(() => {
      containerRef.current = container ?? document.body;
    }, [container]);

    // Append portal root to container
    React.useEffect(() => {
      if (!portalRoot || !containerRef.current) return;

      containerRef.current.appendChild(portalRoot);
      return () => {
        if (portalRoot.parentElement) {
          portalRoot.parentElement.removeChild(portalRoot);
        }
      };
    }, [portalRoot]);

    if (!mounted || !portalRoot) return null;

    return ReactDOM.createPortal(
      <div ref={ref} className={clsx('fixed z-[9999]', className)} {...props}>
        {children}
      </div>,
      portalRoot,
    );
  },
);

Portal.displayName = 'Portal';

export { Portal };
