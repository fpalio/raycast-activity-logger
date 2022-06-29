enum Filter {
    All = "all",
    Open = "open",
    Logged = "logged",
  }
  
  interface Log {
    id: string;
    taskCode: string;
    description: string;
    time: string;
    logged:boolean;
  }
  
  export { Filter };
  export type { Log };