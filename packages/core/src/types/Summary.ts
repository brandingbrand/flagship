export type Items = {
  name: string;
  hook: string;
  time: string;
  success: boolean;
  error: string | boolean;
  warning: string | boolean;
};

export type Hook = `platform::${"ios" | "android"}` | "pre" | "post";
