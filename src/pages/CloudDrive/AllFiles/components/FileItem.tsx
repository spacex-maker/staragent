import React, { memo, useState } from 'react';
import { Space, Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FileModel } from 'models/file/FileModel';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import RenameModal from './RenameModal';
import FileIcon from './FileIcon';
import FileName from './FileName';

const FileItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    background-color: var(--ant-color-bg-elevated);
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
`;

const FileNameContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
`;

const FileNameWrapper = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const ActionButton = styled(Button)`
  flex-shrink: 0;
  margin-left: 4px;
`;

interface FileItemProps {
  file: FileModel;
  onFolderClick?: (file: FileModel) => void;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  onFolderClick
}) => {
  const intl = useIntl();
  const [isRenaming, setIsRenaming] = useState(false);

  return (
    <FileItemWrapper>
      <FileIcon file={file} />
      <FileInfo>
        <FileNameContainer>
          <FileNameWrapper>
            <FileName file={file} onClick={onFolderClick} />
          </FileNameWrapper>
          {file.isDirectory && (
            <Tooltip title={intl.formatMessage({ id: 'filelist.action.rename' })}>
              <ActionButton
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                }}
              />
            </Tooltip>
          )}
        </FileNameContainer>
      </FileInfo>

      <RenameModal
        file={file}
        isOpen={isRenaming}
        onClose={() => setIsRenaming(false)}
      />
    </FileItemWrapper>
  );
};

export default memo(FileItem); 