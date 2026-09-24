"use client";

import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

export default function ApexLineChart({ plans }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = new ApexCharts(chartRef.current, {
            chart: {
                type: "area",
                height: 180,
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                parentHeightOffset: 0,
                fontFamily: "inherit",
                foreColor:
                    "var(--color-foreground-muted)",
                animations: {
                    enabled: false,
                },
            },

            colors: [
                "var(--color-accent)",
                "var(--color-foreground-muted)",
            ],

            series: [
                {
                    name: "Actual",
                    data: plans.map(
                        (plan) => plan.spent
                    ),
                },
                {
                    name: "Planned",
                    data: plans.map(
                        (plan) => plan.planned
                    ),
                },
            ],

            stroke: {
                width: [2.5, 2],
                dashArray: [0, 5],
                curve: "smooth",
                lineCap: "round",
            },

            fill: {
                type: "solid",
                opacity: [0.12, 0],
            },

            dataLabels: {
                enabled: false,
            },

            grid: {
                show: false,
            },

            legend: {
                show: false,
            },

            markers: {
                size: [4, 0],
                strokeColors:
                    "var(--color-surface)",
            },

            xaxis: {
                categories: plans.map(
                    (plan) => plan.short
                ),

                labels: {
                    style: {
                        fontSize: "10px",
                        colors:
                            "var(--color-foreground-muted)",
                    },
                },

                axisBorder: {
                    show: false,
                },

                axisTicks: {
                    show: false,
                },

                crosshairs: {
                    show: false,
                },
            },

            yaxis: {
                show: false,
            },

            tooltip: {
                enabled: false,
            },
        });

        chart.render();

        return () => {
            chart.destroy();
        };
    }, [plans]);

    return <div ref={chartRef} />;
}