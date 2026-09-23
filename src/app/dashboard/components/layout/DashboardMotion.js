"use client";

import { LayoutGroup } from "motion/react";

const DashboardMotion = ({ children }) => {
    return (
        <LayoutGroup id="dashboard-layout">
            {children}
        </LayoutGroup>
    );
};

export default DashboardMotion;