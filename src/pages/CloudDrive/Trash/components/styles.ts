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
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.98)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  z-index: 1000;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? '0 -1px 2px rgba(255, 255, 255, 0.05)' 
    : '0 -1px 6px rgba(0, 0, 0, 0.1)'};

  .ant-space {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 0 12px;
  }

  .ant-btn {
    height: 44px;
    width: 100%;
    border-radius: 22px;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .anticon {
      font-size: 18px;
      margin-right: 6px;
    }
  }

  .ant-typography {
    position: fixed;
    top: auto;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: ${props => props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
    padding: 6px 16px;
    border-radius: 16px 16px 0 0;
    font-size: 13px;
    white-space: nowrap;
    margin-bottom: 0;
  }
`; 