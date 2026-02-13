import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
  return <ChakraProvider resetCSS>{children}</ChakraProvider>;
}
