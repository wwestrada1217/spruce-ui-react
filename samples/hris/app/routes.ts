/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("components/HRISLayout.tsx", [
    index("routes/home.tsx"),
    route("employees", "routes/employees.tsx"),
    route("time-off", "routes/time-off.tsx"),
    route("payroll", "routes/payroll.tsx"),
    route("performance", "routes/performance.tsx"),
    route("attendance", "routes/attendance.tsx"),
    route("settings", "routes/settings.tsx"),
  ]),
] satisfies RouteConfig;
