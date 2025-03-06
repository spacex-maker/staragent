import styled from 'styled-components';

export const TableWrapper = styled.div`
  .ant-table-row {
    transition: all 0.3s ease;
  }
  
  .folder-row {
    background-color: ${props => props.theme.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(24, 144, 255, 0.02)'};
    
    &:hover {
      background-color: ${props => props.theme.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(24, 144, 255, 0.04)'} !important;
    }
  }
`;

export const ToolBarWrapper = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MobileActionBar = styled.div`
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(10px);
  padding: 12px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
`; 