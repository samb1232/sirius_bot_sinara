import { AppBar, Toolbar as MuiToolbar, IconButton, styled, Tooltip, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#fff',
  color: '#000',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
});

const StyledToolbar = styled(MuiToolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  minHeight: '56px !important',
});

const Title = styled(Typography)({
  fontWeight: 500,
  fontSize: '20px',
});

const StyledIconButton = styled(IconButton)({
  color: 'rgba(0, 0, 0, 0.54)',
  '&.Mui-disabled': {
    color: 'rgba(0, 0, 0, 0.26)',
  },
});

interface ToolbarProps {
  onExport: () => void;
  hasErrors: boolean;
}

const Toolbar = ({ onExport, hasErrors }: ToolbarProps) => {
  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <Title>ЧаВошка</Title>
        <Tooltip title={hasErrors ? "Исправьте ошибки перед экспортом" : "Экспорт бота"}>
          <span>
            <StyledIconButton
              onClick={onExport}
              disabled={hasErrors}
              size="small"
            >
              <SaveIcon />
            </StyledIconButton>
          </span>
        </Tooltip>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Toolbar; 