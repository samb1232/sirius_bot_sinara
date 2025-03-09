import { useState, useEffect, useCallback } from 'react';
import { Alert, Box, styled, IconButton, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ChatBotNode, Edge } from '../types';
import { useReactFlow } from 'reactflow';

const AlertContainer = styled(Box)({
  position: 'fixed',
  top: 76,
  right: 20,
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  maxWidth: 250,
});

const StyledAlert = styled(Alert)({
  padding: '0px 4px',
  minHeight: '24px',
  '& .MuiAlert-message': {
    padding: '4px 0',
    fontSize: '11px',
  },
  '& .MuiAlert-icon': {
    padding: '4px 0',
    marginRight: '4px',
    fontSize: '16px',
  },
  '& .MuiAlert-action': {
    padding: '0px',
    marginRight: '0px',
  },
});

const ErrorSummary = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasOnlyWarnings'
})<{ hasOnlyWarnings?: boolean }>(({ hasOnlyWarnings }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '2px 6px',
  borderRadius: '4px',
  backgroundColor: hasOnlyWarnings ? 'rgba(237, 108, 2, 0.8)' : 'rgba(211, 47, 47, 0.8)',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '11px',
  '&:hover': {
    backgroundColor: hasOnlyWarnings ? 'rgba(237, 108, 2, 0.9)' : 'rgba(211, 47, 47, 0.9)',
  },
}));

interface ValidationError {
  message: string;
  severity: 'error' | 'warning';
  nodeIds: string[];
}

interface ValidationAlertProps {
  nodes: ChatBotNode[];
  edges: Edge[];
  onValidationChange: (errors: ValidationError[]) => void;
}

