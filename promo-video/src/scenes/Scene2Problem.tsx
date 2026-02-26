import { interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill, Easing } from "remotion";

const badCode = `// The Old Way
export function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  // ... 50 more lines of state & effects
  return (
    <form>
      <input value={name} onChange={...} />
      {showEmail && <input value={email} />}
    </form>
  )
}
`;

const goodCode = `// The react-dynform Way
const schema = {
  name: { type: "string", required: true },
  email: { 
    type: "string", 
    visibleIf: { field: "name", minLength: 3 }
  }
};

<SchemaParser schema={schema} />
`;

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slower slide left/right
  const splitProgress = interpolate(frame, [30, 90], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  return (
    <AbsoluteFill style={{ flexDirection: "row", padding: 60, gap: 40, backgroundColor: "var(--background)" }}>
      {/* Left side: The messy way */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          opacity: interpolate(splitProgress, [0, 0.5], [1, 0.3]),
          transform: `translateX(${interpolate(splitProgress, [0, 1], [0, -40])}px)`
        }}
      >
        <pre
          style={{
            backgroundColor: "var(--card)",
            padding: 40,
            borderRadius: 12,
            border: "1px solid var(--border)",
            color: "var(--muted-foreground)", // Strikethrough/faded look
            fontSize: 28,
            overflow: "hidden",
            flex: 1,
            lineHeight: 1.6,
            margin: 0
          }}
        >
          {badCode.trim()}
        </pre>
      </div>

      {/* Right side: The clean way */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          opacity: interpolate(splitProgress, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(splitProgress, [0, 1], [40, 0])}px)`
        }}
      >
        <pre
          style={{
            backgroundColor: "var(--card)",
            padding: 40,
            borderRadius: 12,
            color: "var(--foreground)",
            fontSize: 32,
            overflow: "hidden",
            border: "1px solid var(--primary)", // High contrast primary border for focus
            boxShadow: "0 0 40px rgba(255,255,255,0.05)",
            flex: 1,
            lineHeight: 1.6,
            margin: 0
          }}
        >
          {goodCode.trim()}
        </pre>
      </div>
    </AbsoluteFill>
  );
};
