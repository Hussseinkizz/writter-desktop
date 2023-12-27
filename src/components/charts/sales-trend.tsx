import { Card, LineChart, Title } from "@tremor/react";
import { useState } from "react";

const chartdata = [
  {
    date: "Jan 23",
    sales: 18,
  },
  {
    date: "Feb 23",
    sales: 21,
  },
  {
    date: "Mar 23",
    sales: 20,
  },
  {
    date: "Apr 23",
    sales: 25,
  },
  {
    date: "May 23",
    sales: 38,
  },
  {
    date: "Jun 23",
    sales: 42,
  },
  {
    date: "Jul 23",
    sales: 54,
  },
  {
    date: "Aug 23",
    sales: 49,
  },
  {
    date: "Sep 23",
    sales: 52,
  },
  {
    date: "Oct 23",
    sales: 60,
  },
  {
    date: "Nov 23",
    sales: 70,
  },
  {
    date: "Dec 23",
    sales: null,
  },
];

export const SalesTrendChart = () => {
  const [value, setValue] = useState<any>(null);

  return (
    <LineChart
      className="mt-4 h-72"
      data={chartdata}
      index="date"
      categories={["sales"]}
      colors={["indigo"]}
      yAxisWidth={30}
      onValueChange={(v) => setValue(v)}
      connectNulls={true}
    />
  );
};
