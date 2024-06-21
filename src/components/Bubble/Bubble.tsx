import LoadingMask from '@/components/Bubble/LoadingMask';
import {
  getGreenRadialGradientTexture,
  getRedRadialGradientTexture,
  getWhiteRadialGradientTexture,
} from '@/components/Bubble/Textures';
import {
  bubblePacking,
  calcBubbleResizeScale,
} from '@/components/Bubble/utils';
import { getRandomInt } from '@/utils/math';
import { useModel } from '@@/exports';
import { useDebounceEffect, useSize, useThrottleFn } from 'ahooks';
import { Empty } from 'antd';
import * as Matter from 'matter-js';
import { Body, Engine, MouseConstraint, Render } from 'matter-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Bubble.less';

const wallSize = 1000;
const wallOffset = wallSize / 2;
const textureSize = 256;

export default function Bubble() {
  const { timeSpan } = useModel('application', (state) => ({
    timeSpan: state.timeSpan,
  }));
  const { hotPointsSortByHot, hotPointsLoading } = useModel(
    'group',
    (state) => ({
      hotPointsSortByHot: state.hotPointsSortByHot,
      hotPointsLoading: state.hotPointsLoading,
    }),
  );
  const { setCurrentHotPoint } = useModel('hotpoints', (state) => ({
    setCurrentHotPoint: state.setCurrentHotPoint,
  }));

  const containerRef = useRef<any>();
  const requestRef = useRef<any>();
  const engineRef = useRef<Engine>();
  const rendererRef = useRef<Render>();
  const topWallRef = useRef<Body>();
  const bottomWallRef = useRef<Body>();
  const leftWallRef = useRef<Body>();
  const rightWallRef = useRef<Body>();
  const mouseDownPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseConstraintRef = useRef<MouseConstraint>();
  const mouseMoveRef = useRef<any>();
  const mouseUpRef = useRef<any>();

  const size = useSize(containerRef);

  const [bubbles, setBubbles] = useState<Body[]>([]);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const data = useMemo(
    () => hotPointsSortByHot[timeSpan],
    [timeSpan, hotPointsSortByHot],
  );

  const scaleBubble = useCallback((_bubble: Body, radiusScale: number) => {
    const radius = _bubble.circleRadius * radiusScale;

    const spriteScale = (radius * 2) / textureSize;
    _bubble.render.sprite!.xScale = spriteScale;
    _bubble.render.sprite!.yScale = spriteScale;

    const bounds = _bubble.bounds;
    // const scale = (radius * 2) / (bounds.max.y - bounds.min.y);
    Matter.Body.scale(_bubble, radiusScale, radiusScale);

    const isOutsideBottomWall =
      bounds.max.y > bottomWallRef.current!.bounds.min.y;
    const isOutsideRightWall =
      bounds.max.x > rightWallRef.current!.bounds.min.x;

    Matter.Body.setPosition(_bubble, {
      x: isOutsideRightWall
        ? rightWallRef.current!.bounds.min.x - radius
        : _bubble.position.x,
      y: isOutsideBottomWall
        ? bottomWallRef.current!.bounds.min.y - radius
        : _bubble.position.y,
    });

    Matter.Body.setInertia(_bubble, Infinity);
  }, []);

  const { run: handleTick } = useThrottleFn(
    () => {
      const bubbleScale = calcBubbleResizeScale(bubbles, size!);
      if (Number(bubbleScale.toFixed(2)) !== 1) {
        for (const bubble of bubbles) {
          scaleBubble(bubble, bubbleScale);
        }
      }
    },
    { wait: 20 },
  );

  const initCanvas = () => {
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies,
      Events = Matter.Events;

    // create engine
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    engine.gravity.y = 0;
    engine.gravity.x = 0;

    // create renderer
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: size!.width,
        height: size!.height,
        showAngleIndicator: false,
        wireframes: false,
        background: '#1f1f1f',
        // showStats: DEV,
        // showPerformance: DEV,
      },
    });
    rendererRef.current = render;

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(runner, 'tick', () => {
      handleTick();
    });

    // add bodies
    const options = {
      isStatic: true,
    };

    world.bodies = [];

    const topWall = Bodies.rectangle(
      size!.width / 2,
      -wallOffset,
      size!.width + 2 * wallOffset,
      wallSize,
      options,
    );
    const bottomWall = Bodies.rectangle(
      size!.width / 2,
      size!.height + wallOffset,
      size!.width + 2 * wallOffset,
      wallSize,
      options,
    );
    const rightWall = Bodies.rectangle(
      size!.width + wallOffset,
      size!.height / 2,
      wallSize,
      size!.height + 2 * wallOffset,
      options,
    );
    const leftWall = Bodies.rectangle(
      -wallOffset,
      size!.height / 2,
      wallSize,
      size!.height + 2 * wallOffset,
      options,
    );

    topWallRef.current = topWall;
    bottomWallRef.current = bottomWall;
    rightWallRef.current = rightWall;
    leftWallRef.current = leftWall;

    // these static walls will not be rendered in this sprites example, see options
    Composite.add(world, [topWall, bottomWall, rightWall, leftWall]);

    // add mouse control
    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 1,
          damping: 0,
          render: {
            visible: false,
          },
        },
      });
    mouseConstraintRef.current = mouseConstraint;
    Composite.add(world, mouseConstraint);

    Matter.Events.on(mouseConstraintRef.current!, 'mousedown', (event) => {
      mouseDownPositionRef.current = { ...event.source.mouse.position };
    });

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: size!.width, y: size!.height },
    });
  };

  const addBubbles = () => {
    setProgress(0);

    const Composite = Matter.Composite,
      Events = Matter.Events,
      Bodies = Matter.Bodies;

    const _bubbles: Body[] = [];
    const previousBubbles: Body[] = [];

    if (bubbles) {
      // const labels = data.map((b) => b.name);
      for (const b of bubbles) {
        // if (labels.indexOf(b.label) !== -1) {
        //   previousBubbles.push(b);
        // } else {
        //   Composite.remove(engineRef.current!.world, b);
        // }
        Composite.remove(engineRef.current!.world, b);
      }
    }

    const packingRes = bubblePacking<API.Hotpoint>(
      size!.width,
      size!.height,
      data,
      'hot',
    );

    let _progress = 0;

    for (const d of packingRes) {
      _progress++;
      setProgress((_progress / packingRes.length) * 100);
      let r = Math.max(Math.round(d.r), 1);

      // const previousBubble = previousBubbles.find((e) => e.label === d.name);
      // if (previousBubble) {
      //   const scale = r / previousBubble.circleRadius;
      //   scaleBubble(previousBubble, scale);
      // } else {
      const spriteScale = (r * 2) / textureSize;
      _bubbles.push(
        Bodies.circle(
          getRandomInt(0, size!.width),
          getRandomInt(0, size!.height),
          r,
          {
            label: d.name,
            inertia: Infinity,
            density: 0.0001,
            frictionAir: 0.01,
            restitution: 0,
            friction: 0.01,
            render: {
              sprite: {
                texture: !d.growth
                  ? getWhiteRadialGradientTexture(d.name, 0)
                  : d.growth > 0
                  ? getGreenRadialGradientTexture(d.name, d.growth)
                  : getRedRadialGradientTexture(d.name, d.growth),
                xScale: spriteScale,
                yScale: spriteScale,
              },
            },
          },
        ),
      );
      // }
    }
    setProgress(100);
    setBubbles([...previousBubbles, ..._bubbles]);
    Composite.add(engineRef.current!.world, _bubbles);

    if (mouseMoveRef.current) {
      Events.off(
        mouseConstraintRef.current!,
        'mousemove',
        mouseMoveRef.current,
      );
    }
    if (mouseUpRef.current) {
      Events.off(mouseConstraintRef.current!, 'mouseup', mouseUpRef.current);
    }

    mouseMoveRef.current = (event) => {
      const foundPhysics = Matter.Query.point(
        [...previousBubbles, ..._bubbles],
        event.source.mouse.position,
      );
      setHovered(!!foundPhysics[0]);
    };
    Events.on(mouseConstraintRef.current!, 'mousemove', mouseMoveRef.current);

    mouseUpRef.current = (event) => {
      const { x: downX, y: downY } = mouseDownPositionRef.current;
      const { x: upX, y: upY } = event.source.mouse.position;
      if (upX - downX <= 1 && upY - downY <= 1) {
        const foundPhysics = Matter.Query.point(
          [...previousBubbles, ..._bubbles],
          event.source.mouse.position,
        );
        if (foundPhysics && foundPhysics.length > 0) {
          setCurrentHotPoint(foundPhysics[0].label);
          // Perform any action you want to do when a bubble is clicked
        }
      }
    };
    Events.on(mouseConstraintRef.current!, 'mouseup', mouseUpRef.current!);
  };

  useEffect(() => {
    if (data) {
      if (engineRef.current) {
        addBubbles();
      }
    }
  }, [data]);

  useDebounceEffect(
    () => {
      if (size) {
        if (!engineRef.current && data) {
          initCanvas();
          addBubbles();
        } else if (rendererRef.current) {
          const render = rendererRef.current!;
          const { width, height } = size;

          render.bounds.max.x = width;
          render.bounds.max.y = height;
          render.options.width = width;
          render.options.height = height;
          render.canvas.width = width;
          render.canvas.height = height;
          Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: width, y: height },
          });

          Matter.Body.setPosition(topWallRef.current!, {
            x: width / 2,
            y: -wallOffset,
          });
          Matter.Body.setPosition(bottomWallRef.current!, {
            x: width / 2,
            y: height + wallOffset,
          });
          Matter.Body.setPosition(rightWallRef.current!, {
            x: width + wallOffset,
            y: height / 2,
          });
          Matter.Body.setPosition(leftWallRef.current!, {
            x: -wallOffset,
            y: height / 2,
          });

          const boundsX = topWallRef.current!.bounds;
          const scaleX = width / (boundsX.max.x - boundsX.min.x);
          Matter.Body.scale(topWallRef.current!, scaleX, 1);
          Matter.Body.scale(bottomWallRef.current!, scaleX, 1);

          const boundsY = rightWallRef.current!.bounds;
          const scaleY = height / (boundsY.max.y - boundsY.min.y);
          Matter.Body.scale(rightWallRef.current!, 1, scaleY);
          Matter.Body.scale(leftWallRef.current!, 1, scaleY);

          const bubbleScale = calcBubbleResizeScale(bubbles, { width, height });
          for (const bubble of bubbles) {
            scaleBubble(bubble, bubbleScale);
          }
        }
      }
    },
    [size, data],
    { wait: 200 },
  );

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        cancelAnimationFrame(requestRef.current);
        Matter.Engine.clear(engineRef.current!);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ cursor: hovered ? 'pointer' : 'auto' }}
    >
      <LoadingMask open={hotPointsLoading || progress < 100} />
      {!hotPointsLoading && progress === 100 && data.length === 0 && (
        <div className={styles.empty}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
    </div>
  );
}
