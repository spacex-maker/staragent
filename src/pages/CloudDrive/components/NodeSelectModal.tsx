import React, { useState } from 'react';
import { Modal, Card, Tag, Typography, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { CheckCircleFilled, EditOutlined } from '@ant-design/icons';
import { formatFileSize } from 'utils/format';
import type { UserStorageNode } from 'services/storageService';
import NodeEditModal from './NodeEditModal';

const { Text } = Typography;

interface NodeSelectModalProps {
  open: boolean;
  onClose: () => void;
  nodes: UserStorageNode[];
  selectedNodeId: number | null;
  onNodeSelect: (nodeId: number) => void;
  onNodeUpdate: (nodeId: number, values: { nodeName: string }) => Promise<boolean>;
}

const NodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const NodeCard = styled(Card)<{ $isSelected: boolean }>`
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#fff'};
  border-color: ${props => props.$isSelected 
    ? (props.theme.mode === 'dark' ? '#177ddc' : '#1890ff')
    : (props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#d9d9d9')};

  &:hover {
    border-color: ${props => props.theme.mode === 'dark' ? '#177ddc' : '#1890ff'};
  }

  ${props => props.$isSelected && `
    .ant-card-head {
      background: ${props.theme.mode === 'dark' ? 'rgba(23, 125, 220, 0.1)' : '#e6f7ff'};
      border-bottom-color: ${props.theme.mode === 'dark' ? '#177ddc' : '#1890ff'};
    }

    .ant-card-body {
      background: ${props.theme.mode === 'dark' ? 'rgba(23, 125, 220, 0.04)' : 'transparent'};
    }
  `}

  .storage-info {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  }

  .storage-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const EditIconButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
  position: absolute;
  right: 12px;

  &:hover {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'};
  }

  .anticon {
    color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
    font-size: 16px;
  }
`;

const CardTitle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-right: 40px;

  &:hover ${EditIconButton} {
    opacity: 1;
  }
`;

const NodeSelectModal: React.FC<NodeSelectModalProps> = ({
  open,
  onClose,
  nodes,
  selectedNodeId,
  onNodeSelect,
  onNodeUpdate,
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditNode, setCurrentEditNode] = useState<UserStorageNode | null>(null);

  const handleEditClick = (e: React.MouseEvent, node: UserStorageNode) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentEditNode(node);
    setEditModalVisible(true);
  };

  const renderCardTitle = (node: UserStorageNode) => (
    <CardTitle>
      <Tooltip title={node.nodeRegion}>
        <span>
          {node.nodeName}
          {node.isDefault && (
            <Tag color="gold" style={{ marginLeft: 8 }}>
              <FormattedMessage id="common.default" defaultMessage="默认" />
            </Tag>
          )}
          {node.id === selectedNodeId && (
            <CheckCircleFilled
              style={{
                color: '#52c41a',
                marginLeft: 8,
              }}
            />
          )}
        </span>
      </Tooltip>
      <EditIconButton onClick={(e) => handleEditClick(e, node)}>
        <EditOutlined />
      </EditIconButton>
    </CardTitle>
  );

  return (
    <>
      <Modal
        title={<FormattedMessage id="cloudDrive.nodeSelect.title" defaultMessage="选择存储节点" />}
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <NodeGrid>
          {nodes.map(node => (
            <NodeCard
              key={node.id}
              $isSelected={node.id === selectedNodeId}
              size="small"
              onClick={() => onNodeSelect(node.id)}
              title={renderCardTitle(node)}
            >
              <div className="storage-info">
                <div className="storage-item">
                  <Text type="secondary">
                    <FormattedMessage id="common.nodeType" defaultMessage="节点类型" />
                  </Text>
                  <Tag color={node.nodeType === 'STANDARD' ? 'blue' : 'purple'}>
                    {node.nodeType}
                  </Tag>
                </div>
                
                <div className="storage-item">
                  <Text type="secondary">
                    <FormattedMessage id="common.storageUsed" defaultMessage="已用空间" />
                  </Text>
                  <Text>{formatFileSize(node.storageUsed)}</Text>
                </div>
                
                <div className="storage-item">
                  <Text type="secondary">
                    <FormattedMessage id="common.storageAvailable" defaultMessage="可用空间" />
                  </Text>
                  <Text>{formatFileSize(node.storageAvailable)}</Text>
                </div>
              </div>
            </NodeCard>
          ))}
        </NodeGrid>
      </Modal>

      <NodeEditModal
        open={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setCurrentEditNode(null);
        }}
        node={currentEditNode}
        onSave={onNodeUpdate}
      />
    </>
  );
};

export default NodeSelectModal; 