/**
 * FormField – wraps a label + input/select/textarea with consistent Sinhala styling.
 * Usage:
 *   <FormField label="නිෂ්පාදනයේ නම" required>
 *     <input type="text" className="input-field" ... />
 *   </FormField>
 */
const FormField = ({ label, required, hint, error, children, className = '' }) => (
  <div className={`${className}`}>
    {label && (
      <label className="label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1 text-xs">({hint})</span>}
      </label>
    )}
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
)

export default FormField
