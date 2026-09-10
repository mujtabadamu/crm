import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const baseClasses =
  'w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]'

function Wrapper({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-[var(--color-text)]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-[var(--color-danger)]">{error}</span>}
    </label>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function TextField({ label, error, className = '', ...props }: TextFieldProps) {
  return (
    <Wrapper label={label} error={error}>
      <input className={`${baseClasses} ${className}`} {...props} />
    </Wrapper>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
}

export function SelectField({ label, error, className = '', children, ...props }: SelectFieldProps) {
  return (
    <Wrapper label={label} error={error}>
      <select className={`${baseClasses} ${className}`} {...props}>
        {children}
      </select>
    </Wrapper>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function TextAreaField({ label, error, className = '', ...props }: TextAreaFieldProps) {
  return (
    <Wrapper label={label} error={error}>
      <textarea className={`${baseClasses} ${className}`} {...props} />
    </Wrapper>
  )
}
