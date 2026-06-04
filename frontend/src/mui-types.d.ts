import '@mui/material/Typography';
import '@mui/material/TextField';

declare module '@mui/material/Typography' {
  interface TypographyOwnProps {
    fontWeight?: string | number;
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldProps {
    InputProps?: any;
  }
}
