import { useConnect as useCosmosConnect } from 'cosmos-connect-react';
import { useContext } from '../components/ConnectKit';

export function useConnect({ ...props }: any = {}) {
  const context = useContext();
  const { connect: cosmosConnect } = useCosmosConnect();

  const connect = async (
    { connector, chainId }: { connector: any; chainId?: string },
    mutationProps?: any
  ) => {
    try {
      if (props?.mutation?.onMutate) props.mutation.onMutate(connector);
      if (mutationProps?.onMutate) mutationProps.onMutate(connector);

      const targetChainId = chainId ?? 'columbus-5';
      await cosmosConnect(connector.id, targetChainId);

      if (props?.mutation?.onSuccess) props.mutation.onSuccess();
      if (mutationProps?.onSuccess) mutationProps.onSuccess();

      if (props?.mutation?.onSettled) props.mutation.onSettled({}, null);
      if (mutationProps?.onSettled) mutationProps.onSettled({}, null);
    } catch (err: any) {
      if (props?.mutation?.onError) props.mutation.onError(err);
      if (mutationProps?.onError) mutationProps.onError(err);

      if (props?.mutation?.onSettled) props.mutation.onSettled(null, err);
      if (mutationProps?.onSettled) mutationProps.onSettled(null, err);

      context.log(`Could not connect.`, err);
    }
  };

  return {
    connect,
    connectAsync: connect,
    status: 'idle',
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  };
}
