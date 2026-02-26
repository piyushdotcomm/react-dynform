import { useState, useRef } from 'react'
import { DynForm } from 'react-dynform'
import type { FormSchema, FormValues } from 'react-dynform'
import {
    Code2, Eye, RotateCcw, Copy, Check,
    Layers, GitBranch, Zap, Terminal, TriangleAlert
} from 'lucide-react'

// ─────────────────────────────────────────────
// Example Schemas
// ─────────────────────────────────────────────
const EXAMPLES: Record<string, { label: string; icon: JSX.Element; schema: FormSchema }> = {
    login: {
        label: 'Login',
        icon: <Zap size={12} />,
        schema: {
            id: 'login-form', title: 'Welcome back', description: 'Sign in to your account to continue.',
            submitLabel: 'Sign in',
            fields: [
                {
                    id: 'email', type: 'email', label: 'Email address', placeholder: 'you@example.com', required: true,
                    validation: [{ rule: 'required', message: 'Email is required.' }, { rule: 'email', message: 'Enter a valid email.' }]
                },
                {
                    id: 'password', type: 'password', label: 'Password', placeholder: '••••••••', required: true,
                    validation: [{ rule: 'required', message: 'Password is required.' }, { rule: 'minLength', value: 8, message: 'Minimum 8 characters.' }]
                },
            ],
        },
    },
    register: {
        label: 'Register',
        icon: <Layers size={12} />,
        schema: {
            id: 'register-form', title: 'Create account', description: 'Join thousands of developers using react-dynform.',
            submitLabel: 'Create account',
            fields: [
                {
                    id: 'name', type: 'text', label: 'Full name', placeholder: 'John Doe', required: true,
                    validation: [{ rule: 'required', message: 'Name is required.' }, { rule: 'minLength', value: 2, message: 'Name too short.' }]
                },
                {
                    id: 'email', type: 'email', label: 'Work email', placeholder: 'you@company.com', required: true,
                    validation: [{ rule: 'required', message: 'Email is required.' }, { rule: 'email', message: 'Invalid email.' }]
                },
                {
                    id: 'role', type: 'select', label: 'I am a...', required: true,
                    options: [{ label: 'Frontend Developer', value: 'fe' }, { label: 'Backend Developer', value: 'be' }, { label: 'Fullstack Developer', value: 'fs' }, { label: 'Designer', value: 'design' }, { label: 'Product Manager', value: 'pm' }],
                    validation: [{ rule: 'required', message: 'Please select a role.' }]
                },
                {
                    id: 'company', type: 'text', label: 'Company name', placeholder: 'Acme Inc.',
                    condition: { field: 'role', operator: 'exists' }, description: 'Appears when a role is selected'
                },
                {
                    id: 'agree', type: 'checkbox', label: 'I agree to the Terms of Service and Privacy Policy', required: true,
                    validation: [{ rule: 'required', message: 'Please accept to continue.' }]
                },
            ],
        },
    },
    multistep: {
        label: 'Multi-Step',
        icon: <Layers size={12} />,
        schema: {
            id: 'checkout', title: 'Complete your order', submitLabel: 'Place order',
            steps: [
                {
                    id: 's1', title: 'Contact', description: 'Your personal information',
                    fields: [
                        { id: 'first', type: 'text', label: 'First name', required: true, validation: [{ rule: 'required', message: 'Required.' }] },
                        { id: 'last', type: 'text', label: 'Last name', required: true, validation: [{ rule: 'required', message: 'Required.' }] },
                        { id: 'email', type: 'email', label: 'Email', required: true, validation: [{ rule: 'required', message: 'Required.' }, { rule: 'email', message: 'Invalid email.' }] },
                    ]
                },
                {
                    id: 's2', title: 'Shipping', description: 'Delivery address',
                    fields: [
                        { id: 'addr', type: 'text', label: 'Street address', required: true, placeholder: '123 Main St', validation: [{ rule: 'required', message: 'Required.' }] },
                        { id: 'city', type: 'text', label: 'City', required: true, validation: [{ rule: 'required', message: 'Required.' }] },
                        {
                            id: 'country', type: 'select', label: 'Country', required: true,
                            options: [{ label: 'Pakistan', value: 'PK' }, { label: 'United States', value: 'US' }, { label: 'United Kingdom', value: 'GB' }, { label: 'Canada', value: 'CA' }],
                            validation: [{ rule: 'required', message: 'Required.' }]
                        },
                    ]
                },
                {
                    id: 's3', title: 'Payment', description: 'Billing details',
                    fields: [
                        { id: 'card', type: 'text', label: 'Card number', placeholder: '4242 4242 4242 4242', required: true, validation: [{ rule: 'required', message: 'Required.' }] },
                        { id: 'name', type: 'text', label: 'Name on card', required: true, validation: [{ rule: 'required', message: 'Required.' }] },
                        { id: 'notes', type: 'textarea', label: 'Order notes (optional)', rows: 2 },
                    ]
                },
            ],
        },
    },
    conditional: {
        label: 'Conditional',
        icon: <GitBranch size={12} />,
        schema: {
            id: 'smart-form', title: 'Smart Form', description: 'Fields appear based on your answers.',
            submitLabel: 'Submit',
            fields: [
                {
                    id: 'type', type: 'radio', label: 'Account type', required: true,
                    options: [{ label: 'Individual', value: 'individual' }, { label: 'Business', value: 'business' }],
                    validation: [{ rule: 'required', message: 'Please select a type.' }]
                },
                {
                    id: 'fullName', type: 'text', label: 'Full name', required: true, placeholder: 'Jane Doe',
                    condition: { field: 'type', equals: 'individual' },
                    validation: [{ rule: 'required', message: 'Name is required.' }]
                },
                {
                    id: 'company', type: 'text', label: 'Company name', required: true, placeholder: 'Acme Corp',
                    condition: { field: 'type', equals: 'business' },
                    validation: [{ rule: 'required', message: 'Company name is required.' }]
                },
                {
                    id: 'taxId', type: 'text', label: 'Tax / VAT ID', placeholder: 'US-123456789',
                    condition: { field: 'type', equals: 'business' }, description: 'Required for business invoicing'
                },
                {
                    id: 'size', type: 'select', label: 'Company size',
                    condition: { field: 'type', equals: 'business' },
                    options: [{ label: '1–10 employees', value: 'small' }, { label: '11–100 employees', value: 'medium' }, { label: '100+ employees', value: 'large' }]
                },
                { id: 'message', type: 'textarea', label: 'Tell us about your use case', placeholder: 'I want to build...', rows: 3 },
            ],
        },
    },
}

