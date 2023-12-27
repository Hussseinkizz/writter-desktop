import { _useLocalStore } from "@/hooks/useLocalStorage";
import { _useFetch } from "./fetch";

interface CodeType {
  code: number;
  message: string;
  navigate: boolean;
}

interface LogicProps {
  cacheTimeout?: boolean;
  fetchPayload: any;
  apiRoute: string;
  onNavigate: () => void;
  onDone: () => void;
  onServerError: (message: string) => void;
  serverCodes: CodeType[];
}

export function fetchWithFormData(props: LogicProps) {
  const { setLocalStore } = _useLocalStore();

  const fetchData = async () => {
    const response = await _useFetch(props.apiRoute, props.fetchPayload);
    return response;
  };

  fetchData()
    .then((response) => handleData(response))
    .catch((err) => console.error(err));

  // handle response
  const handleData = (res: any) => {
    const { loading, error, data } = res;

    if (data) {
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
        if (data?.status?.code === serverCode.code) {
          // handle known errors gracefully
          const localState = setLocalStore(
            makeKey(props.apiRoute),
            {
              ...data,
              serverError: serverCode.message,
            },
            {
              cacheTimeout: props.cacheTimeout ?? undefined,
            },
          );
          // on save, call callbacks to toggle loading state and route navigator
          if (localState) {
            // console.log("login data in", makeKey(props.apiRoute), localState);
            props.onDone();
            serverCode.navigate && props.onNavigate();
          }
          // set errors on page, if ok this will be '' and therefore no error message will be shown
          props.onServerError(serverCode.message);
        } else {
          // console.log("login data out", makeKey(props.apiRoute));

          // set errors on parent page
          props.onDone();
          props.onServerError(
            `Error:${data?.status?.code},${data?.status?.message}`,
          );
        }
      });
    }

    // fetch errors
    if (error) {
      console.error(error);
    }
  };
}
