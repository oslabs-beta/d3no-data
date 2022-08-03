/** @jsx h */
import { h, Fragment, useEffect, d3 } from "../mod.ts";

// connects a series of data points using a line
// represents sequential values to help identify trends
// x-axis represents a sequential progression of values

export function LineChart() {
  return (
    <Fragment>
      <svg className="line-chart"></svg>
    </Fragment>
  );
}
