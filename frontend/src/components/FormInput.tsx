import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  hint,
  options = [],
  rows = 3
}: FormInputProps) => {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className={error ? 'border-destructive' : ''}
          />
        );
      
      case 'select':
        return (
          <Select value={value.toString()} onValueChange={onChange}>
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return (
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {renderInput()}
      
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <div className="flex items-center space-x-1 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FormInput;