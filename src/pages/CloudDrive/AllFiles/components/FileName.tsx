import React, { useRef, useEffect, useState } from 'react';
import { Typography, Tooltip } from 'antd';
import { FileModel } from 'models/file/FileModel';
import { getEllipsisFileName, getSmartEllipsisFileName } from 'utils/format';
import styled from 'styled-components';

const { Text } = Typography;

const StyledFileName = styled(Text)`
  display: block;
  text-align: left;
  width: 100%;
  
  &.clickable {
    cursor: pointer;
    
    &:hover {
      color: var(--ant-color-primary);
    }
  }
`;

const FileNameContainer = styled.div`
  width: 100%;
  text-align: left;
  overflow: hidden;
`;

interface FileNameProps {
  file: FileModel;
  onClick?: (file: FileModel) => void;
}

const FileName: React.FC<FileNameProps> = ({ file, onClick }) => {
  const fileNameRef = useRef<HTMLDivElement>(null);
  const [displayName, setDisplayName] = useState(file.name);

  const handleClick = () => {
    if (file.isDirectory && onClick) {
      onClick(file);
    }
  };

  useEffect(() => {
    const updateFileName = () => {
      if (fileNameRef.current) {
        const smartName = getSmartEllipsisFileName(file.name, fileNameRef.current);
        setDisplayName(smartName);
      }
    };

    // 初始更新
    updateFileName();

    // 监听窗口大小变化，重新计算文件名
    window.addEventListener('resize', updateFileName);
    
    return () => {
      window.removeEventListener('resize', updateFileName);
    };
  }, [file.name]);

  return (
    <Tooltip title={file.name}>
      <FileNameContainer ref={fileNameRef}>
        <StyledFileName
          className={file.isDirectory ? 'clickable' : ''}
          onClick={handleClick}
        >
          {displayName}
        </StyledFileName>
      </FileNameContainer>
    </Tooltip>
  );
};

export default FileName; 