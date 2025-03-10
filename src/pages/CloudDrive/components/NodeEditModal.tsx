import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import type { UserStorageNode } from 'services/storageService';

interface NodeEditModalProps {
  open: boolean;
  onClose: () => void;
  node: UserStorageNode | null;
  onSave: (nodeId: number, values: { nodeName: string }) => Promise<boolean>;
}

const NodeEditModal: React.FC<NodeEditModalProps> = ({
  open,
  onClose,
  node,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    if (open && node) {
      form.setFieldsValue({
        name: node.nodeName,
      });
    }
  }, [open, node, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (node) {
        setSaving(true);
        const success = await onSave(node.id, { nodeName: values.name });
        if (success) {
          onClose();
          form.resetFields();
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={<FormattedMessage id="cloudDrive.nodeEdit.title" defaultMessage="编辑节点" />}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={saving}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: node?.nodeName }}
      >
        <Form.Item
          name="name"
          label={<FormattedMessage id="cloudDrive.nodeEdit.name" defaultMessage="节点名称" />}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'cloudDrive.nodeEdit.nameRequired', defaultMessage: '请输入节点名称' }) },
            { max: 50, message: intl.formatMessage({ id: 'cloudDrive.nodeEdit.nameMaxLength', defaultMessage: '节点名称不能超过50个字符' }) }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NodeEditModal; 