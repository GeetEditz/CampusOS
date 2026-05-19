import { useState, useEffect } from 'react';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
}

type ToastActionType = 
  | { type: 'ADD_TOAST'; toast: ToastProps }
  | { type: 'REMOVE_TOAST'; id: string };

let listeners: Array<(toasts: ToastProps[]) => void> = [];
let memoryToasts: ToastProps[] = [];

function dispatch(action: ToastActionType) {
  if (action.type === 'ADD_TOAST') {
    const id = action.toast.id || Math.random().toString(36).substring(2, 9);
    const newToast = { ...action.toast, id };
    memoryToasts = [newToast, ...memoryToasts].slice(0, 5); // Limit to 5 visible toasts
  } else if (action.type === 'REMOVE_TOAST') {
    memoryToasts = memoryToasts.filter((t) => t.id !== action.id);
  }

  listeners.forEach((listener) => {
    listener(memoryToasts);
  });
}

export function toast({ ...props }: Omit<ToastProps, 'id'>) {
  const id = Math.random().toString(36).substring(2, 9);
  
  const update = (props: ToastProps) =>
    dispatch({ type: 'ADD_TOAST', toast: { ...props, id } });
  const dismiss = () => dispatch({ type: 'REMOVE_TOAST', id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      action: props.action,
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>(memoryToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id?: string) => {
      if (id) {
        dispatch({ type: 'REMOVE_TOAST', id });
      } else {
        memoryToasts.forEach((t) => dispatch({ type: 'REMOVE_TOAST', id: t.id! }));
      }
    },
  };
}
