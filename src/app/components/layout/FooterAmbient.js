"use client";

import { useEffect, useMemo, useRef, useState, } from "react";
import { useInView } from "motion/react";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { FiShoppingBag, FiTag, } from "react-icons/fi";

const DESKTOP_ITEMS = [
  { type: "text", value: "₹430", label: "saved", role: "accent" },
  { type: "text", value: "3 better", label: "prices", role: "secondary" },
  { type: "text", value: "18 / 24", label: "", role: "success" },
  { type: "text", value: "₹12,450", label: "spent", role: "secondary" },
  { type: "text", value: "THIS", label: "WEEK", role: "accent" },
  { type: "text", value: "44", label: "purchased", role: "success" },
  { type: "icon", value: FiShoppingBag, role: "secondary" },
  { type: "icon", value: FiTag, role: "accent" },
];

const MOBILE_ITEMS = [
  { type: "text", value: "₹430", label: "saved", role: "accent" },
  { type: "text", value: "18 / 24", label: "", role: "success" },
  { type: "icon", value: FiShoppingBag, role: "secondary" },
  { type: "icon", value: FiTag, role: "accent" },
];

const ROLE_CLASSES = {
  accent: "text-accent",
  success: "text-success",
  secondary: "text-foreground-muted",
};

const TEXT_WIDTH = 112;
const TEXT_HEIGHT = 22;
const ICON_SIZE = 28;

function createFragment(item, index, total, width) {
  const isIcon = item.type === "icon";

  const safeMargin = Math.min(72, width * 0.06);
  const spreadWidth = Math.max(width - safeMargin * 2, 120);
  const jitter = Math.min(24, width * 0.04);

  const x =
    safeMargin +
    (index / Math.max(total - 1, 1)) * spreadWidth +
    (Math.random() - 0.5) * jitter;

  const y = 8 + Math.random() * 40;

  return {
    ...item,
    id: `${item.type}-${item.value}-${index}`,
    width: isIcon ? ICON_SIZE : TEXT_WIDTH,
    height: isIcon ? ICON_SIZE : TEXT_HEIGHT,
    x,
    y,
    angle: (Math.random() - 0.5) * 12,
  };
}

