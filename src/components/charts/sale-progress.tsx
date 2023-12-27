import { Flex, ProgressBar, Text } from "@tremor/react";

export default () => (
  <div className="max-w-sm">
    <Flex>
      <Text>UGX 256,543 &bull; 45% </Text>
      <Text className="ml-2 text-gray-600">UGX 586,543</Text>
    </Flex>
    <ProgressBar value={45} color="indigo" className="mt-3" />
  </div>
);
