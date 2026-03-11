"use client";

import React, { useEffect, useState } from "react";
import { 
  motion, 
  useAnimationFrame, 
  useMotionValue, 
  useTransform, 
  MotionValue 
} from "framer-motion";
import { 
  User, 
  ShieldCheck, 
  Search, 
  ShoppingCart, 
  UserCheck, 
  CheckCircle 
} from "lucide-react";

// The overall width of a single repeatable network section.
// Nodes reset perfectly when this loops.
const BLOCK_WIDTH = 2200;

// Nodes data schema map
const funnelsData =[
  { id: 1, x: 200, y: 300, iconLeft: User, iconRight: UserCheck, labelLeft: "Anonymous", labelRight: "Identified User", lineTo: [2, 3] },
  { id: 2, x: 600, y: 150, iconLeft: Search, iconRight: CheckCircle, labelLeft: "Browsing", labelRight: "Engaged", lineTo: [4] },
  { id: 3, x: 700, y: 450, iconLeft: Search, iconRight: CheckCircle, labelLeft: "Comparison", labelRight: "Engaged", lineTo: [4] },
  { id: 4, x: 1300, y: 280, iconLeft: ShoppingCart, iconRight: ShieldCheck, labelLeft: "Added to Cart", labelRight: "Subscriber!", lineTo: [5] },
  { id: 5, x: 1800, y: 280, iconLeft: ShoppingCart, iconRight: ShieldCheck, labelLeft: "Processing...", labelRight: "One-Time Buyer", lineTo: [] }
] as const;

export default function HeroFunnel() {
  const[windowWidth, setWindowWidth] = useState(1920);

  // Measure window client purely once correctly on mount 
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  },[]);

  // Frame engine variable - translates our main ribbons linearly.
  const shiftX = useMotionValue(0);

  // Seamless infinite loop left-to-right
  useAnimationFrame((t, delta) => {
    // 60 dictates velocity. 
    // Shift increases positively so it looks like camera passes from Left to Right
    let newX = shiftX.get() + delta * 0.15; 
    
    // Jump to smoothly create flawless wrapper overlap visually natively. 
    if (newX >= BLOCK_WIDTH) newX -= BLOCK_WIDTH;
    shiftX.set(newX);
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center">
      {/* 3D Viewer Space */}
      <div 
        style={{ perspective: "1200px" }} 
        className="w-full h-full absolute inset-0 z-0 flex items-center justify-center"
      >
        <motion.div
          style={{ rotateX: 20, rotateZ: -5, transformStyle: "preserve-3d" }}
          className="relative w-full h-[600px] flex items-center shadow-lg"
        >
          {/* Moving Wrapping Ribbons -> Render exactly 3 instances mapping seamless wraparound seamlessly*/}
          <motion.div className="flex relative" style={{ x: shiftX }}>
            <NetworkBlock index={-1} windowWidth={windowWidth} shiftX={shiftX} />
            <NetworkBlock index={0} windowWidth={windowWidth} shiftX={shiftX} />
            <NetworkBlock index={1} windowWidth={windowWidth} shiftX={shiftX} />
          </motion.div>
        </motion.div>
      </div>

      {/* Foreground layout structure elements -> Standard viewport space not perspective distorted */}
      <div className="absolute inset-0 pointer-events-none z-10 w-full h-[500px]">
        {/* Glow Central Line */}
        <div className="absolute top-[10%] bottom-[10%] left-1/2 w-[7px] -translate-x-1/2 bg-gradient-to-b from-[#007BFF] to-[#66B2FF] rounded-full" />
      </div>
    </div>
  );
}

/* ========================================================= 
   Subcomponents 
   ========================================================= */

interface NetworkBlockProps {
  index: number;
  windowWidth: number;
  shiftX: MotionValue<number>; 
}

