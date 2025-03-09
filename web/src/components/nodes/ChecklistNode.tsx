import { memo, useState } from 'react';
import { Position } from 'reactflow';
import { styled, Box, IconButton, Checkbox, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { NodeCard, StyledHandle, StyledCardContent } from './NodeStyles';
import { NodeData, ChecklistItem } from '../../types';

const ChecklistNodeCard = styled(NodeCard)(({ theme }) => ({
  backgroundColor: '#e6d5fd',
  borderColor: '#6002ee',
  '& .MuiInputBase-root': {
    backgroundColor: `#e6d5fd !important`,
  },
}));

const ItemContainer = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '4px',
  marginTop: '4px',
});

const ItemControls = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  opacity: 0,
  transition: 'opacity 0.2s',
  '&:hover': {
    opacity: 1,
  },
});

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

const StyledCheckbox = styled(Checkbox)({
  padding: '4px',
  marginTop: '4px',
});

interface ChecklistNodeProps {
  data: NodeData;
  isConnectable: boolean;
  id: string;
}

const ChecklistNode = ({ data, isConnectable, id }: ChecklistNodeProps) => {
  const [items, setItems] = useState<ChecklistItem[]>(data.checklistItems || []);

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const evt = {
      target: {
        id,
        value: { 
          ...data, 
          label: value, 
          content: value,
          checklistItems: items,
        },
      },
    };
    window.dispatchEvent(new CustomEvent('node-label-change', { detail: evt }));
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], text: value };
    setItems(newItems);
    
    const evt = {
      target: {
        id,
        value: { 
          ...data, 
          checklistItems: newItems,
        },
      },
    };
    window.dispatchEvent(new CustomEvent('node-label-change', { detail: evt }));
  };

  const addItem = () => {
    const newItems = [...items, { text: '' }];
    setItems(newItems);
    
    const evt = {
      target: {
        id,
        value: { 
          ...data, 
          checklistItems: newItems,
        },
      },
    };
    window.dispatchEvent(new CustomEvent('node-label-change', { detail: evt }));
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    
    const evt = {
      target: {
        id,
        value: { 
          ...data, 
          checklistItems: newItems,
        },
      },
    };
    window.dispatchEvent(new CustomEvent('node-label-change', { detail: evt }));
  };

  return (
    <ChecklistNodeCard>
      <StyledCardContent>
        <StyledTextField
          fullWidth
          multiline
          size="small"
          value={data.label}
          onChange={handleLabelChange}
          placeholder="Введите заголовок чек-листа"
        />
        
        {items.map((item, index) => (
          <ItemContainer key={index}>
            <StyledCheckbox disabled checked={false} size="small" />
            <Box sx={{ flex: 1 }}>
              <StyledTextField
                fullWidth
                multiline
                size="small"
                value={item.text}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder="Введите пункт"
              />
            </Box>
            <ItemControls>
              <IconButton 
                size="small" 
                onClick={() => removeItem(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ItemControls>
          </ItemContainer>
        ))}
        
        <Box sx={{ mt: 1 }}>
          <IconButton 
            size="small" 
            onClick={addItem}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </StyledCardContent>
      <StyledHandle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
    </ChecklistNodeCard>
  );
};

export default memo(ChecklistNode); 