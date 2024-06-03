declare global {
  interface ImportMeta {
    env: {
      [key: string]: string | undefined;
    };
  }
}

export {};