// ─────────────────────────────────────────────
// Form Preview
// ─────────────────────────────────────────────
function FormPreview({ schema }: { schema: FormSchema }) {
    const [submitted, setSubmitted] = useState<FormValues | null>(null)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(submitted, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
                <div className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center mb-4">
                    <Check size={20} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Submitted successfully</h3>
                <p className="text-zinc-500 text-sm mb-6">Values returned from <code className="text-zinc-400 font-mono text-xs">onSubmit(values)</code></p>
                <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden text-left">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-600">submitted values</span>
                        <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer font-mono">
                            {copied ? <Check size={10} className="text-white" /> : <Copy size={10} />}
                            {copied ? 'copied' : 'copy'}
                        </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-zinc-300 overflow-auto max-h-56 leading-relaxed">
                        {JSON.stringify(submitted, null, 2)}
                    </pre>
                </div>
                <button onClick={() => setSubmitted(null)} className="mt-5 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                    <RotateCcw size={12} /> Reset form
                </button>
            </div>
        )
    }

    return (
        <div className="p-8">
            <DynForm schema={schema} onSubmit={(v) => setSubmitted(v)} className="dynform-preview" />
        </div>
    )
}

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────
export default function App() {
    const [active, setActive] = useState('login')
    const [schemaText, setSchemaText] = useState(() => JSON.stringify(EXAMPLES['login']!.schema, null, 2))
    const [parseError, setParseError] = useState<string | null>(null)
    const [parsedSchema, setParsedSchema] = useState<FormSchema>(EXAMPLES['login']!.schema)
    const [previewKey, setPreviewKey] = useState(0)
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
    const [copied, setCopied] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const selectExample = (key: string) => {
        const ex = EXAMPLES[key]
        if (!ex) return
        setActive(key)
        const text = JSON.stringify(ex.schema, null, 2)
        setSchemaText(text)
        setParsedSchema(ex.schema)
        setParseError(null)
        setPreviewKey(k => k + 1)
    }

    const handleEdit = (text: string) => {
        setSchemaText(text)
        try {
            const parsed = JSON.parse(text)
            setParsedSchema(parsed)
            setParseError(null)
            setPreviewKey(k => k + 1)
        } catch (e: unknown) {
            setParseError(e instanceof Error ? e.message : 'Invalid JSON')
        }
    }

    const handleFormat = () => {
        try {
            const p = JSON.parse(schemaText)
            setSchemaText(JSON.stringify(p, null, 2))
            setParseError(null)
        } catch { /* keep error */ }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(schemaText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-black text-zinc-100 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── Header ── */}
            <header className="flex items-center justify-between px-5 h-12 border-b border-zinc-800 bg-black sticky top-0 z-20 shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1">
                        <Terminal size={12} className="text-zinc-400" />
                        <span className="text-xs font-mono font-medium text-zinc-300">react-dynform</span>
                    </div>
                    <span className="text-zinc-600 text-xs hidden sm:block">/</span>
                    <span className="text-zinc-500 text-xs hidden sm:block">Playground</span>
                </div>

                {/* Preset Tabs */}
                <nav className="flex items-center gap-1">
                    {Object.entries(EXAMPLES).map(([key, ex]) => (
                        <button
                            key={key}
                            onClick={() => selectExample(key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${active === key
                                    ? 'bg-white text-black'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                                }`}
                        >
                            {ex.icon}
                            <span className="hidden sm:inline">{ex.label}</span>
                        </button>
                    ))}
                </nav>
            </header>

            {/* ── Split Panel ── */}
            <main className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 48px)' }}>

                {/* LEFT: Editor */}
                <div className="w-[48%] flex flex-col border-r border-zinc-800 min-w-0">
                    {/* Editor toolbar */}
                    <div className="flex items-center justify-between px-4 h-10 border-b border-zinc-800 bg-zinc-950 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 font-semibold">schema.json</span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${parseError ? 'text-red-500' : 'text-zinc-600'}`}>
                                {parseError ? '✗ invalid' : '✓'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleFormat} className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors font-mono cursor-pointer">format</button>
                            <button onClick={handleCopy} className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors font-mono cursor-pointer">
                                {copied ? <Check size={10} className="text-zinc-400" /> : <Copy size={10} />}
                                {copied ? 'copied' : 'copy'}
                            </button>
                        </div>
                    </div>

                    {/* Editor area */}
                    <div className="flex-1 relative overflow-hidden bg-zinc-950">
                        {/* Line numbers */}
                        <div className="absolute left-0 top-0 bottom-0 w-9 flex flex-col pt-4 bg-zinc-950 border-r border-zinc-800/60 overflow-hidden pointer-events-none select-none z-10">
                            {schemaText.split('\n').map((_, i) => (
                                <div key={i} className="h-[22px] flex items-center justify-end pr-2 text-[11px] font-mono text-zinc-700 leading-none shrink-0">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={schemaText}
                            onChange={e => handleEdit(e.target.value)}
                            spellCheck={false}
                            className="schema-editor absolute inset-0 w-full h-full resize-none bg-zinc-950 text-[13px] font-mono leading-[22px] pt-4 pb-4 pl-12 pr-4 outline-none border-none text-zinc-300 placeholder:text-zinc-700"
                            style={{ tabSize: 2, caretColor: '#fff' }}
                        />
                    </div>

                    {/* Error bar */}
                    {parseError && (
                        <div className="px-4 py-2 bg-red-950/40 border-t border-red-900/50 text-red-400 text-[11px] font-mono shrink-0 flex items-center gap-2 truncate">
                            <TriangleAlert size={11} /> {parseError}
                        </div>
                    )}
                </div>

                {/* RIGHT: Preview */}
                <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
                    {/* Tab bar */}
                    <div className="flex items-center border-b border-zinc-800 bg-zinc-950 shrink-0 h-10">
                        {(['preview', 'code'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-1.5 px-4 h-full text-xs font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] ${activeTab === tab
                                        ? 'border-white text-white'
                                        : 'border-transparent text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                {tab === 'preview' ? <Eye size={12} /> : <Code2 size={12} />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                        <span className="ml-auto text-[10px] font-mono text-zinc-700 pr-4 hidden md:block">
                            edit schema → live preview
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'preview' ? (
                            parseError ? (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-700">
                                    <TriangleAlert size={20} />
                                    <p className="text-sm">Fix the JSON error to preview</p>
                                </div>
                            ) : (
                                <FormPreview key={previewKey} schema={parsedSchema} />
                            )
                        ) : (
                            <div className="p-6">
                                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Usage</p>
                                <pre className="text-[12px] font-mono text-zinc-400 bg-black border border-zinc-800 rounded-lg p-5 overflow-auto leading-relaxed">
                                    {`import { DynForm } from 'react-dynform'

const schema = ${schemaText.slice(0, 180)}${schemaText.length > 180 ? '\n  // ...' : ''}

function MyForm() {
  return (
    <DynForm
      schema={schema}
      onSubmit={(values) => {
        console.log(values)
      }}
    />
  )
}`}
                                </pre>
                                <div className="mt-4">
                                    <div className="inline-flex items-center gap-2 text-[11px] font-mono text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2">
                                        <span className="text-zinc-700">$</span>
                                        <span className="text-zinc-400">npm install react-dynform</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ── Form Styles (shadcn-like) ── */}
            <style>{`
        .dynform-preview h2 {
          font-size: 18px; font-weight: 600; color: #fafafa;
          margin-bottom: 4px; letter-spacing: -0.3px;
        }
        .dynform-preview > p {
          font-size: 13px; color: #71717a; margin-bottom: 24px; line-height: 1.5;
        }
        .dynform-preview > div { margin-bottom: 0 !important; }
        .dynform-preview form > div { margin-bottom: 14px; }

        .dynform-preview label {
          display: block; font-size: 13px; font-weight: 500;
          color: #e4e4e7; margin-bottom: 6px;
        }

        .dynform-preview input[type="text"],
        .dynform-preview input[type="email"],
        .dynform-preview input[type="password"],
        .dynform-preview input[type="number"],
        .dynform-preview input[type="date"],
        .dynform-preview textarea,
        .dynform-preview select {
          width: 100%; padding: 8px 12px;
          background: #09090b; border: 1px solid #27272a;
          border-radius: 6px; color: #fafafa;
          font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .dynform-preview input::placeholder,
        .dynform-preview textarea::placeholder { color: #52525b; }
        .dynform-preview input:focus,
        .dynform-preview textarea:focus,
        .dynform-preview select:focus {
          border-color: #71717a;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
        }
        .dynform-preview input[aria-invalid="true"],
        .dynform-preview textarea[aria-invalid="true"],
        .dynform-preview select[aria-invalid="true"] {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
        }
        .dynform-preview select {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2371717a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-repeat: no-repeat; background-position: right 10px center;
          background-size: 16px; padding-right: 36px;
        }
        .dynform-preview select option { background: #09090b; }
        .dynform-preview textarea { resize: vertical; }

        .dynform-preview input[type="checkbox"] {
          width: 15px; height: 15px; border-radius: 3px;
          accent-color: #fff; cursor: pointer;
          vertical-align: middle; margin-right: 8px; position: relative; top: -1px;
        }

        [role="alert"] {
          display: block !important; margin-top: 5px !important;
          color: #f87171 !important; font-size: 12px !important;
          font-weight: 400 !important; line-height: 1.4 !important;
        }
        small { color: #52525b; font-size: 11px; margin-top: 4px; display: block; }

        /* Radio card style */
        .dynform-preview [role="radiogroup"] {
          display: flex; flex-direction: column; gap: 6px;
        }
        .dynform-preview [role="radiogroup"] label {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; background: #09090b; border: 1px solid #27272a;
          border-radius: 6px; cursor: pointer; transition: border-color 0.15s;
          font-size: 13px !important; color: #a1a1aa !important; margin-bottom: 0 !important;
          font-weight: 400 !important;
        }
        .dynform-preview [role="radiogroup"] label:hover { border-color: #52525b; color: #e4e4e7 !important; }
        .dynform-preview [role="radiogroup"] input[type="radio"] { accent-color: #fff; }

        /* Step pills */
        .dynform-preview [role="progressbar"] > div {
          display: flex !important; gap: 4px !important; margin-bottom: 20px !important;
          padding: 0 !important; background: transparent !important; border: none !important;
        }
        .dynform-preview [role="progressbar"] > div > span {
          flex: 1; text-align: center; padding: 6px 4px !important;
          font-size: 11px !important; font-weight: 500 !important;
          border-radius: 5px; transition: all 0.2s;
          border: 1px solid #27272a; color: #52525b !important; background: transparent;
        }
        .dynform-preview [role="progressbar"] > div > span[data-active="true"],
        .dynform-preview [role="progressbar"] > div > span:first-child {
          background: #18181b !important; border-color: #3f3f46 !important; color: #e4e4e7 !important;
        }

        /* Submit button */
        .dynform-preview button[type="submit"] {
          padding: 8px 20px; border-radius: 6px; font-weight: 500;
          font-size: 13px; cursor: pointer; border: none;
          background: #ffffff; color: #09090b;
          transition: background 0.15s, opacity 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .dynform-preview button[type="submit"]:hover:not(:disabled) { background: #e4e4e7; }
        .dynform-preview button[type="submit"]:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Secondary / next / back button */
        .dynform-preview button[type="button"] {
          padding: 8px 16px; border-radius: 6px; font-weight: 500;
          font-size: 13px; cursor: pointer;
          background: transparent; color: #a1a1aa;
          border: 1px solid #27272a;
          transition: all 0.15s; font-family: 'Inter', sans-serif;
        }
        .dynform-preview button[type="button"]:hover {
          background: #18181b; color: #e4e4e7; border-color: #3f3f46;
        }
        .dynform-preview > div:last-child { display: flex; gap: 8px; margin-top: 20px !important; }
      `}</style>
        </div>
    )
}
