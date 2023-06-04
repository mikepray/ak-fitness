import { DependencyList, useState, useEffect } from "react";

export function useGetEffect<T>(route: string, dependencies?: DependencyList): T {
    const [obj, setObj] = useState<T>();
  
    useEffect(() => {
      fetch(route, {
        method: "GET",
      }).then((value: Response) => {
        console.log(value);
        return value.json();
      })
      .then((data) => {
        setObj(data as T);
      })
    }, dependencies);
  
    return obj;
  }