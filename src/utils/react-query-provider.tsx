   import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
   import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

   export default function ReactQueryProvider(props: Props) {
     return (
       <QueryClientProvider client={queryClient}>
         {props.children}
         <ReactQueryDevtools initialIsOpen={false} />
       </QueryClientProvider>
     );
   }