import { Card, CardContent, styled, TextField } from '@mui/material';
import { Handle } from 'reactflow';

export const NodeCard = styled(Card)(({ theme }) => ({
  minWidth: 150,
  maxWidth: 250,
  borderRadius: '8px',
  boxShadow: theme.shadows[2],
  border: '1px solid',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

export const StyledHandle = styled(Handle)(({ theme }) => ({
  width: '6px',
  height: '6px',
  background: theme.palette.grey[700],
  border: `1px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[1],
}));

export const StyledCardContent = styled(CardContent)({
  padding: '8px !important',
  '&:last-child': {
    paddingBottom: '8px !important',
  }
});

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: '13px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '4px 8px',
    lineHeight: '1.3',
    '&::placeholder': {
      opacity: 0.7,
      fontSize: '13px',
    },
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
    opacity: 0.8,
  },
})); 