import { _useLocalStore } from "@/hooks/useLocalStorage";
import { _useFetch } from "./fetch";
import { toast } from "react-toastify";
// import { toast, ExternalToast, ToastT } from "sonner";

interface CodeType {
  code: number;
  message: string;
  navigate: boolean;
}

interface FetchProps {
  jobType: string;
  cacheTimeout?: boolean;
  maxRetries?: number;
  retryInterval?: number;
  fetchPayload: any;
  apiRoute: string;
  onSuccess: (res: any) => void;
  onServerError: (message: string) => void;
  serverCodes: CodeType[];
  userToken: string;
}

export function fetchWithRetries(props: FetchProps) {
  let maxRetries = props.maxRetries ?? 10; // 10 retries default
  let retryInterval = props.retryInterval ?? 30000; // 30 seconds default
  let triedTimes = 0;
  let jobId = "";
  let isDone = false;

  // init toast loader
  // const toastId = toast.loading(`Processing ${props.jobType}`, {
  //   duration: Infinity,
  // });
  const toastId = toast.loading("Please wait...");

  // make initial call
  _useFetch(props.apiRoute, props.fetchPayload, props.userToken)
    .then((response) => handleData(response))
    .catch((err) => console.error(err));

  // Todo: handle different server codes like done in fetchWithData
  // Todo: detect if user is online always when attempting fetch with

  // handle response
  const handleData = (res: any) => {
    const { data } = res;
    if (data?.status?.code === 0) {
      jobId = data.data.jobId;
      // console.log("jobId", jobId);
      // get job id and poll job status
      pollJobStatus();
    }
  };

  const pollJobStatus = () => {
    const fetchData = _useFetch(
      "/jobStatus",
      {
        jobId: jobId,
      },
      props.userToken,
    )
      .then((response) => handleJobResponse(response))
      .catch((err) => console.error(err));

    toast.update(toastId, {
      render: `Processing ${props.jobType}!`,
      type: "info",
      isLoading: true,
    });

    // toast.promise(fetchData, {
    //   loading: `processing ${props.jobType}...`,
    //   success: () => {
    //     return `${props.jobType} Successful!`;
    //   },
    //   error: `${props.jobType} failed!`,
    // });
  };

  // handle response
  const handleJobResponse = (res: any) => {
    const { data, error } = res;

    if (data) {
      let target = data.data[props.jobType.toLowerCase()];

      if (data?.status?.code === 0) {
        // everthing fine in response
        if (target.status === "success") {
          // job done -- do something with the job response!
          toast.update(toastId, {
            render: `${props.jobType} Successful!`,
            type: "success",
            isLoading: false,
          });
          // toast.success("Success", { toastId });
          props.onSuccess(target);
          // console.log("target:", target);
        } else if (target.status === "failed") {
          // job failed -- something happened perhaps!
          toast.update(toastId, {
            render: `${props.jobType} Failed, Retry!`,
            type: "error",
            isLoading: false,
            autoClose: 10000,
          });
          props.onServerError(target.log);
        } else {
          // job still running retry it
          setTimeout(() => {
            retryFetching();
          }, retryInterval);
        }
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
      console.error(`Error polling job status: ${error}`);
    }
  };

  const retryFetching = () => {
    if (triedTimes < maxRetries) {
      pollJobStatus();
      // increment tried times
      triedTimes++;
    }
  };
}
