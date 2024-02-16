import React, { useReducer, ReactNode } from "react";

interface Actions {
  [key: string]: (dispatch: React.Dispatch<any>) => (...args: any[]) => void;
}

interface ProviderProps {
  children: ReactNode;
}

interface CustomFunctions {
  [key: string]: (...args: any[]) => void;
}

export default function createContext(reducer: React.Reducer<any, any>, actions: Actions, initialValue: any) {
  const Context = React.createContext<any>(null);

  const Provider: React.FC<ProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialValue);

    const customFunctions: CustomFunctions = {};
    Object.keys(actions).forEach(key => customFunctions[key] = actions[key](dispatch));

    return (
      <Context.Provider value={{ state, ...customFunctions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
}