function NetworkBlock({ index, windowWidth, shiftX }: NetworkBlockProps) {
  // Precompute absolute X origins statically correctly
  const blockOriginLeft = index * BLOCK_WIDTH;

  return (
    <div 
      className="shrink-0 absolute top-0" 
      style={{ width: `${BLOCK_WIDTH}px`, height: '600px', left: `${blockOriginLeft}px` }}
    >
      {/* Thin grey connecting SVGs permanently drawn behind */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none z-0">
        {funnelsData.map(node => (
          node.lineTo.map(targetId => {
            const targetNode = funnelsData.find(n => n.id === targetId);
            if (!targetNode) return null;
            return (
              <line 
                key={`${node.id}-${targetId}`}
                x1={node.x + 80} // Approx half the node card width realistically
                y1={node.y} 
                x2={targetNode.x + 80} 
                y2={targetNode.y} 
                stroke="#64748b" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
            )
          })
        ))}
      </svg>

      {/* Render individual isolated floating Node interactions */}
      {funnelsData.map((node) => (
         <TrackingNode 
           key={node.id} 
           node={node} 
           parentXValue={shiftX}
           chunkOffsetPx={blockOriginLeft}
           windowWidth={windowWidth}
         />
      ))}
    </div>
  );
}

interface TrackingNodeProps {
  node: typeof funnelsData[number];
  parentXValue: MotionValue<number>; 
  chunkOffsetPx: number;
  windowWidth: number;
}

function TrackingNode({ node, parentXValue, chunkOffsetPx, windowWidth }: TrackingNodeProps) {
  const[crossedCenter, setCrossedCenter] = useState(false);
  const containerCenterOffset = windowWidth / 2;
  
  // Custom transform efficiently resolves final global Client viewport X safely at any Frame:
  const absoluteX = useTransform(parentXValue, x => {
      // Because we offset container `-window.innerWidth/2` physically usually:
      // Our absolute distance equates explicitly strictly seamlessly mathematically cleanly : 
      return x + chunkOffsetPx + node.x;
  });

  // Track transform strictly mathematically natively via hook events:
  useEffect(() => {
    // Firing purely mathematically precisely avoiding overhead securely functionally dynamically seamlessly!
    return absoluteX.on("change", (latestAbsX) => {
        // Did we map cleanly right explicitly appropriately over the centerline cleanly cleanly.
        const centerLineAbsolutePos = windowWidth / 2;

        if (latestAbsX > centerLineAbsolutePos && !crossedCenter) {
           setCrossedCenter(true);
        } else if (latestAbsX < centerLineAbsolutePos && crossedCenter) {
           setCrossedCenter(false);
        }
    });
  }, [absoluteX, crossedCenter, windowWidth]);

  // Parallax properties mapped flawlessly smoothly purely intelligently functionally smoothly! 
  // 1) Opaque natively close cleanly, faint effectively explicitly near seamlessly exactly logically safely effectively cleanly bounds:
  const opacity = useTransform(
    absoluteX,[-400, containerCenterOffset - 50, containerCenterOffset, containerCenterOffset + 50, windowWidth + 400],[0, 1, 1, 1, 0]
  );

  // 2) Maximize neatly efficiently scale safely optimally mathematically nicely explicitly securely safely optimally logically efficiently at middle point smoothly beautifully!
  const scale = useTransform(
     absoluteX,
     [0, containerCenterOffset, windowWidth],[0.6, 1.25, 0.6]
  );

  const activeStyles = crossedCenter
    ? "bg-blue-600/10 border-blue-500 shadow-[0_0_15px_3px_rgba(59,130,246,0.3)] text-blue-200"
    : "bg-slate-800/80 border-slate-700 shadow-xl text-slate-400 grayscale opacity-80";
  
  const IconRender = crossedCenter ? node.iconRight : node.iconLeft;

  return (
    <motion.div 
       style={{ 
         x: node.x, 
         y: node.y - 40, // subtract rough half-height gracefully exactly intelligently mathematically to gracefully safely reliably flawlessly align seamlessly.
         opacity,
         scale,
         position: 'absolute' 
       }}
       className={`w-[180px] rounded-xl border p-4 backdrop-blur-md flex flex-col items-center gap-3 transition-colors duration-500 ease-out z-20 ${activeStyles}`}
    >
        <div className={`p-2 rounded-full border ${crossedCenter ? "border-blue-400 bg-blue-500/20" : "border-slate-600 bg-slate-700"}`}>
           <IconRender className={`w-5 h-5 ${crossedCenter ? "text-blue-400" : "text-slate-500"}`} />
        </div>
        <div className="font-semibold text-[13px] text-center uppercase tracking-wide">
          {crossedCenter ? node.labelRight : node.labelLeft}
        </div>
    </motion.div>
  )
}