export default function FooterAmbient({
  footerRef,
  panelRef,
  isFooterFocused = false,
  onSettled,
}) {
  const ambientRef = useRef(null);

  const hasRunRef = useRef(false);

  const engineRef = useRef(null);
  const bodiesRef = useRef([]);
  const matterRef = useRef(null);

  const animationRef = useRef(null);

  const dragRef = useRef({
    active: false,
    index: -1,
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
  });

  const floorYRef = useRef(0);
  const footerRectRef = useRef(null);

  const [fragments, setFragments] = useState([]);

  const isMobile = useMediaQuery("(max-width: 1023px)");
  const reducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );

  const footerInView = useInView(footerRef, {
    once: true,
    margin: "0px 0px -100px 0px",
  });

  const items = useMemo(
    () => (isMobile ? MOBILE_ITEMS : DESKTOP_ITEMS),
    [isMobile]
  );

  /*
   * Convert a pointer event into Footer-local coordinates.
   */
  const getLocalPoint = (event) => {
    const footer = footerRef?.current;

    if (!footer) {
      return {
        x: event.clientX,
        y: event.clientY,
      };
    }

    const rect = footer.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  /*
   * Keep a dragged body inside the visible Footer physics area.
   */
  const clampDragPosition = (index, x, y) => {
    const body = bodiesRef.current[index];

    if (!body) {
      return { x, y };
    }

    const rect = footerRectRef.current;

    if (!rect) {
      return { x, y };
    }

    const halfWidth = body.bounds.max.x - body.position.x;
    const halfHeight = body.bounds.max.y - body.position.y;

    const minX = halfWidth;
    const maxX = rect.width - halfWidth;

    const minY = halfHeight;
    const maxY =
      floorYRef.current - halfHeight;

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  /*
   * Start dragging the actual fragment/body.
   */
  const handlePointerDown = (event, index) => {
    if (isMobile || reducedMotion) {
      return;
    }

    const body = bodiesRef.current[index];

    if (!body) {
      return;
    }

    const point = getLocalPoint(event);

    const drag = dragRef.current;

    drag.active = true;
    drag.index = index;
    drag.pointerId = event.pointerId;
    drag.offsetX = point.x - body.position.x;
    drag.offsetY = point.y - body.position.y;
    drag.lastX = point.x;
    drag.lastY = point.y;
    drag.lastTime = performance.now();

    /*
     * Make this body temporarily static while the pointer controls it.
     * This is much more reliable than Matter MouseConstraint for DOM
     * rendered bodies.
     */
    const matter = matterRef.current;

    if (matter?.Body) {
      matter.Body.setVelocity(body, {
        x: 0,
        y: 0,
      });

      matter.Body.setAngularVelocity(body, 0);
      matter.Body.setStatic(body, true);
    }

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    );

    event.preventDefault();
  };

  /*
   * Move the physics body directly with the pointer.
   */
  const handlePointerMove = (event) => {
    const drag = dragRef.current;

    if (
      !drag.active ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    const body = bodiesRef.current[drag.index];

    if (!body) {
      return;
    }

    const matter = matterRef.current;

    if (!matter?.Body) {
      return;
    }

    const point = getLocalPoint(event);

    const next = clampDragPosition(
      drag.index,
      point.x - drag.offsetX,
      point.y - drag.offsetY
    );

    const now = performance.now();
    const dt = Math.max(
      now - drag.lastTime,
      1
    );

    /*
     * Store a small release velocity so the fragment feels physical
     * when the user lets it go.
     */
    drag.lastX = point.x;
    drag.lastY = point.y;
    drag.lastTime = now;

    matter.Body.setPosition(
      body,
      next
    );

    matter.Body.setVelocity(
      body,
      {
        x: 0,
        y: 0,
      }
    );

    matter.Body.setAngularVelocity(
      body,
      0
    );

    event.preventDefault();
  };

  /*
   * Release the body back into the physics simulation.
   */
  const handlePointerUp = (event) => {
    const drag = dragRef.current;

    if (
      !drag.active ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }

    const body = bodiesRef.current[drag.index];
    const matter = matterRef.current;

    if (body && matter?.Body) {
      const point = getLocalPoint(event);

      const velocityX =
        (point.x - drag.lastX) / 100;

      const velocityY =
        (point.y - drag.lastY) / 100;

      matter.Body.setStatic(body, false);

      matter.Body.setVelocity(
        body,
        {
          x: Math.max(
            Math.min(velocityX, 0.8),
            -0.8
          ),
          y: Math.max(
            Math.min(velocityY, 0.8),
            -0.8
          ),
        }
      );
    }

    try {
      event.currentTarget.releasePointerCapture?.(
        event.pointerId
      );
    } catch {
      // Pointer capture may already be released.
    }

    drag.active = false;
    drag.index = -1;
    drag.pointerId = null;
    drag.offsetX = 0;
    drag.offsetY = 0;
  };

  /*
   * Cancel drag safely if the browser interrupts the gesture.
   */
  const handlePointerCancel = (event) => {
    handlePointerUp(event);
  };

  useEffect(() => {
    if (reducedMotion) {
      const footer = footerRef?.current;

      if (!footer) {
        return undefined;
      }

      const footerRect =
        footer.getBoundingClientRect();

      const width = footerRect.width;
      const floorY = Math.max(
        100,
        footerRect.height - 60
      );

      floorYRef.current = floorY;

      const settled = items.map(
        (item, index) => {
          const isIcon =
            item.type === "icon";

          const total = items.length;

          return {
            ...item,
            id: `static-${index}`,
            width: isIcon
              ? ICON_SIZE
              : TEXT_WIDTH,
            height: isIcon
              ? ICON_SIZE
              : TEXT_HEIGHT,
            x:
              width * 0.08 +
              (index /
                Math.max(total - 1, 1)) *
                width *
                0.84,
            y:
              floorY -
              16 -
              (index % 2) * 26,
            angle:
              index % 2 === 0
                ? -2
                : 2,
          };
        }
      );

      setFragments(settled);
      onSettled?.();

      return undefined;
    }

    if (
      !footerInView ||
      hasRunRef.current
    ) {
      return undefined;
    }

    const footer = footerRef?.current;

    if (!footer) {
      return undefined;
    }

    hasRunRef.current = true;

    let cancelled = false;
    let settledFired = false;

    const runPhysics = async () => {
      try {
        const matter =
          await import("matter-js");

        if (cancelled) {
          return;
        }

        matterRef.current = matter;

        const {
          Engine,
          World,
          Bodies,
          Body,
        } = matter;

        const footerRect =
          footer.getBoundingClientRect();

        footerRectRef.current =
          footerRect;

        const width =
          footerRect.width;

        const height =
          footerRect.height;

        /*
         * The baseline remains near the bottom of the footer.
         */
        const floorY =
          height - 40;

        floorYRef.current =
          floorY;

        const engine = Engine.create({
          gravity: {
            x: 0,
            y: 1.8,
            scale: 0.001,
          },
        });

        engineRef.current =
          engine;

        /*
         * Floor.
         */
        const floor =
          Bodies.rectangle(
            width / 2,
            floorY + 18,
            width * 1.5,
            36,
            {
              isStatic: true,
              friction: 0.8,
              restitution: 0.15,
            }
          );

        /*
         * Side boundaries.
         */
        const wallL =
          Bodies.rectangle(
            -18,
            height / 2,
            36,
            height * 2,
            {
              isStatic: true,
              friction: 0.5,
            }
          );

        const wallR =
          Bodies.rectangle(
            width + 18,
            height / 2,
            36,
            height * 2,
            {
              isStatic: true,
              friction: 0.5,
            }
          );

        World.add(
          engine.world,
          [
            floor,
            wallL,
            wallR,
          ]
        );

        const activeItems =
          items.slice(
            0,
            isMobile ? 4 : 8
          );

        const initial =
          activeItems.map(
            (item, index) =>
              createFragment(
                item,
                index,
                activeItems.length,
                width
              )
          );

        setFragments(initial);

        const bodies =
          initial.map(
            (fragment) => {
              const body =
                Bodies.rectangle(
                  fragment.x,
                  fragment.y,
                  fragment.width,
                  fragment.height,
                  {
                    restitution: 0.2,
                    friction: 0.85,
                    frictionAir: 0.02,
                    angle:
                      (fragment.angle *
                        Math.PI) /
                      180,
                    density: 0.001,
                  }
                );

              Body.setVelocity(
                body,
                {
                  x:
                    (Math.random() -
                      0.5) *
                    0.3,
                  y: 0,
                }
              );

              Body.setAngularVelocity(
                body,
                (Math.random() -
                  0.5) *
                  0.008
              );

              return body;
            }
          );

        bodiesRef.current =
          bodies;

        World.add(
          engine.world,
          bodies
        );

        const start =
          performance.now();

        const tick = (now) => {
          if (cancelled) {
            return;
          }

          Engine.update(
            engine,
            1000 / 60
          );

          /*
           * Read all Matter bodies and render them through React.
           */
          setFragments(
            (current) =>
              current.map(
                (fragment, index) => {
                  const body =
                    bodies[index];

                  if (!body) {
                    return fragment;
                  }

                  return {
                    ...fragment,
                    x:
                      body.position.x,
                    y:
                      body.position.y,
                    angle:
                      (body.angle *
                        180) /
                      Math.PI,
                  };
                }
              )
          );

          if (!settledFired) {
            const elapsed =
              now - start;

            const settled =
              bodies.every(
                (body) => {
                  /*
                   * Ignore bodies currently being dragged.
                   */
                  const isDragged =
                    dragRef.current
                      .active &&
                    bodies[
                      dragRef.current
                        .index
                    ] === body;

                  if (isDragged) {
                    return false;
                  }

                  const velocity =
                    Math.abs(
                      body.velocity.y
                    );

                  const angular =
                    Math.abs(
                      body.angularVelocity
                    );

                  return (
                    body.position.y >=
                      floorY - 48 &&
                    velocity < 0.15 &&
                    angular < 0.015
                  );
                }
              );

            if (
              settled ||
              elapsed > 2500
            ) {
              settledFired =
                true;

              onSettled?.();
            }
          }

          animationRef.current =
            requestAnimationFrame(
              tick
            );
        };

        animationRef.current =
          requestAnimationFrame(
            tick
          );
      } catch {
        setFragments([]);
      }
    };

    runPhysics();

    return () => {
      cancelled = true;

      cancelAnimationFrame(
        animationRef.current
      );

      const engine =
        engineRef.current;

      const matter =
        matterRef.current;

      dragRef.current.active =
        false;

      if (
        engine &&
        matter
      ) {
        try {
          matter.World.clear(
            engine.world,
            false
          );

          matter.Engine.clear(
            engine
          );
        } catch {
          // Cleanup should never interrupt unmount.
        }
      }

      engineRef.current =
        null;

      bodiesRef.current =
        [];

      matterRef.current =
        null;
    };
  }, [
    footerInView,
    reducedMotion,
    isMobile,
    items,
    footerRef,
    onSettled,
  ]);

  if (
    !footerInView &&
    !reducedMotion &&
    fragments.length === 0
  ) {
    return (
      <div
        ref={ambientRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      />
    );
  }

  return (
    <div
      ref={ambientRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      style={{
        opacity:
          isFooterFocused
            ? 0.72
            : 1,
        transition:
          "opacity var(--motion-fast, 120ms) ease-out",
      }}
    >
      {fragments.map(
        (fragment, index) => {
          const Icon =
            fragment.type ===
            "icon"
              ? fragment.value
              : null;

          const hasLabel =
            fragment.type ===
              "text" &&
            fragment.label;

          return (
            <div
              key={fragment.id}
              className="absolute left-0 top-0 whitespace-nowrap select-none pointer-events-auto cursor-grab"
              style={{
                transform:
                  `translate3d(${fragment.x}px, ${fragment.y}px, 0) rotate(${fragment.angle}deg)`,
                willChange:
                  reducedMotion
                    ? "auto"
                    : "transform",
              }}
              onPointerDown={(event) =>
                handlePointerDown(
                  event,
                  index
                )
              }
              onPointerMove={
                handlePointerMove
              }
              onPointerUp={
                handlePointerUp
              }
              onPointerCancel={
                handlePointerCancel
              }
            >
              {Icon ? (
                <div
                  className={`flex items-center justify-center rounded-lg backdrop-blur-sm bg-surface-glass-subtle border border-border-glass-subtle shadow-sm ${ROLE_CLASSES[fragment.role]}`}
                  style={{
                    width: 34,
                    height: 34,
                    padding: 3,
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <div
                  className={`inline-flex items-baseline gap-1.5 rounded-lg px-2.5 py-1.5 backdrop-blur-sm bg-surface-glass-subtle border border-border-glass-subtle shadow-sm ${ROLE_CLASSES[fragment.role]}`}
                >
                  <span className="text-[11px] font-bold tracking-[0.04em] leading-none">
                    {fragment.value}
                  </span>

                  {hasLabel && (
                    <span className="text-[9px] font-medium uppercase tracking-[0.12em] leading-none opacity-70">
                      {fragment.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}