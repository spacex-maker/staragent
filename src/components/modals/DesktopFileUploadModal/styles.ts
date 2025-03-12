import styled from 'styled-components';

export const FileName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
  
  .file-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .icon {
    font-size: 16px;
    flex-shrink: 0;
  }
  
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    flex: 1;
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }
`;

export const FileSize = styled.span`
  color: var(--ant-color-text-secondary);
  font-size: 12px;
`;

export const ProgressText = styled.span`
  color: var(--ant-color-text);
  font-size: 12px;
  white-space: nowrap;
  
  .uploaded {
    color: var(--ant-color-primary);
  }
  
  .total {
    color: var(--ant-color-text-secondary);
  }
`;

export const TotalProgressText = styled.div`
  margin-top: 8px;
  font-size: 12px;
  
  .uploaded {
    color: var(--ant-color-primary);
  }
  
  .total {
    color: var(--ant-color-text-secondary);
  }
`;

export const DuplicateTag = styled.span`
  color: #faad14;
  font-size: 12px;
  margin-left: 8px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const ChunkUploadTag = styled(DuplicateTag)`
  color: #1890ff;
`;

export const AccelerateTag = styled(DuplicateTag)`
  color: #722ed1;
`; 