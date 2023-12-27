import { _useLocalStore } from "@/hooks/useLocalStorage";
import { _useFetch } from "@/utils/fetch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface codeType {
  code: number | string;
  message: string;
  navigate: boolean;
}

interface LogicProps {
  makeRequest: boolean;
  fetchPayload: any;
  apiRoute: string;
  onServerError: (message: string) => void;
  serverCodes: codeType[];
}

export function useFetchLogic(props: LogicProps) {
  const [isDone, setIsDone] = useState(false);
  const [caughtCode, setCaughtCode] = useState<number | string>();
  const { setLocalStore } = _useLocalStore();

  const {
    isLoading,
    error,
    data: response,
  } = useQuery(
    ["ekyc_api", props.apiRoute],
    async () => await _useFetch(props.apiRoute, props.fetchPayload),
    {
      enabled: props.makeRequest,
      staleTime: 60 * 1000, // data will be fresh for 1 minute
      cacheTime: 60 * 1000 * 10, // data will be cached for 10 minutes
    },
  );
  console.log("useFetchLogic", props.makeRequest);

  // handle response
  if (response) {
    const data = response.data;

    // make a simpe local store key
    // eg for /register we make $register
    const makeKey = (param: string) => {
      const paramStringArray = param.split("");
      paramStringArray[0] = "$";
      const paramKey = paramStringArray.join("");
      return paramKey;
    };

    // handle errors and data
    props.serverCodes.forEach((serverCode) => {
      if (serverCode === data.status.code) {
        // handle known errors gracefully
        setCaughtCode(serverCode.code);
        const localState = setLocalStore(
          makeKey(props.apiRoute),
          {
            ...data,
            serverError: serverCode.message,
          },
          {},
        );
        // on save, call callback say route navigator
        !!localState && setIsDone(true);
        // set errors on page
        props.onServerError(`Error:${data.status.code},${data.status.message}`);
      } else {
        // handle unknown errors directly
        setCaughtCode(serverCode.code);
        const localState = setLocalStore(
          makeKey(props.apiRoute),
          {
            ...data,
            serverError: `Error:${data.status.code},${data.status.message}`,
          },
          {},
        );
        // on save, call callback say route navigator
        !!localState && setIsDone(true);
        // set errors on page
        props.onServerError(`Error:${data.status.code},${data.status.message}`);
      }
    });
  }

  // fetch errors
  if (error) {
    console.error(error);
  }

  // return status
  return { isDone, caughtCode };
}
