// import { _useLocalStore } from "@/hooks/useLocalStorage";
import { _useFetch } from "./fetch";
// import { toast } from "react-toastify";
// import { toast, ExternalToast, ToastT } from "sonner";

interface CodeType {
  code: number;
  message: string;
  navigate: boolean;
}

interface FetchProps {
  jobType?: string;
  cacheTimeout?: boolean;
  maxPolls?: number;
  pausePolls: boolean;
  retryInterval?: number;
  pollingInterval?: number;
  fetchPayload: any;
  apiRoute: string;
  onSuccess: (res: any) => void;
  onServerError: (message: string) => void;
  serverCodes?: CodeType[];
  userToken: string;
}

export function fetchWithPolling(props: FetchProps) {
  let maxPolls = props.maxPolls ?? Infinity; // 10 retries default
  let pollingInterval = props.pollingInterval ?? 30000; // 30 seconds default
  let triedTimes = 0;
  // let jobId = "";
  // let isDone = false;

  // make initial call
  const tryPolling = () => {
    _useFetch(props.apiRoute, props.fetchPayload, props.userToken)
      .then((response) => handleData(response))
      .catch((err) => console.error(err));
  };

  // Todo: handle different server codes like done in fetchWithData
  // Todo: detect if user is online always when attempting fetch with

  // handle response
  const handleData = (res: any) => {
    const { data, error } = res;

    if (data?.status?.code === 0) {
      props.onSuccess(data.data);

      // poll again after some time
      if (!props.pausePolls) {
        setTimeout(() => {
          if (triedTimes < maxPolls) {
            tryPolling();
            // increment tried times
            triedTimes++;
          }
        }, pollingInterval);
      }
    } else {
      // there's some error in response
      console.error(
        `Response has error: ${data?.status?.code}: ${data?.status?.message}`,
      );
      props.onServerError(
        `Error: ${data?.status?.code}: ${data?.status?.message}`,
      );
    }

    // handle errors
    if (error) {
      console.error(`Retrying, Error polling resource: ${error}`);
      // retry right away
      tryPolling();
    }
  };

  // start the polling for the first time
  tryPolling();
}
