import { interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill, Easing } from "remotion";
import { CodeComparison } from "../components/ui/code-comparison";

const beforeCode = `// The Old Way — manual state for every field
export function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (name.length >= 3) setShowEmail(true);
    else setShowEmail(false);
  }, [name]);

  const validate = () => {
    const errs = {};
    if (!name) errs.name = "Required";
    if (showEmail && !email) errs.email = "Required";
    return errs;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={...} />
      {showEmail && <input value={email} />}
      <input value={age} onChange={...} />
    </form>
  );
}`;

const afterCode = `// The react-dynform Way — one schema
const schema = {
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    visibleIf: {
      field: "name",
      minLength: 3,
    },
  },
  age: {
    type: "number",
    min: 18,
  },
};

<DynForm schema={schema} />`;

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const scale = interpolate(frame, [0, 20], [0.95, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  return (
    <AbsoluteFill
      className="flex items-center justify-center bg-[#030303]"
      style={{ padding: 60 }}
    >
      <div
        style={{
          opacity: fadeIn,
          transform: `scale(${scale})`,
          width: "100%",
        }}
      >
        <CodeComparison
          beforeCode={beforeCode}
          afterCode={afterCode}
          language="typescript"
          filename="form.tsx"
          beforeLabel="before"
          afterLabel="after"
        />
      </div>
    </AbsoluteFill>
  );
};
