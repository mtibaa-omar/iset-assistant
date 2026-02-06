export function Table({ children, className = "" }) {
  return (
    <table className={`w-full text-sm ${className}`}>
      {children}
    </table>
  );
}

export function TableHead({ children, className = "" }) {
  return (
    <thead className={className}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = "", onClick }) {
  return (
    <tr className={className} onClick={onClick}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = "", style }) {
  return (
    <th className={`text-left font-medium text-slate-700 dark:text-slate-300 py-3 px-6 ${className}`} style={style}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", colSpan }) {
  return (
    <td className={`py-4 px-6 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  );
}
