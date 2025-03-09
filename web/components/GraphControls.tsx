import { Box, Card, CardContent, Typography, styled, useTheme, Theme } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ChatIcon from '@mui/icons-material/Chat';
import ChecklistIcon from '@mui/icons-material/CheckBox';
import { useReactFlow } from 'reactflow';

const ControlsContainer = styled(Box)({
  position: 'absolute',
  bottom: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '12px',
  zIndex: 1000,
});

const NodeCard = styled(Card)(({ theme }) => ({
  minWidth: 80,
  maxWidth: 120,
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const CardInner = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  padding: '8px !important',
  '&:last-child': {
    paddingBottom: '8px !important',
  },
});

interface IconWrapperProps {
  color: string;
}

const IconWrapper = styled(Box)<IconWrapperProps>(({ theme, color }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  '& svg': {
    fontSize: '1.2rem',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
  textAlign: 'center',
  fontSize: '0.7rem',
  lineHeight: 1.2,
}));

interface GraphControlsProps {
  onDragStart: (event: React.DragEvent, nodeType: 'question' | 'answer' | 'checklist') => void;
}

const GraphControls = ({ onDragStart }: GraphControlsProps) => {
  const reactFlowInstance = useReactFlow();
  const theme = useTheme();

  const handleDragStart = (event: React.DragEvent, nodeType: 'question' | 'answer' | 'checklist') => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';

    // Создаем превью для перетаскивания
    const preview = document.createElement('div');
    preview.className = 'dnd-preview';
    preview.style.position = 'absolute';
    preview.style.left = '-1000px';
    document.body.appendChild(preview);
    event.dataTransfer.setDragImage(preview, 0, 0);

    onDragStart(event, nodeType);
  };

  return (
    <ControlsContainer>
      <NodeCard
        draggable
        onDragStart={(event) => handleDragStart(event, 'question')}
      >
        <CardInner>
          <IconWrapper color={theme.palette.primary.main}>
            <QuestionMarkIcon />
          </IconWrapper>
          <StyledTypography variant="body2" color="text.secondary">
            Добавить вопрос
          </StyledTypography>
        </CardInner>
      </NodeCard>

      <NodeCard
        draggable
        onDragStart={(event) => handleDragStart(event, 'answer')}
      >
        <CardInner>
          <IconWrapper color={theme.palette.secondary.main}>
            <ChatIcon />
          </IconWrapper>
          <StyledTypography variant="body2" color="text.secondary">
            Добавить ответ
          </StyledTypography>
        </CardInner>
      </NodeCard>

      <NodeCard
        draggable
        onDragStart={(event) => handleDragStart(event, 'checklist')}
      >
        <CardInner>
          <IconWrapper color="#6002ee">
            <ChecklistIcon />
          </IconWrapper>
          <StyledTypography variant="body2" color="text.secondary">
            Добавить чек-лист
          </StyledTypography>
        </CardInner>
      </NodeCard>
    </ControlsContainer>
  );
};

export default GraphControls; 