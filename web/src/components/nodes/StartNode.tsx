import { memo } from 'react';
import { Position } from 'reactflow';
import { styled, TextField } from '@mui/material';
import { NodeCard, StyledHandle, StyledCardContent } from './NodeStyles';
import { NodeData } from '../../types';

const StartNodeCard = styled(NodeCard)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  borderColor: theme.palette.warning.main,
  '& .MuiInputBase-root': {
    backgroundColor: `${theme.palette.warning.light} !important`,
    color: 'rgba(0, 0, 0, 0.87) !important',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: '13px',
    padding: '4px 8px',
    backgroundColor: 'transparent',
    '& fieldset': {
      border: 'none',
    },
  },
}));

interface StartNodeProps {
  data: NodeData;
  isConnectable: boolean;
}

const StartNode = ({ data, isConnectable }: StartNodeProps) => {
  return (
    <StartNodeCard>
      <StyledCardContent>
        <StyledTextField
          fullWidth
          size="small"
          value={data.label}
          disabled
          multiline
        />
      </StyledCardContent>
      <StyledHandle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </StartNodeCard>
  );
};

export default memo(StartNode); 