const ValidationAlert = ({ nodes, edges, onValidationChange }: ValidationAlertProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { fitView, setNodes } = useReactFlow();

  const focusNodes = (nodeIds: string[]) => {
    if (nodeIds.length === 0) return;

    // Подсвечиваем проблемные ноды
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: nodeIds.includes(node.id),
      }))
    );

    // Центрируем вид на выбранных нодах
    fitView({
      duration: 800,
      padding: 0.5,
      nodes: nodes.filter((node) => nodeIds.includes(node.id)),
    });
  };

  const validateFlow = useCallback(() => {
    const errors: ValidationError[] = [];
    const startNodes = nodes.filter(node => node.data.type === 'start');
    const questionNodes = nodes.filter(node => node.data.type === 'question');
    const answerNodes = nodes.filter(node => node.data.type === 'answer');
    const checklistNodes = nodes.filter(node => node.data.type === 'checklist');

    // Находим вопросы без ответов или чеклистов
    const questionsWithoutAnswers = questionNodes.filter(node => {
      const hasConnectedAnswerOrChecklist = edges.some(edge => 
        edge.source === node.id && 
        nodes.find(n => n.id === edge.target)?.data.type === 'answer' ||
        nodes.find(n => n.id === edge.target)?.data.type === 'checklist'
      );
      return !hasConnectedAnswerOrChecklist;
    });

    if (questionsWithoutAnswers.length > 0) {
      errors.push({
        message: `${questionsWithoutAnswers.length} ${
          questionsWithoutAnswers.length === 1 ? 'вопрос без ответа' : 'вопроса без ответа'
        }`,
        severity: 'warning',
        nodeIds: questionsWithoutAnswers.map(node => node.id)
      });
    }

    // Находим чеклисты без пунктов
    const emptyChecklists = checklistNodes.filter(node => {
      return !node.data.checklistItems || node.data.checklistItems.length === 0;
    });

    if (emptyChecklists.length > 0) {
      errors.push({
        message: `${emptyChecklists.length} ${
          emptyChecklists.length === 1 ? 'чеклист без пунктов' : 'чеклиста без пунктов'
        }`,
        severity: 'warning',
        nodeIds: emptyChecklists.map(node => node.id)
      });
    }

    // Проверяем, есть ли хоть один вопрос, подключенный к старту
    const startNode = startNodes.find(node => node.data.type === 'start');
    if (startNode) {
      const hasConnectedQuestion = edges.some(edge => 
        edge.source === startNode.id && 
        nodes.find(n => n.id === edge.target)?.data.type === 'question'
      );
      
      if (!hasConnectedQuestion) {
        errors.push({
          message: 'Нет вопросов, подключенных к старту',
          severity: 'error',
          nodeIds: [startNode.id]
        });
      }
    }

    // Находим вопросы без входящих соединений
    const disconnectedQuestions = questionNodes.filter(node => {
      const hasIncomingConnection = edges.some(edge => 
        edge.target === node.id &&
        (nodes.find(n => n.id === edge.source)?.data.type === 'start' ||
         nodes.find(n => n.id === edge.source)?.data.type === 'question')
      );
      return !hasIncomingConnection;
    });

    if (disconnectedQuestions.length > 0) {
      errors.push({
        message: `${disconnectedQuestions.length} ${
          disconnectedQuestions.length === 1 ? 'вопрос не имеет входящих связей' : 'вопроса не имеют входящих связей'
        }`,
        severity: 'warning',
        nodeIds: disconnectedQuestions.map(node => node.id)
      });
    }

    // Находим ответы и чеклисты без входящих соединений
    const disconnectedAnswers = answerNodes.filter(node => {
      const hasIncomingConnection = edges.some(edge => 
        edge.target === node.id &&
        nodes.find(n => n.id === edge.source)?.data.type === 'question'
      );
      return !hasIncomingConnection;
    });

    if (disconnectedAnswers.length > 0) {
      errors.push({
        message: `${disconnectedAnswers.length} ${
          disconnectedAnswers.length === 1 ? 'ответ не подключен к вопросу' : 'ответа не подключены к вопросам'
        }`,
        severity: 'warning',
        nodeIds: disconnectedAnswers.map(node => node.id)
      });
    }

    // Проверяем неподключенные узлы на пустоту
    const disconnectedNodes = nodes.filter(node => {
      if (node.data.type === 'start') return false;
      
      const isConnected = edges.some(edge => 
        edge.source === node.id || edge.target === node.id
      );
      
      if (!isConnected) {
        return !node.data.label.trim();
      }
      return false;
    });

    if (disconnectedNodes.length > 0) {
      errors.push({
        message: `${disconnectedNodes.length} ${
          disconnectedNodes.length === 1 ? 'неподключенный узел не заполнен' : 'неподключенных узла не заполнены'
        }`,
        severity: 'warning',
        nodeIds: disconnectedNodes.map(node => node.id)
      });
    }

    // Проверяем пустые тексты в подключенных узлах
    const connectedEmptyNodes = nodes.filter(node => {
      if (node.data.type === 'start') return false;
      
      const isConnected = edges.some(edge => 
        edge.source === node.id || edge.target === node.id
      );
      
      if (isConnected) {
        return !node.data.label.trim();
      }
      return false;
    });

    if (connectedEmptyNodes.length > 0) {
      const questions = connectedEmptyNodes.filter(node => node.data.type === 'question');
      const answers = connectedEmptyNodes.filter(node => 
        node.data.type === 'answer' || node.data.type === 'checklist'
      );

      if (questions.length > 0) {
        errors.push({
          message: `${questions.length} ${
            questions.length === 1 ? 'подключенный вопрос не заполнен' : 'подключенных вопроса не заполнены'
          }`,
          severity: 'warning',
          nodeIds: questions.map(node => node.id)
        });
      }

      if (answers.length > 0) {
        errors.push({
          message: `${answers.length} ${
            answers.length === 1 ? 'подключенный ответ не заполнен' : 'подключенных ответа не заполнены'
          }`,
          severity: 'warning',
          nodeIds: answers.map(node => node.id)
        });
      }
    }

    // Проверка на пустые пункты в чек-листах
    checklistNodes.forEach(node => {
      const emptyItems = node.data.checklistItems?.filter(item => !item.text.trim());
      if (emptyItems && emptyItems.length > 0) {
        errors.push({
          message: `Чек-лист "${node.data.label}" содержит ${emptyItems.length} пустых пунктов`,
          severity: 'warning',
          nodeIds: [node.id],
        });
      }
    });

    return errors;
  }, [nodes, edges]);

  const errors = validateFlow();

  useEffect(() => {
    onValidationChange(errors);
  }, [errors, onValidationChange]);

  if (errors.length === 0) return null;

  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;
  const hasOnlyWarnings = errorCount === 0 && warningCount > 0;

  return (
    <AlertContainer>
      <ErrorSummary hasOnlyWarnings={hasOnlyWarnings} onClick={() => setIsExpanded(!isExpanded)}>
        <ErrorOutlineIcon sx={{ fontSize: 20 }} />
        <span>
          {errorCount > 0 && `${errorCount} ошибк${errorCount === 1 ? 'а' : 'и'}`}
          {errorCount > 0 && warningCount > 0 && ' и '}
          {warningCount > 0 && `${warningCount} предупреждени${warningCount === 1 ? 'е' : 'я'}`}
        </span>
        <IconButton 
          size="small" 
          sx={{ padding: 0, color: 'inherit', marginLeft: 'auto' }}
        >
          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </ErrorSummary>
      <Collapse in={isExpanded}>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {errors.map((error, index) => (
            <StyledAlert 
              key={index} 
              severity={error.severity} 
              variant="filled"
              sx={{ cursor: 'pointer' }}
              onClick={() => focusNodes(error.nodeIds)}
            >
              {error.message}
            </StyledAlert>
          ))}
        </Box>
      </Collapse>
    </AlertContainer>
  );
};

export default ValidationAlert; 