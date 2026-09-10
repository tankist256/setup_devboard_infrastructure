export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark focus:ring-brand shadow-sm hover:shadow-md',
    secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}
